import { NextResponse } from "next/server";

/**
 * Proxy server-side hacia el sistema de tickets de PetroBox
 * (https://tickets.petroboxinc.com/api). Mantiene el token del bot en el
 * servidor (NO en el bundle público) y evita CORS. Los reportes entran en
 * estado "desarrollo" (el backend lo asigna por el slug ESTACION) y llevan el
 * nombre del proyecto en el título: `[<APP>][ERROR|OPTIMIZACIÓN] ...`.
 *
 * Config por variables de entorno (server-only, NO NEXT_PUBLIC):
 *   TICKETS_API_URL   (default https://tickets.petroboxinc.com/api)
 *   TICKETS_BOT_TOKEN (JWT del bot — requerido)
 *   TICKETS_BOT_ID    (id del bot en la BD — requerido)
 *   TICKETS_ESTACION  (slug MAYÚSCULAS; usar uno de APPS_BOT para caer en "desarrollo")
 *   TICKETS_APP_NAME  (nombre del proyecto en el título/tag)
 */
export const runtime = "nodejs";

const API = process.env.TICKETS_API_URL ?? "https://tickets.petroboxinc.com/api";
const TOKEN = process.env.TICKETS_BOT_TOKEN ?? "";
const BOT_ID = Number(process.env.TICKETS_BOT_ID ?? "0");
const ESTACION = process.env.TICKETS_ESTACION ?? "CRM";
const APP_NAME = process.env.TICKETS_APP_NAME ?? "FlyAlways CRM";
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0";

const authJson = () => ({ Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" });
const configured = () => Boolean(TOKEN) && BOT_ID > 0;

export async function POST(req: Request) {
  if (!configured()) {
    return NextResponse.json(
      { error: "Reporte de bugs no configurado aún (falta el token del bot)." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const tipo = String(form.get("tipo") || "error");
  const titulo = String(form.get("titulo") || "").trim();
  const descripcion = String(form.get("descripcion") || "").trim();
  const url = String(form.get("url") || "");
  const userAgent = String(form.get("userAgent") || "");
  const imagen = form.get("imagen");

  if (!titulo) {
    return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });
  }

  const tipoTag = tipo === "optimizacion" ? "OPTIMIZACIÓN" : "ERROR";
  const tituloFull = `[${APP_NAME}][${tipoTag}] ${titulo}`;

  // 1) Crear ticket. El backend lo pone en "caso_desarrollo" si ESTACION ∈ APPS_BOT.
  let created: { id: number; numero_ticket?: string; estado?: string };
  try {
    const r = await fetch(`${API}/tickets`, {
      method: "POST",
      headers: authJson(),
      body: JSON.stringify({
        titulo: tituloFull,
        problema: tituloFull,
        estacion_servicio: ESTACION,
        prioridad: tipo === "optimizacion" ? "media" : "alta",
        tecnico_asignado_id: BOT_ID,
        creado_por_id: BOT_ID,
      }),
    });
    if (!r.ok) {
      return NextResponse.json(
        { error: `No se pudo crear el ticket (${r.status}).` },
        { status: 502 },
      );
    }
    created = await r.json();
  } catch {
    return NextResponse.json({ error: "No se pudo contactar al servidor de tickets." }, { status: 502 });
  }

  const tid = created.id;

  // 2) Comentario con la descripción del usuario.
  if (descripcion) {
    await fetch(`${API}/tickets/${tid}/comentarios`, {
      method: "POST",
      headers: authJson(),
      body: JSON.stringify({ ticket_id: tid, usuario_id: BOT_ID, comentario: descripcion }),
    }).catch(() => {});
  }

  // 3) Captura opcional (campo multipart "imagenes", en plural).
  if (imagen && typeof imagen !== "string") {
    const fd = new FormData();
    fd.append("imagenes", imagen);
    fd.append("ticket_id", String(tid));
    fd.append("usuario_id", String(BOT_ID));
    await fetch(`${API}/tickets/${tid}/comentarios-imagen`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` }, // sin Content-Type: lo arma fetch con boundary
      body: fd,
    }).catch(() => {});
  }

  // 4) Comentario con logs de contexto.
  const meta = [
    `--- ${APP_NAME} ${APP_VERSION} ---`,
    `URL: ${url}`,
    `UserAgent: ${userAgent}`,
    `Fecha: ${new Date().toISOString()}`,
  ].join("\n");
  await fetch(`${API}/tickets/${tid}/comentarios`, {
    method: "POST",
    headers: authJson(),
    body: JSON.stringify({ ticket_id: tid, usuario_id: BOT_ID, comentario: meta }),
  }).catch(() => {});

  return NextResponse.json({
    id: tid,
    numero_ticket: created.numero_ticket,
    estado: created.estado,
  });
}

export async function GET() {
  if (!configured()) return NextResponse.json({ tickets: [] });
  try {
    const r = await fetch(`${API}/tickets?estacion_servicio=${encodeURIComponent(ESTACION)}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!r.ok) return NextResponse.json({ tickets: [] });
    const all = await r.json();
    // Filtra por el tag del proyecto para no mezclar con otras apps de la misma estación.
    const tag = `[${APP_NAME}]`;
    const mine = (Array.isArray(all) ? all : []).filter((t: { titulo?: string; problema?: string }) =>
      `${t.titulo || ""}${t.problema || ""}`.includes(tag),
    );
    return NextResponse.json({ tickets: mine });
  } catch {
    return NextResponse.json({ tickets: [] });
  }
}
