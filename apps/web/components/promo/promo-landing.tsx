"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, ShieldCheck, BedDouble, Utensils, Zap, Star, MapPin,
  Clock, CheckCircle2, Plane, Award, Heart, type LucideIcon,
} from "lucide-react";
import type { PromoProduct } from "@vialta/types";
import { formatMoney } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Sparkles, ShieldCheck, BedDouble, Utensils, Zap, Star, MapPin, Clock, Plane, Award, Heart, CheckCircle2,
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Contador regresivo real hasta `validUntil` (SSR-safe: 0 hasta montar). */
function Countdown({ iso, accent }: { iso: string; accent: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(iso).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [iso]);

  const d = left == null ? null : {
    days: Math.floor(left / 86400000),
    hours: Math.floor((left % 86400000) / 3600000),
    mins: Math.floor((left % 3600000) / 60000),
    secs: Math.floor((left % 60000) / 1000),
  };
  const cells: [string, number | null][] = [
    ["días", d?.days ?? null], ["hrs", d?.hours ?? null], ["min", d?.mins ?? null], ["seg", d?.secs ?? null],
  ];
  return (
    <div className="flex items-center gap-2">
      {cells.map(([label, v], i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex min-w-[3.25rem] flex-col items-center rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 backdrop-blur">
            <span className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-white" style={{ color: accent }}>
              {v == null ? "--" : pad(v)}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-white/60">{label}</span>
          </div>
          {i < cells.length - 1 && <span className="text-white/40">:</span>}
        </div>
      ))}
    </div>
  );
}

export function PromoLanding({ promo }: { promo: PromoProduct }) {
  const accent = promo.accentColor ?? "#e0a106";
  const hasDiscount = promo.originalPrice && promo.originalPrice.amount > promo.price.amount;
  const discountPct = hasDiscount
    ? Math.round((1 - promo.price.amount / promo.originalPrice!.amount) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      {/* ---------------------------------- HERO --------------------------------- */}
      <section className="relative overflow-hidden">
        {/* Imagen de fondo */}
        {promo.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={promo.imageUrl} alt={promo.productName} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/95" />
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(60% 60% at 20% 20%, ${accent}33, transparent 70%)` }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
                <Sparkles className="h-3.5 w-3.5" /> {promo.eyebrow}
              </span>
              {promo.badge && (
                <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-950" style={{ background: accent }}>
                  {promo.badge}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {promo.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">{promo.subtitle}</p>

            {/* Precio */}
            <div className="mt-7 flex flex-wrap items-end gap-3">
              <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-white sm:text-5xl">
                {formatMoney(promo.price.amount, promo.price.currency)}
              </span>
              {hasDiscount && (
                <>
                  <span className="mb-1 text-lg text-white/50 line-through">
                    {formatMoney(promo.originalPrice!.amount, promo.originalPrice!.currency)}
                  </span>
                  <span className="mb-1 rounded-full bg-success/90 px-2.5 py-1 text-sm font-bold text-white">
                    −{discountPct}%
                  </span>
                </>
              )}
              <span className="mb-1.5 text-sm text-white/60">por persona</span>
            </div>

            {/* CTA + urgencia */}
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={promo.ctaHref}
                className="btn-shine inline-flex h-13 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-slate-950 shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ background: accent }}
              >
                {promo.ctaLabel}
                <ArrowRight className="h-5 w-5" />
              </Link>
              {promo.validUntil && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-wide text-white/60">Termina en</span>
                  <Countdown iso={promo.validUntil} accent={accent} />
                </div>
              )}
            </div>

            {/* Trust row */}
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> Reserva 100% segura</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Cancelación flexible</span>
              <span className="inline-flex items-center gap-1.5"><Award className="h-4 w-4" style={{ color: accent }} /> Empresas verificadas</span>
            </div>
          </motion.div>

          {/* Stats */}
          {promo.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {promo.stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/12 bg-white/5 p-4 text-center backdrop-blur">
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-white/55">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ------------------------------- DESCRIPCIÓN ------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>{promo.productName}</span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              Todo lo que incluye tu experiencia
            </h2>
            <p className="mt-4 text-muted-foreground">{promo.description}</p>
            <Link
              href={promo.ctaHref}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              style={{ background: accent }}
            >
              {promo.ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {promo.highlights.map((h) => {
              const Icon = (h.icon && ICONS[h.icon]) || CheckCircle2;
              return (
                <div key={h.title} className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${accent}22`, color: accent }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-semibold">{h.title}</h3>
                  {h.text && <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------- CTA FINAL ----------------------------- */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(50% 120% at 50% 0%, ${accent}22, transparent 70%)` }} />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            {promo.productName}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Cupos limitados{promo.validUntil ? " · oferta por tiempo limitado" : ""}. Asegura tu lugar hoy mismo.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={promo.ctaHref}
              className="btn-shine inline-flex h-13 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-slate-950 shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: accent }}
            >
              {promo.ctaLabel} <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="font-[family-name:var(--font-display)] text-2xl font-bold">
              {formatMoney(promo.price.amount, promo.price.currency)}
              {hasDiscount && <span className="ml-2 text-base text-muted-foreground line-through">{formatMoney(promo.originalPrice!.amount, promo.originalPrice!.currency)}</span>}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
