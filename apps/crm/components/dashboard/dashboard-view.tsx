"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, CheckCircle2, Clock, XCircle, Ticket, UserPlus, Star } from "lucide-react";
import type { CrmDashboard, CrmPeriod } from "@vialta/types";
import { CRM_PERIOD_LABEL } from "@vialta/types";
import {
  AreaChart,
  DonutChart,
  Tabs,
  Avatar,
  cn,
  formatInt,
  formatMoney,
  formatMoneyCompact,
} from "@vialta/ui";
import { KpiCard } from "./kpi-card";
import { RecentActivity } from "./recent-activity";
import { MiniAgenda } from "./mini-agenda";
import { TasksWidget } from "./tasks-widget";

const PERIODS: CrmPeriod[] = ["now", "yesterday", "today", "month", "year"];

/** Afford­ance de tarjeta clickeable (lift + foco accesible). */
const CARD_LINK = "block rounded-3xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function DashboardView({ data }: { data: CrmDashboard }) {
  const [period, setPeriod] = useState<CrmPeriod>("month");
  const pd = data.periods[period];

  const stats = [
    { label: "Reservas pendientes", value: data.bookingsPending, icon: Clock, tone: "bg-warning/16 text-warning", href: "/pasajes?filter=in_process" },
    { label: "Reservas confirmadas", value: data.bookingsConfirmed, icon: CheckCircle2, tone: "bg-success/14 text-success", href: "/pasajes?filter=confirmed" },
    { label: "Reservas canceladas", value: data.bookingsCancelled, icon: XCircle, tone: "bg-danger/14 text-danger", href: "/pasajes?filter=cancelled" },
    { label: "Boletos emitidos", value: data.ticketsIssued, icon: Ticket, tone: "bg-primary/12 text-primary", href: "/pasajes?filter=issued" },
    { label: "Clientes nuevos", value: data.newCustomers, icon: UserPlus, tone: "bg-primary/12 text-primary", href: "/clientes?filter=prospect" },
    { label: "Clientes frecuentes", value: data.frequentCustomers, icon: Star, tone: "bg-accent/14 text-accent-strong dark:text-accent", href: "/clientes?filter=vip" },
  ];

  // Cada KPI abre la vista que le corresponde (según su id).
  const kpiHref = (id: string): string => {
    if (id.startsWith("tickets")) return "/pasajes?filter=issued";
    if (id.startsWith("new-clients")) return "/clientes?filter=prospect";
    if (id.startsWith("pending")) return "/pasajes?filter=in_process";
    if (id.startsWith("confirmed")) return "/pasajes?filter=confirmed";
    if (id.startsWith("margin")) return "/reportes?report=agent";
    if (id.startsWith("sales")) return "/reportes?report=monthly";
    return "/reportes";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visión global de FlyAlways · {CRM_PERIOD_LABEL[period]}
          </p>
        </div>
        <Tabs
          items={PERIODS.map((p) => ({ key: p, label: CRM_PERIOD_LABEL[p] }))}
          value={period}
          onChange={(k) => setPeriod(k as CrmPeriod)}
          layoutId="crm-dashboard-period"
        />
      </div>

      {/* KPIs */}
      <motion.div
        key={`kpi-${period}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {pd.kpis.map((k) => (
          <Link key={k.id} href={kpiHref(k.id)} className={CARD_LINK} title={`Ver ${k.label}`}>
            <KpiCard kpi={k} currency={data.currency} />
          </Link>
        ))}
      </motion.div>

      {/* Conteos de cabecera */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            title={`Ir a ${s.label}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-bold tabular-nums leading-none">{formatInt(s.value)}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{s.label}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link href="/reportes?report=monthly" title="Ver ventas mensuales" className={cn(CARD_LINK, "border border-border bg-surface p-5 shadow-[var(--shadow-sm)] lg:col-span-2")}>
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
        </Link>

        <Link href="/reportes?report=agent" title="Ver ventas por agente" className={cn(CARD_LINK, "border border-border bg-surface p-5 shadow-[var(--shadow-sm)]")}>
          <h3 className="font-semibold">Ventas por canal</h3>
          <div className="mt-4 flex items-center gap-5">
            <DonutChart
              segments={data.salesByChannel}
              size={132}
              centerValue={formatMoneyCompact(pd.revenue.reduce((a, r) => a + r.revenue, 0), data.currency)}
              centerLabel="total"
            />
            <ul className="flex-1 space-y-2">
              {data.salesByChannel.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="flex-1">{s.label}</span>
                  <span className="font-semibold tabular-nums">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </div>

      {/* Rankings + tareas */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link href="/reportes?report=destination" title="Ver reporte por destino" className={CARD_LINK}>
          <TopDestinations data={data} />
        </Link>
        <Link href="/agentes" title="Ver agentes" className={CARD_LINK}>
          <TopAgents data={data} />
        </Link>
        <Link href="/tareas" title="Ver tareas" className={CARD_LINK}>
          <TasksWidget tasks={data.pendingTasks} />
        </Link>
      </div>

      {/* Actividad + agenda */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link href="/clientes" title="Ver clientes" className={cn(CARD_LINK, "lg:col-span-2")}>
          <RecentActivity items={data.recentActivity} />
        </Link>
        <Link href="/calendario" title="Ver calendario" className={CARD_LINK}>
          <MiniAgenda events={data.upcomingEvents} />
        </Link>
      </div>
    </div>
  );
}

function TopDestinations({ data }: { data: CrmDashboard }) {
  const max = Math.max(...data.topDestinations.map((d) => d.bookings));
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold">Destinos top</h3>
      <ul className="mt-4 space-y-3">
        {data.topDestinations.map((r, i) => (
          <li key={r.id}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                <span className="truncate font-medium">{r.label}</span>
              </span>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-0.5 text-xs",
                  r.trendPct >= 0 ? "text-success" : "text-danger"
                )}
              >
                {r.trendPct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(r.trendPct)}%
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(r.bookings / max) * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{r.bookings}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopAgents({ data }: { data: CrmDashboard }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold">Agentes top</h3>
      <ul className="mt-4 space-y-3.5">
        {data.topAgents.map((a) => (
          <li key={a.id} className="flex items-center gap-3">
            <Avatar initials={a.initials} size={36} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{a.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{a.sales} ventas</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn("h-full rounded-full", a.goalPct >= 100 ? "bg-success" : "bg-accent")}
                    style={{ width: `${Math.min(a.goalPct, 100)}%` }}
                  />
                </div>
                <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">{a.goalPct}%</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
