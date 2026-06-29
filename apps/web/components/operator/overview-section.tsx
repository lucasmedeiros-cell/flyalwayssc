"use client";

import { Bus, Route as RouteIcon, CalendarClock, Gauge, Wallet } from "lucide-react";
import type { OperatorConsole } from "@vialta/types";
import { TRANSPORT_MODE_META } from "@vialta/types";
import { formatMoney, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

export function OverviewSection({ data }: { data: OperatorConsole }) {
  const activeVehicles = data.vehicles.filter((v) => v.status === "active").length;
  const activeRoutes = data.routes.filter((r) => r.active).length;
  const live = data.departures.filter((d) => d.status === "scheduled" || d.status === "boarding");
  const billable = data.departures.filter((d) => d.status !== "cancelled");
  const occupancy =
    billable.length === 0
      ? 0
      : Math.round(
          (billable.reduce((a, d) => a + d.seatsSold / d.seatsTotal, 0) / billable.length) * 100
        );
  const revenue = billable.reduce((a, d) => a + d.seatsSold * d.price.amount, 0);
  const currency = data.departures[0]?.price.currency ?? "PEN";

  const kpis = [
    { icon: Bus, label: "Vehículos activos", value: `${activeVehicles}/${data.vehicles.length}` },
    { icon: RouteIcon, label: "Rutas activas", value: String(activeRoutes) },
    { icon: CalendarClock, label: "Salidas programadas", value: String(live.length) },
    { icon: Gauge, label: "Ocupación media", value: `${occupancy}%` },
    { icon: Wallet, label: "Ingresos (semana)", value: formatMoney(revenue, currency) },
  ];

  return (
    <div>
      <Reveal className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <RevealItem key={k.label}>
            <div className="rounded-3xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <k.icon className="h-4 w-4" />
              </span>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold tabular-nums">
                {k.value}
              </p>
              <p className="text-[11px] leading-tight text-muted-foreground">{k.label}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>

      {/* Próximas salidas */}
      <div className="mt-6 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
        <h3 className="font-semibold">Próximas salidas</h3>
        <ul className="mt-3 divide-y divide-border">
          {live.slice(0, 5).map((d) => {
            const meta = TRANSPORT_MODE_META[d.mode];
            const pct = Math.round((d.seatsSold / d.seatsTotal) * 100);
            return (
              <li key={d.id} className="flex items-center gap-4 py-3">
                <span className="text-lg">{meta.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.routeLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(d.departAt)} · {d.vehicleName}
                  </p>
                </div>
                <div className="hidden w-40 sm:block">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Ocupación</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={cn("h-full rounded-full", pct > 85 ? "bg-warning" : "bg-primary")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <Badge tone={d.status === "boarding" ? "accent" : "primary"}>
                  {d.status === "boarding" ? "Embarcando" : "Programado"}
                </Badge>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
