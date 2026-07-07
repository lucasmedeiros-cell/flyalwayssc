"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bug,
  X,
  Send,
  Loader2,
  ImagePlus,
  AlertCircle,
  CheckCircle2,
  Inbox,
} from "lucide-react";

type Tipo = "error" | "optimizacion";
type Tab = "nuevo" | "mios";
interface MiTicket {
  id: number;
  numero_ticket?: string;
  titulo?: string;
  problema?: string;
  estado?: string;
  created_at?: string;
}

/**
 * Botón flotante "Reportar bug" (abajo a la derecha). Abre un modal para
 * reportar un error o una optimización, que se envía al sistema de tickets de
 * PetroBox a través del route handler propio `/api/bug-report` (proxy
 * server-side: mantiene el token del bot oculto y evita CORS). Los reportes
 * entran en estado "desarrollo" etiquetados con el nombre del proyecto.
 */
export function BugReportButton() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("nuevo");
  const [tipo, setTipo] = useState<Tipo>("error");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [mios, setMios] = useState<MiTicket[] | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const loadMios = useCallback(async () => {
    setMios(null);
    try {
      const r = await fetch("/api/bug-report");
      const data = await r.json();
      setMios(Array.isArray(data.tickets) ? data.tickets : []);
    } catch {
      setMios([]);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "mios") void loadMios();
  }, [open, tab, loadMios]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("tipo", tipo);
      fd.append("titulo", titulo.trim());
      fd.append("descripcion", descripcion.trim());
      fd.append("url", typeof location !== "undefined" ? location.href : "");
      fd.append("userAgent", typeof navigator !== "undefined" ? navigator.userAgent : "");
      if (file) fd.append("imagen", file);
      const r = await fetch("/api/bug-report", { method: "POST", body: fd });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "No se pudo enviar el reporte.");
      setResult({
        ok: true,
        msg: `Reporte enviado${data.numero_ticket ? ` · ${data.numero_ticket}` : ""}. ¡Gracias!`,
      });
      setTitulo("");
      setDescripcion("");
      setFile(null);
    } catch (err) {
      setResult({ ok: false, msg: err instanceof Error ? err.message : "Error al enviar." });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* FAB — abajo a la derecha */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Reportar bug o corrección"
        title="Reportar bug o corrección"
        className="fixed bottom-5 right-5 z-[80] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Bug className="h-5 w-5" />
        <span className="sr-only">Reportar bug</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-end p-4 sm:items-center sm:p-6">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Reportar bug o corrección"
            className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lg)]"
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Bug className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-base font-bold leading-tight">
                    Reportar
                  </h2>
                  <p className="text-xs text-muted-foreground">Bugs y correcciones · Desarrollo</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border px-3 pt-2">
              {(
                [
                  { k: "nuevo", label: "Nuevo reporte" },
                  { k: "mios", label: "Mis reportes" },
                ] as { k: Tab; label: string }[]
              ).map((t) => (
                <button
                  key={t.k}
                  type="button"
                  onClick={() => setTab(t.k)}
                  className={
                    "rounded-t-lg px-3 py-2 text-sm font-medium transition-colors " +
                    (tab === t.k
                      ? "border-b-2 border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {tab === "nuevo" ? (
                <form onSubmit={submit} className="space-y-3.5">
                  {/* Tipo */}
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { v: "error", label: "🐞 Error" },
                        { v: "optimizacion", label: "✨ Optimización" },
                      ] as { v: Tipo; label: string }[]
                    ).map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => setTipo(o.v)}
                        className={
                          "rounded-xl border px-3 py-2 text-sm font-medium transition-colors " +
                          (tipo === o.v
                            ? "border-primary/60 bg-primary/10 text-foreground ring-1 ring-primary/30"
                            : "border-border bg-surface text-muted-foreground hover:border-primary/40")
                        }
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="br-titulo" className="mb-1 block text-xs font-medium text-muted-foreground">
                      Título
                    </label>
                    <input
                      id="br-titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                      maxLength={120}
                      placeholder="Resumen corto del problema"
                      className="h-10 w-full rounded-xl border border-input bg-surface px-3 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
                    />
                  </div>

                  <div>
                    <label htmlFor="br-desc" className="mb-1 block text-xs font-medium text-muted-foreground">
                      Descripción
                    </label>
                    <textarea
                      id="br-desc"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={4}
                      placeholder="¿Qué pasó? ¿Cómo reproducirlo? ¿Qué esperabas?"
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
                    />
                  </div>

                  {/* Captura opcional */}
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                    <ImagePlus className="h-4 w-4 shrink-0" />
                    <span className="truncate">{file ? file.name : "Adjuntar captura (opcional)"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  {result && (
                    <p
                      className={
                        "flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm " +
                        (result.ok ? "bg-success/12 text-success" : "bg-danger/12 text-danger")
                      }
                    >
                      {result.ok ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      {result.msg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending || !titulo.trim()}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110 disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Enviar reporte
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-2.5">
                  {mios === null ? (
                    <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
                    </p>
                  ) : mios.length === 0 ? (
                    <p className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                      <Inbox className="h-6 w-6 opacity-60" />
                      Todavía no hay reportes.
                    </p>
                  ) : (
                    mios.map((t) => (
                      <div key={t.id} className="rounded-xl border border-border bg-surface-2/40 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">{t.titulo || t.problema || `#${t.id}`}</span>
                          <span className="shrink-0 rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                            {t.estado || "—"}
                          </span>
                        </div>
                        {t.numero_ticket && (
                          <span className="text-xs tabular-nums text-muted-foreground">{t.numero_ticket}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
