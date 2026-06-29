"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import type { Promotion } from "@vialta/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "./section-header";

export function PromotionsSection({ promotions }: { promotions: Promotion[] }) {
  const [state, setState] = useState(() =>
    Object.fromEntries(promotions.map((p) => [p.id, p.active]))
  );

  return (
    <div>
      <SectionHeader
        title="Promociones"
        subtitle="Códigos de descuento y campañas activas."
        actionLabel="Crear promoción"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {promotions.map((p) => {
          const active = state[p.id];
          const usage = Math.round((p.used / p.limit) * 100);
          return (
            <div
              key={p.id}
              className={cn(
                "rounded-3xl border bg-surface p-5 shadow-[var(--shadow-sm)] transition-colors",
                active ? "border-primary/40" : "border-border"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Tag className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-[family-name:var(--font-display)] font-bold tracking-wide">
                      {p.code}
                    </p>
                    <p className="text-xs text-muted-foreground">−{p.discountPct}% de descuento</p>
                  </div>
                </div>
                <Switch
                  checked={active}
                  onChange={(v) => setState((s) => ({ ...s, [p.id]: v }))}
                  label=""
                />
              </div>

              <p className="mt-4 text-sm">{p.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Válida {formatDate(p.validFrom)} – {formatDate(p.validTo)}
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Usos: {p.used}/{p.limit}
                  </span>
                  <span>{usage}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${usage}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
