"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star, Users2, UserPlus, Activity } from "lucide-react";
import type { AdminDashboard, AdminPeriod, TransportMode } from "@vialta/types";
import { ADMIN_PERIOD_LABEL, TRANSPORT_MODE_META } from "@vialta/types";
import {
  cn,
  formatCompact,
  formatInt,
  formatMoney,
  formatMoneyCompact,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LogoBadge } from "@/components/ui/logo-badge";
import { KpiCard } from "./kpi-card";
import { AreaChart, DonutChart } from "./charts";
import { LiveActivity } from "./live-activity";

const MODE_COLOR: Record<TransportMode, string> = {
  air: "#6a5cff",
  bus: "#12b3a3",
  train: "#0f9d8f",
  private: "#8b5cf6",
};

const PERIODS: AdminPeriod[] = ["7d", "30d", "90d"];

export function AdminDashboardView({ data }: { data: AdminDashboard }) {
  const [period, setPeriod] = useState<AdminPeriod>("30d");
  const pd = data.periods[period];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard ejecutivo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visión global del negocio · últimos {ADMIN_PERIOD_LABEL[period]}
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-surface-2/70 p-1 text-sm">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "relative rounded-full px-4 py-1.5 font-medium transition-colors",
                period === p ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {period === p && (
                <motion.span
                  layoutId="admin-period-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{ADMIN_PERIOD_LABEL[p]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <motion.div
        key={period}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {pd.kpis.map((k) => (
          <KpiCard key={k.id} kpi={k} currency={data.currency} />
        ))}
      </motion.div>

      {/* Gráficos */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tendencia de ingresos */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Tendencia de ingresos</h3>
            <span className="text-sm font-semibold tabular-nums">
              {formatMoney(pd.revenue.reduce((a, r) => a + r.revenue, 0), data.currency)}
            </span>
          </div>
          <div className="mt-6 pb-6">
            <AreaChart
              key={period}
              data={pd.revenue.map((r) => ({ label: r.label, value: r.revenue }))}
              formatValue={(n) => formatMoney(n, data.currency)}
            />
          </div>
        </div>

        {/* Ventas por modo */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
          <h3 className="font-semibold">Ventas por modo</h3>
          <div className="mt-4 flex items-center gap-5">
            <DonutChart
              segments={data.salesByMode.map((s) => ({
                label: TRANSPORT_MODE_META[s.mode].label,
                value: s.share,
                color: MODE_COLOR[s.mode],
              }))}
              size={132}
              centerValue={formatMoneyCompact(
                data.salesByMode.reduce((a, s) => a + s.revenue, 0),
                data.currency
              )}
              centerLabel="total"
            />
            <ul className="flex-1 space-y-2">
              {data.salesByMode.map((s) => (
                <li key={s.mode} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: MODE_COLOR[s.mode] }}
                  />
                  <span className="flex-1">
                    {TRANSPORT_MODE_META[s.mode].icon} {TRANSPORT_MODE_META[s.mode].label}
                  </span>
                  <span className="font-semibold tabular-nums">{s.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Rutas populares + usuarios + live */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PopularRoutes data={data} />
        <UsersCard data={data} />
        <LiveActivity />
      </div>

      {/* Empresas afiliadas */}
      <div className="mt-6">
        <CompaniesTable data={data} />
      </div>
    </div>
  );
}

function PopularRoutes({ data }: { data: AdminDashboard }) {
  const max = Math.max(...data.popularRoutes.map((r) => r.bookings));
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold">Rutas populares</h3>
      <ul className="mt-4 space-y-3">
        {data.popularRoutes.map((r, i) => (
          <li key={r.id}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                <span className="truncate font-medium">
                  {TRANSPORT_MODE_META[r.mode].icon} {r.label}
                </span>
              </span>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-0.5 text-xs",
                  r.trendPct >= 0 ? "text-success" : "text-danger"
                )}
              >
                {r.trendPct >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(r.trendPct)}%
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(r.bookings / max) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                {formatCompact(r.bookings)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsersCard({ data }: { data: AdminDashboard }) {
  const activePct = Math.round((data.usersActive / data.usersTotal) * 100);
  const rows = [
    { icon: Users2, label: "Usuarios totales", value: formatInt(data.usersTotal) },
    { icon: Activity, label: "Activos (30 días)", value: formatInt(data.usersActive) },
    { icon: UserPlus, label: "Nuevos este mes", value: formatInt(data.usersNew) },
  ];
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold">Usuarios</h3>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <r.icon className="h-4 w-4" />
            </span>
            <span className="flex-1 text-sm text-muted-foreground">{r.label}</span>
            <span className="font-semibold tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Tasa de actividad</span>
          <span>{activePct}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent" style={{ width: `${activePct}%` }} />
        </div>
      </div>
    </div>
  );
}

function CompaniesTable({ data }: { data: AdminDashboard }) {
  const STATUS = {
    active: { label: "Activa", tone: "success" as const },
    pending: { label: "Pendiente", tone: "warning" as const },
    suspended: { label: "Suspendida", tone: "neutral" as const },
  };
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="font-semibold">Empresas afiliadas</h3>
        <span className="text-xs text-muted-foreground">{data.companies.length} operadores</span>
      </div>
      <div className="hidden grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 border-y border-border px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
        <span>Empresa</span>
        <span className="text-right">Reservas</span>
        <span className="text-right">Ingresos</span>
        <span className="text-right">Rating</span>
        <span className="text-right">Estado</span>
      </div>
      <ul className="divide-y divide-border">
        {data.companies.map((c) => {
          const status = STATUS[c.status];
          return (
            <li
              key={c.id}
              className="flex flex-col gap-2 px-5 py-3.5 sm:grid sm:grid-cols-[2fr_1fr_1fr_auto_auto] sm:items-center sm:gap-4"
            >
              <span className="flex items-center gap-3">
                <LogoBadge mark={c.mark} color={c.color} size={36} />
                <span>
                  <span className="block font-medium">{c.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {c.modes.map((m) => TRANSPORT_MODE_META[m].label).join(", ")}
                  </span>
                </span>
              </span>
              <span className="text-sm tabular-nums sm:text-right">
                <span className="text-muted-foreground sm:hidden">Reservas: </span>
                {formatInt(c.bookings)}
              </span>
              <span className="text-sm font-medium tabular-nums sm:text-right">
                {formatMoneyCompact(c.revenue, data.currency)}
              </span>
              <span className="inline-flex items-center gap-1 text-sm sm:justify-end">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {c.rating.toFixed(1)}
              </span>
              <span className="sm:text-right">
                <Badge tone={status.tone}>{status.label}</Badge>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
