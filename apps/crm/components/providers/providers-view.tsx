"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Building2, Star, Wallet } from "lucide-react";
import type { Provider, ProviderType } from "@vialta/types";
import { PROVIDER_TYPE_LABEL, PROVIDER_STATUS_LABEL } from "@vialta/types";
import { Avatar, Badge, Button, DataTable, type Column, Tabs, Input, cn, formatMoney, formatInt, initials } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { ProviderForm } from "./provider-form";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "airline", label: "Aerolíneas" },
  { key: "hotel", label: "Hoteles" },
  { key: "operator", label: "Operadores" },
  { key: "wholesaler", label: "Mayoristas" },
  { key: "insurance", label: "Seguros" },
  { key: "transport", label: "Transporte" },
];

export function ProvidersView({ initialProviders }: { initialProviders: Provider[] }) {
  const { can } = useAuth();
  const canManage = can("providers.manage");
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const stats = useMemo(() => {
    const active = providers.filter((p) => p.status === "active").length;
    const payable = providers.reduce((a, p) => a + (p.balance?.amount ?? 0), 0);
    return { total: providers.length, active, payable };
  }, [providers]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return providers.filter((p) => {
      // Pseudo-filtros de las tarjetas: "st_active" (activos) y "st_payable" (con saldo por pagar).
      if (filter === "st_active") {
        if (p.status !== "active") return false;
      } else if (filter === "st_payable") {
        if (!((p.balance?.amount ?? 0) > 0)) return false;
      } else if (filter !== "all" && p.type !== (filter as ProviderType)) {
        return false;
      }
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || (p.contactName ?? "").toLowerCase().includes(q) || p.country.toLowerCase().includes(q);
    });
  }, [providers, search, filter]);

  const columns: Column<Provider>[] = [
    {
      key: "name",
      header: "Proveedor",
      width: "2fr",
      cell: (p) => (
        <span className="flex items-center gap-3">
          <Avatar initials={initials(p.name)} size={36} color="#3a23a8" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{p.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{PROVIDER_TYPE_LABEL[p.type]} · {p.city ? `${p.city}, ` : ""}{p.country}</span>
          </span>
        </span>
      ),
    },
    {
      key: "contact",
      header: "Contacto",
      width: "1.4fr",
      hideOnMobile: true,
      cell: (p) => (
        <span className="min-w-0 text-xs text-muted-foreground">
          {p.contactName && <span className="block truncate">{p.contactName}</span>}
          {p.email && <span className="block truncate">{p.email}</span>}
        </span>
      ),
    },
    { key: "rating", header: "Rating", width: "auto", hideOnMobile: true, cell: (p) => <span className="inline-flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{p.rating.toFixed(1)}</span> },
    { key: "balance", header: "Por pagar", width: "1fr", align: "right", cell: (p) => { const b = p.balance?.amount ?? 0; return <span className={cn("tabular-nums", b > 0 ? "text-warning font-medium" : "text-muted-foreground")}>{formatMoney(b, p.balance?.currency ?? "BOB")}</span>; } },
    { key: "status", header: "Estado", width: "auto", align: "right", cell: (p) => <Badge tone={p.status === "active" ? "success" : "neutral"}>{PROVIDER_STATUS_LABEL[p.status]}</Badge> },
  ];

  const statCards = [
    { label: "Proveedores", value: formatInt(stats.total), icon: Building2, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Activos", value: formatInt(stats.active), icon: Star, tone: "bg-success/14 text-success", filter: "st_active" },
    { label: "Cuentas por pagar", value: formatMoney(stats.payable, "BOB"), icon: Wallet, tone: "bg-warning/16 text-warning", filter: "st_payable" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Proveedores</h1>
          <p className="mt-1 text-sm text-muted-foreground">Operadores, hoteles, aerolíneas, mayoristas, seguros y transporte</p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo proveedor
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
          <Input icon={Search} placeholder="Buscar por nombre, contacto o país…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto pb-1">
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="providers-filter" />
        </div>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} rows={rows} keyOf={(p) => p.id} empty="No se encontraron proveedores." />
      </div>

      {canManage && (
        <ProviderForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(p) => setProviders((prev) => [p, ...prev])} />
      )}
    </div>
  );
}
