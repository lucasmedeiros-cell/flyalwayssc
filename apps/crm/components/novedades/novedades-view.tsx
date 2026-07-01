"use client";

import { motion } from "framer-motion";
import { Sparkles, Wrench, Bug, Newspaper, type LucideIcon } from "lucide-react";
import { Badge, type BadgeTone } from "@vialta/ui";
import { NOVEDADES, NOVEDAD_KIND_LABEL, type NovedadKind } from "@/lib/novedades";
import { APP_VERSION } from "@/lib/version";

const KIND_ICON: Record<NovedadKind, LucideIcon> = {
  feature: Sparkles,
  improvement: Wrench,
  fix: Bug,
  news: Newspaper,
};

const KIND_TONE: Record<NovedadKind, BadgeTone> = {
  feature: "primary",
  improvement: "success",
  fix: "warning",
  news: "accent",
};

export function NovedadesView() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Novedades</h1>
          <p className="mt-1 text-sm text-muted-foreground">Nuevas funciones, mejoras y noticias del sistema</p>
        </div>
        <Badge tone="primary">v{APP_VERSION}</Badge>
      </div>

      <div className="mt-8 space-y-5">
        {NOVEDADES.map((n, idx) => (
          <motion.section
            key={n.version + n.date}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="neutral">v{n.version}</Badge>
              <span className="text-xs text-muted-foreground">{n.date}</span>
            </div>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold">{n.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {n.items.map((it, i) => {
                const Icon = KIND_ICON[it.kind];
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <Badge tone={KIND_TONE[it.kind]} className="mr-2 align-middle">{NOVEDAD_KIND_LABEL[it.kind]}</Badge>
                      <span className="align-middle text-foreground">{it.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
