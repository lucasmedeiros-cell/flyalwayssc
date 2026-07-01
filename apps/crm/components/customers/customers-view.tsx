"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Search, Phone, MessageCircle, Plus, Users, Star, UserCheck, Sparkles } from "lucide-react";
import type { Customer, CustomerStatus } from "@vialta/types";
import { CUSTOMER_STATUS_LABEL, customerInitials } from "@vialta/types";
import { Avatar, Badge, Button, DataTable, type Column, Tabs, Input, cn, formatMoney, formatInt } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { STATUS_TONE } from "./customer-utils";
import { CustomerForm } from "./customer-form";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "active", label: "Activos" },
  { key: "vip", label: "VIP" },
  { key: "prospect", label: "Prospectos" },
  { key: "inactive", label: "Inactivos" },
];

export function CustomersView({ initialCustomers }: { initialCustomers: Customer[] }) {
  const router = useRouter();
  const { can } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const requestedFilter = useSearchParams().get("filter");
  const [filter, setFilter] = useState(
    requestedFilter && FILTERS.some((f) => f.key === requestedFilter) ? requestedFilter : "all",
  );
  const [formOpen, setFormOpen] = useState(false);

  const canEdit = can("clients.edit");

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "active").length;
    const vip = customers.filter((c) => c.status === "vip").length;
    const prospect = customers.filter((c) => c.status === "prospect").length;
    const spent = customers.reduce((a, c) => a + c.totalSpent.amount, 0);
    return { total, active, vip, prospect, spent };
  }, [customers]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (filter !== "all" && c.status !== (filter as CustomerStatus)) return false;
      if (!q) return true;
      return (
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.documentNumber.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [customers, search, filter]);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Cliente",
      width: "2.2fr",
      cell: (c) => (
        <span className="flex items-center gap-3">
          <Avatar initials={customerInitials(c)} size={38} />
          <span className="min-w-0">
            <span className="block truncate font-medium">
              {c.firstName} {c.lastName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">{c.email}</span>
          </span>
        </span>
      ),
    },
    {
      key: "contact",
      header: "Contacto",
      width: "1.2fr",
      hideOnMobile: true,
      cell: (c) => (
        <span className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {c.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> {c.phone}
            </span>
          )}
          {c.whatsapp && (
            <span className="flex items-center gap-1.5">
              <MessageCircle className="h-3 w-3" /> {c.whatsapp}
            </span>
          )}
        </span>
      ),
    },
    {
      key: "agent",
      header: "Agente",
      width: "1fr",
      hideOnMobile: true,
      cell: (c) => <span className="truncate text-sm">{c.assignedAgentName}</span>,
    },
    {
      key: "spent",
      header: "Gasto total",
      width: "1fr",
      align: "right",
      cell: (c) => <span className="font-medium tabular-nums">{formatMoney(c.totalSpent.amount, c.totalSpent.currency)}</span>,
    },
    {
      key: "trips",
      header: "Viajes",
      width: "auto",
      align: "right",
      hideOnMobile: true,
      cell: (c) => <span className="tabular-nums text-muted-foreground">{c.tripsCount}</span>,
    },
    {
      key: "status",
      header: "Estado",
      width: "auto",
      align: "right",
      cell: (c) => <Badge tone={STATUS_TONE[c.status]}>{CUSTOMER_STATUS_LABEL[c.status]}</Badge>,
    },
  ];

  const statCards = [
    { label: "Total clientes", value: stats.total, icon: Users, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Activos", value: stats.active, icon: UserCheck, tone: "bg-success/14 text-success", filter: "active" },
    { label: "VIP", value: stats.vip, icon: Star, tone: "bg-accent/14 text-accent-strong dark:text-accent", filter: "vip" },
    { label: "Prospectos", value: stats.prospect, icon: Sparkles, tone: "bg-warning/16 text-warning", filter: "prospect" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatInt(stats.total)} clientes · {formatMoney(stats.spent, "BOB")} en ventas acumuladas
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo cliente
          </Button>
        )}
      </div>

      {/* Stats */}
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
              <span className="block text-xl font-bold tabular-nums leading-none">{formatInt(s.value)}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <Input
            icon={Search}
            placeholder="Buscar por nombre, email, documento o etiqueta…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto pb-1">
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="customers-filter" />
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={rows}
          keyOf={(c) => c.id}
          onRowClick={(c) => router.push(`/clientes/${c.id}`)}
          empty="No se encontraron clientes con esos criterios."
        />
      </div>

      {canEdit && (
        <CustomerForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(c) => setCustomers((prev) => [c, ...prev])} />
      )}
    </div>
  );
}
