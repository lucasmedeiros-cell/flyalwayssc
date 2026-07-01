"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Megaphone, Send, MailOpen, Target, Filter } from "lucide-react";
import type { Campaign, CampaignStatus, MarketingOverview, FunnelStage } from "@vialta/types";
import {
  CAMPAIGN_STATUS_LABEL,
  CAMPAIGN_AUDIENCE_LABEL,
  MARKETING_CHANNEL_LABEL,
  campaignOpenRate,
  campaignConversionRate,
} from "@vialta/types";
import { Badge, Button, DataTable, type Column, type BadgeTone, Tabs, Input, cn, formatInt, formatMoney } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { CampaignForm } from "./campaign-form";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "active", label: "En curso" },
  { key: "scheduled", label: "Programadas" },
  { key: "completed", label: "Finalizadas" },
  { key: "draft", label: "Borradores" },
  { key: "paused", label: "Pausadas" },
];

const STATUS_TONE: Record<CampaignStatus, BadgeTone> = {
  draft: "neutral",
  scheduled: "primary",
  active: "success",
  completed: "neutral",
  paused: "warning",
};

export function MarketingView({ initial }: { initial: MarketingOverview }) {
  const { can } = useAuth();
  const canManage = can("marketing.manage");
  const [campaigns, setCampaigns] = useState<Campaign[]>(initial.campaigns);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const stats = useMemo(() => {
    const active = campaigns.filter((c) => c.status === "active").length;
    const sent = campaigns.reduce((a, c) => a + c.metrics.sent, 0);
    const opened = campaigns.reduce((a, c) => a + c.metrics.opened, 0);
    const converted = campaigns.reduce((a, c) => a + c.metrics.converted, 0);
    const revenue = campaigns.reduce((a, c) => a + (c.metrics.revenue?.amount ?? 0), 0);
    const openRate = sent > 0 ? (opened / sent) * 100 : 0;
    return { active, sent, openRate, converted, revenue };
  }, [campaigns]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (filter !== "all" && c.status !== (filter as CampaignStatus)) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || (c.subject ?? "").toLowerCase().includes(q);
    });
  }, [campaigns, search, filter]);

  const columns: Column<Campaign>[] = [
    {
      key: "name",
      header: "Campaña",
      width: "2.2fr",
      cell: (c) => (
        <span className="min-w-0">
          <span className="block truncate font-medium">{c.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {MARKETING_CHANNEL_LABEL[c.channel]} · {CAMPAIGN_AUDIENCE_LABEL[c.audience]}
          </span>
        </span>
      ),
    },
    {
      key: "sent",
      header: "Enviados",
      width: "auto",
      align: "right",
      hideOnMobile: true,
      cell: (c) => <span className="tabular-nums text-sm">{formatInt(c.metrics.sent)}</span>,
    },
    {
      key: "open",
      header: "Apertura",
      width: "auto",
      align: "right",
      hideOnMobile: true,
      cell: (c) => <span className="tabular-nums text-sm text-muted-foreground">{campaignOpenRate(c.metrics).toFixed(0)}%</span>,
    },
    {
      key: "conv",
      header: "Conversión",
      width: "auto",
      align: "right",
      cell: (c) => (
        <span className="tabular-nums text-sm font-medium text-success">
          {campaignConversionRate(c.metrics).toFixed(1)}%
        </span>
      ),
    },
    {
      key: "revenue",
      header: "Ingresos",
      width: "1fr",
      align: "right",
      hideOnMobile: true,
      cell: (c) =>
        c.metrics.revenue ? (
          <span className="tabular-nums">{formatMoney(c.metrics.revenue.amount, c.metrics.revenue.currency)}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "status",
      header: "Estado",
      width: "auto",
      align: "right",
      cell: (c) => <Badge tone={STATUS_TONE[c.status]}>{CAMPAIGN_STATUS_LABEL[c.status]}</Badge>,
    },
  ];

  const statCards = [
    { label: "Campañas activas", value: formatInt(stats.active), icon: Megaphone, tone: "bg-primary/12 text-primary", filter: "active" },
    { label: "Mensajes enviados", value: formatInt(stats.sent), icon: Send, tone: "bg-accent/12 text-accent", filter: "all" },
    { label: "Tasa de apertura", value: `${stats.openRate.toFixed(0)}%`, icon: MailOpen, tone: "bg-warning/16 text-warning", filter: "all" },
    { label: "Ingresos atribuidos", value: formatMoney(stats.revenue, "BOB"), icon: Target, tone: "bg-success/14 text-success", filter: "completed" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Marketing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Segmentación, campañas multicanal y embudo de conversión</p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nueva campaña
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

      <FunnelCard funnel={initial.funnel} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <Input icon={Search} placeholder="Buscar campaña…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto pb-1">
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="marketing-filter" />
        </div>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} rows={rows} keyOf={(c) => c.id} empty="No se encontraron campañas." />
      </div>

      {canManage && (
        <CampaignForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(c) => setCampaigns((prev) => [c, ...prev])} />
      )}
    </div>
  );
}

function FunnelCard({ funnel }: { funnel: FunnelStage[] }) {
  const top = funnel[0]?.value || 1;
  return (
    <div className="mt-6 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Embudo de conversión</h2>
        <span className="text-xs text-muted-foreground">· últimos 90 días</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {funnel.map((stage, i) => {
          const pct = (stage.value / top) * 100;
          const conv = i === 0 ? 100 : (stage.value / top) * 100;
          return (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{stage.label}</span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-surface-2">
                <div
                  className="flex h-full items-center rounded-lg bg-gradient-to-r from-primary to-primary/70 px-2.5 transition-all"
                  style={{ width: `${Math.max(pct, 6)}%` }}
                >
                  <span className="text-[11px] font-semibold tabular-nums text-white">{formatInt(stage.value)}</span>
                </div>
              </div>
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{conv.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
