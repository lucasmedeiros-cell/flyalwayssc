"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, Plus, Trash2, ExternalLink, Check, Loader2 } from "lucide-react";
import type { PromoProduct } from "@vialta/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const ICON_OPTIONS = ["Sparkles", "ShieldCheck", "BedDouble", "Utensils", "Zap", "Star", "MapPin", "Clock", "Plane", "Award", "Heart", "CheckCircle2"];

const field = "h-11 w-full rounded-2xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30";
const label = "mb-1.5 block text-xs font-medium text-muted-foreground";

const EMPTY: PromoProduct = {
  active: false, eyebrow: "Producto destacado", title: "", subtitle: "", productName: "", description: "",
  badge: "", price: { amount: 0, currency: "BOB" }, originalPrice: { amount: 0, currency: "BOB" },
  ctaLabel: "Reservar ahora", ctaHref: "/buscar", imageUrl: "", accentColor: "#e0a106",
  highlights: [], stats: [], validUntil: "",
};

export function PromoManager() {
  const [p, setP] = useState<PromoProduct>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/web/admin/promo`, { cache: "no-store" });
        if (res.ok) setP({ ...EMPTY, ...(await res.json()) });
      } catch {
        setError("No se pudo cargar la configuración (¿API activa?).");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function set<K extends keyof PromoProduct>(key: K, value: PromoProduct[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/web/admin/promo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) throw new Error(String(res.status));
      setP({ ...EMPTY, ...(await res.json()) });
      setSaved(true);
    } catch {
      setError("No se pudo guardar. Verifica que el API esté activo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-10 flex items-center gap-2 rounded-3xl border border-border bg-surface p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando configuración de la landing…
      </div>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Megaphone className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">Landing promocional</h2>
            <p className="text-sm text-muted-foreground">Personaliza y publica la vista del producto destacado en <code className="rounded bg-surface-2 px-1">/promo</code>.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Switch checked={p.active} onChange={(v) => set("active", v)} label={p.active ? "Publicada" : "Oculta"} />
          <Link href="/promo" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Ver landing <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)] lg:grid-cols-2">
        <div>
          <label className={label}>Eyebrow</label>
          <input className={field} value={p.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Producto destacado" />
        </div>
        <div>
          <label className={label}>Etiqueta / badge</label>
          <input className={field} value={p.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="Edición limitada" />
        </div>
        <div className="lg:col-span-2">
          <label className={label}>Título</label>
          <input className={field} value={p.title} onChange={(e) => set("title", e.target.value)} placeholder="Salar de Uyuni — Expedición Premium" />
        </div>
        <div className="lg:col-span-2">
          <label className={label}>Subtítulo</label>
          <input className={field} value={p.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
        </div>
        <div className="lg:col-span-2">
          <label className={label}>Nombre del producto</label>
          <input className={field} value={p.productName} onChange={(e) => set("productName", e.target.value)} />
        </div>
        <div className="lg:col-span-2">
          <label className={label}>Descripción</label>
          <textarea className={`${field} h-24 py-2.5`} value={p.description} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div>
          <label className={label}>Precio (Bs)</label>
          <input type="number" min={0} className={field} value={p.price.amount} onChange={(e) => set("price", { amount: Number(e.target.value), currency: "BOB" })} />
        </div>
        <div>
          <label className={label}>Precio anterior (Bs, opcional)</label>
          <input type="number" min={0} className={field} value={p.originalPrice?.amount ?? 0} onChange={(e) => set("originalPrice", { amount: Number(e.target.value), currency: "BOB" })} />
        </div>

        <div>
          <label className={label}>Texto del botón (CTA)</label>
          <input className={field} value={p.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} />
        </div>
        <div>
          <label className={label}>Enlace del botón</label>
          <input className={field} value={p.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="/buscar?mode=air" />
        </div>

        <div>
          <label className={label}>Imagen (URL / ruta)</label>
          <input className={field} value={p.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)} placeholder="/images/experiences/tours.jpg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Color de acento</label>
            <input type="color" className="h-11 w-full cursor-pointer rounded-2xl border border-border bg-surface px-1" value={p.accentColor ?? "#e0a106"} onChange={(e) => set("accentColor", e.target.value)} />
          </div>
          <div>
            <label className={label}>Válida hasta</label>
            <input type="datetime-local" className={field} value={(p.validUntil ?? "").slice(0, 16)} onChange={(e) => set("validUntil", e.target.value ? `${e.target.value}:00` : "")} />
          </div>
        </div>

        {/* Highlights */}
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className={label + " mb-0"}>Beneficios</label>
            <Button variant="ghost" size="sm" onClick={() => set("highlights", [...p.highlights, { icon: "CheckCircle2", title: "", text: "" }])}>
              <Plus className="h-4 w-4" /> Añadir
            </Button>
          </div>
          <div className="space-y-2">
            {p.highlights.map((h, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-2xl border border-border bg-background/40 p-2.5 sm:grid-cols-[8rem_1fr_1fr_2.5rem]">
                <select className={field} value={h.icon ?? "CheckCircle2"} onChange={(e) => { const hs = [...p.highlights]; hs[i] = { ...h, icon: e.target.value }; set("highlights", hs); }}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input className={field} placeholder="Título" value={h.title} onChange={(e) => { const hs = [...p.highlights]; hs[i] = { ...h, title: e.target.value }; set("highlights", hs); }} />
                <input className={field} placeholder="Descripción" value={h.text ?? ""} onChange={(e) => { const hs = [...p.highlights]; hs[i] = { ...h, text: e.target.value }; set("highlights", hs); }} />
                <button type="button" aria-label="Eliminar beneficio" onClick={() => set("highlights", p.highlights.filter((_, j) => j !== i))} className="inline-flex h-11 items-center justify-center rounded-2xl text-muted-foreground hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label className={label + " mb-0"}>Métricas</label>
            <Button variant="ghost" size="sm" onClick={() => set("stats", [...p.stats, { label: "", value: "" }])}>
              <Plus className="h-4 w-4" /> Añadir
            </Button>
          </div>
          <div className="space-y-2">
            {p.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_2.5rem] gap-2 rounded-2xl border border-border bg-background/40 p-2.5">
                <input className={field} placeholder="Valor (4.9 ★)" value={s.value} onChange={(e) => { const ss = [...p.stats]; ss[i] = { ...s, value: e.target.value }; set("stats", ss); }} />
                <input className={field} placeholder="Etiqueta (Valoración)" value={s.label} onChange={(e) => { const ss = [...p.stats]; ss[i] = { ...s, label: e.target.value }; set("stats", ss); }} />
                <button type="button" aria-label="Eliminar métrica" onClick={() => set("stats", p.stats.filter((_, j) => j !== i))} className="inline-flex h-11 items-center justify-center rounded-2xl text-muted-foreground hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3 lg:col-span-2">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Guardando…" : "Guardar y publicar"}
          </Button>
          {saved && <span className="text-sm font-medium text-success">✓ Cambios publicados</span>}
          {error && <span className="text-sm font-medium text-danger">{error}</span>}
        </div>
      </div>
    </section>
  );
}
