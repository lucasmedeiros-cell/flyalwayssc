"use client";

import type { DepartureStatus, ScheduledDeparture } from "@vialta/types";
import { TRANSPORT_MODE_META, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./section-header";

const STATUS: Record<DepartureStatus, { label: string; tone: "primary" | "accent" | "neutral" | "warning" }> = {
  scheduled: { label: "Programado", tone: "primary" },
  boarding: { label: "Embarcando", tone: "accent" },
  departed: { label: "Finalizado", tone: "neutral" },
  cancelled: { label: "Cancelado", tone: "warning" },
};

export function SchedulesSection({ departures }: { departures: ScheduledDeparture[] }) {
  return (
    <div>
      <SectionHeader
        title="Horarios y salidas"
        subtitle="Salidas programadas con ocupación en tiempo real."
        actionLabel="Programar salida"
      />

      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
        <div className="hidden grid-cols-[1.2fr_1.4fr_1fr_1.2fr_auto] gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
          <span>Ruta</span>
          <span>Salida</span>
          <span>Clase / Precio</span>
          <span>Ocupación</span>
          <span className="text-right">Estado</span>
        </div>

        <ul className="divide-y divide-border">
          {departures.map((d) => {
            const meta = TRANSPORT_MODE_META[d.mode];
            const status = STATUS[d.status];
            const pct = Math.round((d.seatsSold / d.seatsTotal) * 100);
            return (
              <li
                key={d.id}
                className="flex flex-col gap-3 px-5 py-4 lg:grid lg:grid-cols-[1.2fr_1.4fr_1fr_1.2fr_auto] lg:items-center lg:gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{meta.icon}</span>
                  <div>
                    <p className="font-medium">{d.routeLabel}</p>
                    <p className="text-xs text-muted-foreground">{d.vehicleName}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="font-medium tabular-nums">
                    {formatTime(d.departAt)} → {formatTime(d.arriveAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(d.departAt)}</p>
                </div>

                <div className="text-sm">
                  <p className="font-medium">{TRAVEL_CLASS_LABEL[d.travelClass]}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatMoney(d.price.amount, d.price.currency)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="tabular-nums">
                      {d.seatsSold}/{d.seatsTotal}
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 max-w-40 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={cn("h-full rounded-full", pct > 85 ? "bg-warning" : "bg-primary")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="lg:text-right">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
