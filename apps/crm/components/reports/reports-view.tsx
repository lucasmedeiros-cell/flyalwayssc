"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { FileSpreadsheet, FileText, FileDown } from "lucide-react";
import type { CrmReports } from "@vialta/types";
import { AreaChart, DonutChart, Button, cn, formatMoney, formatInt, formatMoneyCompact } from "@vialta/ui";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { exportCSV, exportExcel, exportPDF, type Cell } from "@/lib/export";

interface RColumn {
  header: string;
  align?: "right";
  cell: (r: Record<string, unknown>) => ReactNode;
  raw: (r: Record<string, unknown>) => Cell;
}
interface RTab {
  key: string;
  label: string;
  file: string;
  columns: RColumn[];
  data: Record<string, unknown>[];
}

const DONUT_COLORS = ["#3a23a8", "#1ca71c", "#8b7bf5", "#e0a106", "#e62020", "#12b3a3"];

export function ReportsView({ reports }: { reports: CrmReports }) {
  const cur = reports.currency;
  const money = (n: unknown) => formatMoney(Number(n), cur);

  const tabs: RTab[] = useMemo(() => [
    {
      key: "monthly", label: "Ventas mensuales", file: "reporte-ventas-mensuales",
      data: reports.monthly as unknown as Record<string, unknown>[],
      columns: [
        { header: "Mes", cell: (r) => String(r.label), raw: (r) => String(r.label) },
        { header: "Ingresos", align: "right", cell: (r) => money(r.income), raw: (r) => Number(r.income) },
        { header: "Egresos", align: "right", cell: (r) => money(r.expense), raw: (r) => Number(r.expense) },
        { header: "Utilidad", align: "right", cell: (r) => <span className="text-success">{money(r.profit)}</span>, raw: (r) => Number(r.profit) },
        { header: "Ventas", align: "right", cell: (r) => formatInt(Number(r.sales)), raw: (r) => Number(r.sales) },
      ],
    },
    {
      key: "agent", label: "Por agente", file: "reporte-por-agente",
      data: reports.byAgent as unknown as Record<string, unknown>[],
      columns: [
        { header: "Agente", cell: (r) => String(r.name), raw: (r) => String(r.name) },
        { header: "Ventas", align: "right", cell: (r) => formatInt(Number(r.sales)), raw: (r) => Number(r.sales) },
        { header: "Ingresos", align: "right", cell: (r) => money(r.revenue), raw: (r) => Number(r.revenue) },
        { header: "Comisión", align: "right", cell: (r) => <span className="text-success">{money(r.commission)}</span>, raw: (r) => Number(r.commission) },
      ],
    },
    {
      key: "destination", label: "Por destino", file: "reporte-por-destino",
      data: reports.byDestination as unknown as Record<string, unknown>[],
      columns: [
        { header: "Destino", cell: (r) => String(r.destination), raw: (r) => String(r.destination) },
        { header: "Reservas", align: "right", cell: (r) => formatInt(Number(r.bookings)), raw: (r) => Number(r.bookings) },
        { header: "Ingresos", align: "right", cell: (r) => money(r.revenue), raw: (r) => Number(r.revenue) },
      ],
    },
    {
      key: "airline", label: "Por aerolínea", file: "reporte-por-aerolinea",
      data: reports.byAirline as unknown as Record<string, unknown>[],
      columns: [
        { header: "Aerolínea", cell: (r) => String(r.airline), raw: (r) => String(r.airline) },
        { header: "Boletos", align: "right", cell: (r) => formatInt(Number(r.tickets)), raw: (r) => Number(r.tickets) },
        { header: "Ingresos", align: "right", cell: (r) => money(r.revenue), raw: (r) => Number(r.revenue) },
      ],
    },
    {
      key: "provider", label: "Por proveedor", file: "reporte-por-proveedor",
      data: reports.byProvider as unknown as Record<string, unknown>[],
      columns: [
        { header: "Proveedor", cell: (r) => String(r.provider), raw: (r) => String(r.provider) },
        { header: "Reservas", align: "right", cell: (r) => formatInt(Number(r.bookings)), raw: (r) => Number(r.bookings) },
        { header: "Por pagar", align: "right", cell: (r) => money(r.payable), raw: (r) => Number(r.payable) },
      ],
    },
    {
      key: "customers", label: "Top clientes", file: "reporte-top-clientes",
      data: reports.topCustomers as unknown as Record<string, unknown>[],
      columns: [
        { header: "Cliente", cell: (r) => String(r.name), raw: (r) => String(r.name) },
        { header: "Viajes", align: "right", cell: (r) => formatInt(Number(r.trips)), raw: (r) => Number(r.trips) },
        { header: "Gasto total", align: "right", cell: (r) => money(r.spent), raw: (r) => Number(r.spent) },
      ],
    },
  ], [reports]); // eslint-disable-line react-hooks/exhaustive-deps

  // Permite abrir un reporte concreto por URL (?report=agent), p. ej. desde el dashboard.
  const requested = useSearchParams().get("report");
  const initialTab = tabs.some((t) => t.key === requested) ? (requested as string) : "monthly";
  const [tabKey, setTabKey] = useState(initialTab);
  const tab = tabs.find((t) => t.key === tabKey) ?? tabs[0];

  function doExport(kind: "csv" | "xls" | "pdf") {
    const headers = tab.columns.map((c) => c.header);
    const rows = tab.data.map((r) => tab.columns.map((c) => c.raw(r)));
    if (kind === "csv") exportCSV(tab.file, headers, rows);
    else if (kind === "xls") exportExcel(tab.file, headers, rows);
    else exportPDF();
  }

  const destTop = reports.byDestination.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Reportes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ventas, utilidades, comisiones, destinos y más · últimos meses</p>
        </div>
        <div className="no-print flex gap-2">
          <Button variant="outline" size="sm" onClick={() => doExport("csv")}><FileDown className="h-4 w-4" /> CSV</Button>
          <Button variant="outline" size="sm" onClick={() => doExport("xls")}><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => doExport("pdf")}><FileText className="h-4 w-4" /> PDF</Button>
        </div>
      </div>

      <div className="print-area">
        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {reports.kpis.map((k) => (
            <KpiCard key={k.id} kpi={k} currency={cur} />
          ))}
        </div>

        {/* Gráficos */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Ingresos vs egresos</h3>
              <span className="text-sm font-semibold tabular-nums">{formatMoney(reports.monthly.reduce((a, m) => a + m.income, 0), cur)}</span>
            </div>
            <div className="mt-6 pb-6">
              <AreaChart data={reports.monthly.map((m) => ({ label: m.label, value: m.profit }))} formatValue={(n) => formatMoney(n, cur)} />
            </div>
            <p className="text-center text-xs text-muted-foreground">Utilidad mensual</p>
          </div>
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <h3 className="font-semibold">Ingresos por destino</h3>
            <div className="mt-4 flex items-center gap-5">
              <DonutChart
                segments={destTop.map((d, i) => ({ label: d.destination, value: d.revenue, color: DONUT_COLORS[i % DONUT_COLORS.length] }))}
                size={132}
                centerValue={formatMoneyCompact(destTop.reduce((a, d) => a + d.revenue, 0), cur)}
                centerLabel="top destinos"
              />
              <ul className="flex-1 space-y-1.5 text-sm">
                {destTop.map((d, i) => (
                  <li key={d.destination} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    <span className="flex-1 truncate">{d.destination}</span>
                    <span className="tabular-nums text-muted-foreground">{formatMoneyCompact(d.revenue, cur)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Selector de reporte + tabla */}
        <div className="mt-6 overflow-x-auto pb-1">
          <div className="no-print inline-flex gap-1 rounded-full border border-border bg-surface-2/70 p-1 text-sm">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTabKey(t.key)}
                className={cn("rounded-full px-4 py-1.5 font-medium transition-colors", t.key === tabKey ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
          <div className="px-5 py-4">
            <h3 className="font-semibold">{tab.label}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-y border-border text-xs uppercase tracking-wide text-muted-foreground">
                  {tab.columns.map((c) => (
                    <th key={c.header} className={cn("px-5 py-2.5 font-medium", c.align === "right" ? "text-right" : "text-left")}>{c.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tab.data.map((r, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                    {tab.columns.map((c) => (
                      <td key={c.header} className={cn("px-5 py-3 tabular-nums", c.align === "right" ? "text-right" : "text-left")}>{c.cell(r)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
