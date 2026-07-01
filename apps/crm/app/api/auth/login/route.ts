import { NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth/mock-users";
import { SESSION_COOKIE, REFRESH_COOKIE, encodeToken } from "@/lib/auth/session";
import { CRM_DATA_SOURCE, CRM_API_URL } from "@/lib/crm/config";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña son obligatorios" }, { status: 400 });
  }

  // Modo API (Fase 9): autenticación real contra NestJS (JWT + bcrypt).
  if (CRM_DATA_SOURCE === "api") {
    let apiRes: Response;
    try {
      apiRes = await fetch(`${CRM_API_URL}/crm/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
    } catch {
      return NextResponse.json({ error: "No se pudo contactar al servidor" }, { status: 502 });
    }
    if (!apiRes.ok) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
    }
    const data = (await apiRes.json()) as { user: unknown; accessToken: string; refreshToken: string };
    const res = NextResponse.json({ user: data.user });
    res.cookies.set(SESSION_COOKIE, data.accessToken, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
    res.cookies.set(REFRESH_COOKIE, data.refreshToken, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  // Modo mock (Fases 0–8): credenciales en memoria, token base64 del id.
  const user = verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const res = NextResponse.json({ user });
  res.cookies.set(SESSION_COOKIE, encodeToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 h
  });
  return res;
}
