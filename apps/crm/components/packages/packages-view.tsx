"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Package as PackageIcon, CheckCircle2, TrendingUp } from "lucide-react";
import type { TravelPackage, PackageType } from "@vialta/types";
import { PACKAGE_TYPE_LABEL, PACKAGE_STATUS_LABEL } from "@vialta/types";
import { Badge, type BadgeTone, Button, Tabs, Input, cn, formatMoney, formatInt } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { PackageForm } from "./package-form";

const STATUS_TONE: Record<string, BadgeTone> = { active: "success", draft: "warning", inactive: "neutral" };

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "tour", label: "Tours" },
  { key: "hotel", label: "Hoteles" },
  { key: "cruise", label: "Cruceros" },
  { key: "excursion", label: "Excursiones" },
  { key: "transfer", label: "Traslados" },
  { key: "insurance", label: "Seguros" },
  { key: "vehicle", label: "Vehículos" },
];

export function PackagesView({ initialPackages }: { initialPackages: TravelPackage[] }) {
  const { can } = useAuth();
  const canManage = can("packages.manage");
  const [packages, setPackages] = useState<TravelPackage[]>(initialPackages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const stats = useMemo(() => {
    const active = packages.filter((p) => p.status === "active").length;
    const sold = packages.reduce((a, p) => a + p.soldCount, 0);
    return { total: packages.length, active, sold };
  }, [packages]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return packages.filter((p) => {
      // Pseudo-filtros de las tarjetas: "st_active" (activos) y "sold" (con ventas).
      if (filter === "st_active") {
        if (p.status !== "active") return false;
      } else if (filter === "sold") {
        if (!(p.soldCount > 0)) return false;
      } else if (filter !== "all" && p.type !== (filter as PackageType)) {
        return false;
      }
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
    });
  }, [packages, search, filter]);

  const statCards = [
    { label: "Paquetes", value: stats.total, icon: PackageIcon, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Activos", value: stats.active, icon: CheckCircle2, tone: "bg-success/14 text-success", filter: "st_active" },
    { label: "Vendidos", value: stats.sold, icon: TrendingUp, tone: "bg-accent/14 text-accent-strong dark:text-accent", filter: "sold" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Paquetes turísticos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tours, hoteles, cruceros, traslados, seguros y más</p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo paquete
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
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
              <span className="block text-lg font-bold tabular-nums leading-none">{formatInt(s.value)}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <Input icon={Search} placeholder="Buscar por nombre, destino o código…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto pb-1">
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="packages-filter" />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No se encontraron paquetes.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <article key={p.id} className="flex flex-col rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between">
                <Badge tone="primary">{PACKAGE_TYPE_LABEL[p.type]}</Badge>
                <Badge tone={STATUS_TONE[p.status]}>{PACKAGE_STATUS_LABEL[p.status]}</Badge>
              </div>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold leading-tight">{p.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {p.destination} · {p.durationDays} {p.durationDays === 1 ? "día" : "días"} · {p.providerName}
              </p>
              {p.includes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.includes.slice(0, 3).map((i) => (
                    <span key={i} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted-foreground">{i}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                <div>
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums">{formatMoney(p.price.amount, p.price.currency)}</span>
                  <span className="block text-[11px] text-muted-foreground">desde / por persona</span>
                </div>
                <span className="text-xs text-muted-foreground">{p.soldCount} vendidos</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {canManage && (
        <PackageForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(p) => setPackages((prev) => [p, ...prev])} seq={packages.length + 1} />
      )}
    </div>
  );
}
