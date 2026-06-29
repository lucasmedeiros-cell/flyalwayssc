"use client";

import { Pencil } from "lucide-react";
import type { OperatorRoute } from "@vialta/types";
import { TRANSPORT_MODE_META, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { formatMoney } from "@/lib/utils";
import { SectionHeader } from "./section-header";

export function PricingSection({ routes }: { routes: OperatorRoute[] }) {
  return (
    <div>
      <SectionHeader
        title="Precios"
        subtitle="Tarifas base por ruta y clase. Ajusta según demanda y temporada."
      />
      <div className="space-y-4">
        {routes.map((r) => {
          const meta = TRANSPORT_MODE_META[r.mode];
          return (
            <div
              key={r.id}
              className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 font-semibold">
                  <span className="text-lg">{meta.icon}</span>
                  {r.originCity} → {r.destinationCity}
                  <span className="text-xs font-normal text-muted-foreground">
                    {r.originCode}–{r.destinationCode}
                  </span>
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {r.pricing.map((p) => (
                  <div
                    key={p.travelClass}
                    className="rounded-2xl border border-border bg-surface-2/50 px-4 py-3"
                  >
                    <p className="text-xs text-muted-foreground">{TRAVEL_CLASS_LABEL[p.travelClass]}</p>
                    <p className="mt-0.5 font-semibold tabular-nums">
                      {formatMoney(p.price.amount, p.price.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
