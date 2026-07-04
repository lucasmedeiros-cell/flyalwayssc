"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Search, Plus, Plane, TrendingUp, Ticket as TicketIcon, Clock } from "lucide-react";
import type { Ticket, TicketStatus } from "@vialta/types";
import { TICKET_STATUS_LABEL, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { Avatar, Badge, Button, DataTable, type Column, Tabs, Input, cn, formatMoney, formatInt } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { useMoneyMask } from "@/components/privacy/privacy-provider";
import { TICKET_STATUS_TONE } from "./ticket-utils";
import { TicketForm } from "./ticket-form";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "quote", label: "Cotización" },
  { key: "reserved", label: "Reservados" },
  { key: "confirmed", label: "Confirmados" },
  { key: "issued", label: "Emitidos" },
  { key: "reissued", label: "Reemitidos" },
  { key: "cancelled", label: "Cancelados" },
  { key: "refunded", label: "Reembolsados" },
];

export function TicketsView({ initialTickets }: { initialTickets: Ticket[] }) {
  const router = useRouter();
  const { can } = useAuth();
  const { mask } = useMoneyMask();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const requestedFilter = useSearchParams().get("filter");
  const validFilters = [...FILTERS.map((f) => f.key), "in_process"];
  const [filter, setFilter] = useState(requestedFilter && validFilters.includes(requestedFilter) ? requestedFilter : "all");
  const [formOpen, setFormOpen] = useState(false);

  const canSell = can("tickets.sell");

  const stats = useMemo(() => {
    const sales = tickets.filter((t) => ["confirmed", "issued", "reissued"].includes(t.status));
    const revenue = sales.reduce((a, t) => a + t.total.amount, 0);
    const profit = sales.reduce((a, t) => a + t.profit.amount, 0);
    const issued = tickets.filter((t) => t.status === "issued").length;
    const pending = tickets.filter((t) => ["quote", "reserved", "confirmed"].includes(t.status)).length;
    return { revenue, profit, issued, pending };
  }, [tickets]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets.filter((t) => {
      // "in_process" es un pseudo-filtro (varios estados) usado por la tarjeta "En proceso".
      if (filter === "in_process") {
        if (!["quote", "reserved", "confirmed"].includes(t.status)) return false;
      } else if (filter !== "all" && t.status !== (filter as TicketStatus)) {
        return false;
      }
      if (!q) return true;
      return (
        t.code.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.airline.toLowerCase().includes(q) ||
        (t.pnr ?? "").toLowerCase().includes(q) ||
        `${t.originCode} ${t.destinationCode}`.toLowerCase().includes(q)
      );
    });
  }, [tickets, search, filter]);

  const nextCode = useMemo(() => {
    const max = tickets.reduce((m, t) => {
      const n = Number(t.code.replace(/\D/g, ""));
      return Number.isFinite(n) && n > m ? n : m;
    }, 20425);
    return `FA-${max + 1}`;
  }, [tickets]);

  const columns: Column<Ticket>[] = [
    {
      key: "code",
      header: "Pasaje",
      width: "1.3fr",
      cell: (t) => (
        <span className="min-w-0">
          <span className="block font-medium tabular-nums">{t.code}</span>
          <span className="block truncate text-xs text-muted-foreground">{t.customerName}</span>
        </span>
      ),
    },
    {
      key: "route",
      header: "Ruta",
      width: "1.4fr",
      cell: (t) => (
        <span className="flex items-center gap-2">
          <Avatar initials={t.airlineCode} size={30} color="#3a23a8" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {t.originCode} → {t.destinationCode}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{t.airline} · {TRAVEL_CLASS_LABEL[t.travelClass]}</span>
          </span>
        </span>
      ),
    },
    { key: "pnr", header: "PNR", width: "auto", hideOnMobile: true, cell: (t) => <span className="text-sm tabular-nums text-muted-foreground">{t.pnr ?? "—"}</span> },
    { key: "total", header: "Total", width: "1fr", align: "right", cell: (t) => <span className="font-medium tabular-nums">{formatMoney(t.total.amount, t.total.currency)}</span> },
    {
      key: "profit",
      header: "Utilidad",
      width: "auto",
      align: "right",
      hideOnMobile: true,
      cell: (t) => {
        const dead = t.status === "cancelled" || t.status === "refunded";
        return (
          <span className={cn("tabular-nums", dead ? "text-muted-foreground/60 line-through" : "text-success")}>
            {formatMoney(t.profit.amount, t.profit.currency)}
          </span>
        );
      },
    },
    { key: "status", header: "Estado", width: "auto", align: "right", cell: (t) => <Badge tone={TICKET_STATUS_TONE[t.status]}>{TICKET_STATUS_LABEL[t.status]}</Badge> },
  ];

  const statCards = [
    { label: "Ingresos (ventas)", value: mask(formatMoney(stats.revenue, "BOB")), icon: TrendingUp, tone: "bg-success/14 text-success", filter: "all" },
    { label: "Utilidad", value: mask(formatMoney(stats.profit, "BOB")), icon: Plane, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Boletos emitidos", value: formatInt(stats.issued), icon: TicketIcon, tone: "bg-accent/14 text-accent-strong dark:text-accent", filter: "issued" },
    { label: "En proceso", value: formatInt(stats.pending), icon: Clock, tone: "bg-warning/16 text-warning", filter: "in_process" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Pasajes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pipeline de ventas y emisión de boletos</p>
        </div>
        {canSell && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nueva venta
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setFilter(s.filter)}
            aria-pressed={filter === s.filter}
            title={`Filtrar: ${s.label}`}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-surface p-4 text-left shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              filter === s.filter ? "border-primary/60 ring-2 ring-primary/30" : "border-border",
            )}
          >
            <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.tone)}>
              <s.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold tabular-nums leading-none">{s.value}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <Input icon={Search} placeholder="Buscar por código, cliente, aerolínea, PNR o ruta…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto pb-1">
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="tickets-filter" />
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={rows}
          keyOf={(t) => t.id}
          onRowClick={(t) => router.push(`/pasajes/${t.id}`)}
          empty="No se encontraron pasajes con esos criterios."
        />
      </div>

      {canSell && (
        <TicketForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(t) => setTickets((prev) => [t, ...prev])} nextCode={nextCode} />
      )}
    </div>
  );
}
