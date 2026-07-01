"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Users2, TrendingUp, Wallet, Target, Star } from "lucide-react";
import type { CrmAgent } from "@vialta/types";
import { CRM_ROLE_LABEL } from "@vialta/types";
import { Avatar, Badge, DataTable, type Column, cn, formatMoney, formatInt } from "@vialta/ui";

export function AgentsView({ agents }: { agents: CrmAgent[] }) {
  const sorted = useMemo(() => [...agents].sort((a, b) => b.revenue.amount - a.revenue.amount), [agents]);
  const sellers = sorted.filter((a) => a.sales > 0);

  const stats = useMemo(() => {
    const active = agents.filter((a) => a.status === "active").length;
    const sales = agents.reduce((a, x) => a + x.sales, 0);
    const revenue = agents.reduce((a, x) => a + x.revenue.amount, 0);
    const commission = agents.reduce((a, x) => a + x.commissionEarned.amount, 0);
    return { active, sales, revenue, commission };
  }, [agents]);

  const statCards = [
    { label: "Agentes activos", value: formatInt(stats.active), icon: Users2, tone: "bg-primary/12 text-primary", href: "/reportes?report=agent" },
    { label: "Ventas totales", value: formatInt(stats.sales), icon: TrendingUp, tone: "bg-success/14 text-success", href: "/reportes?report=monthly" },
    { label: "Ingresos", value: formatMoney(stats.revenue, "BOB"), icon: Wallet, tone: "bg-accent/14 text-accent-strong dark:text-accent", href: "/reportes?report=monthly" },
    { label: "Comisiones", value: formatMoney(stats.commission, "BOB"), icon: Target, tone: "bg-warning/16 text-warning", href: "/reportes?report=agent" },
  ];

  const columns: Column<CrmAgent>[] = [
    {
      key: "name",
      header: "Agente",
      width: "2fr",
      cell: (a) => (
        <span className="flex items-center gap-3">
          <Avatar initials={a.initials} size={36} />
          <span className="min-w-0">
            <span className="block truncate font-medium">{a.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{CRM_ROLE_LABEL[a.role]}</span>
          </span>
        </span>
      ),
    },
    { key: "sales", header: "Ventas", width: "auto", align: "right", hideOnMobile: true, cell: (a) => <span className="tabular-nums">{a.sales}</span> },
    { key: "revenue", header: "Ingresos", width: "1fr", align: "right", cell: (a) => <span className="font-medium tabular-nums">{formatMoney(a.revenue.amount, a.revenue.currency)}</span> },
    { key: "commission", header: "Comisión", width: "1fr", align: "right", hideOnMobile: true, cell: (a) => <span className="tabular-nums text-success">{formatMoney(a.commissionEarned.amount, a.commissionEarned.currency)} <span className="text-muted-foreground">({a.commissionPct}%)</span></span> },
    {
      key: "goal",
      header: "Objetivo",
      width: "1.2fr",
      hideOnMobile: true,
      cell: (a) => (
        <span className="flex w-full items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <span className={cn("block h-full rounded-full", a.goalPct >= 100 ? "bg-success" : "bg-accent")} style={{ width: `${Math.min(a.goalPct, 100)}%` }} />
          </span>
          <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{a.goalPct}%</span>
        </span>
      ),
    },
    { key: "rating", header: "Rating", width: "auto", align: "right", cell: (a) => <span className="inline-flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{a.rating.toFixed(1)}</span> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Agentes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Personal, ventas, comisiones, objetivos y ranking</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            title={`Ver ${s.label}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.tone)}>
              <s.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold tabular-nums leading-none">{s.value}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{s.label}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Podio top 3 */}
      {sellers.length >= 3 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {sellers.slice(0, 3).map((a, i) => (
            <div key={a.id} className={cn("rounded-3xl border bg-surface p-5 shadow-[var(--shadow-sm)]", i === 0 ? "border-primary/40" : "border-border")}>
              <div className="flex items-center gap-3">
                <Avatar initials={a.initials} size={44} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">#{i + 1} · {a.sales} ventas</p>
                </div>
                {i === 0 && <Badge tone="primary" className="ml-auto">Top</Badge>}
              </div>
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold tabular-nums">{formatMoney(a.revenue.amount, a.revenue.currency)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <span className={cn("block h-full rounded-full", a.goalPct >= 100 ? "bg-success" : "bg-accent")} style={{ width: `${Math.min(a.goalPct, 100)}%` }} />
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">{a.goalPct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <DataTable columns={columns} rows={sorted} keyOf={(a) => a.id} empty="Sin agentes." />
      </div>
    </div>
  );
}
