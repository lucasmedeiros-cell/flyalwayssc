"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { OperatorRoute } from "@vialta/types";
import { TRANSPORT_MODE_META } from "@vialta/types";
import { formatDuration, formatMoney } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./section-header";

export function RoutesSection({ routes }: { routes: OperatorRoute[] }) {
  const [state, setState] = useState(() => Object.fromEntries(routes.map((r) => [r.id, r.active])));

  return (
    <div>
      <SectionHeader
        title="Rutas"
        subtitle="Orígenes, destinos y frecuencias de operación."
        actionLabel="Nueva ruta"
      />
      <div className="space-y-3">
        {routes.map((r) => {
          const meta = TRANSPORT_MODE_META[r.mode];
          const active = state[r.id];
          const from = r.pricing.reduce((min, p) => Math.min(min, p.price.amount), Infinity);
          return (
            <div
              key={r.id}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-xl">
                  {meta.icon}
                </span>
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    {r.originCity}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    {r.destinationCity}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.originCode}–{r.destinationCode} · {r.frequency} · {formatDuration(r.durationMin)} ·{" "}
                    {r.stops === 0 ? "Directo" : `${r.stops} escala`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Desde</p>
                  <p className="font-semibold tabular-nums">
                    {formatMoney(from, r.pricing[0].price.currency)}
                  </p>
                </div>
                <Badge tone={active ? "success" : "neutral"}>{active ? "Activa" : "Pausada"}</Badge>
                <Switch
                  checked={active}
                  onChange={(v) => setState((s) => ({ ...s, [r.id]: v }))}
                  label=""
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
