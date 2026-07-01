"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Zap,
  Activity,
  CreditCard,
  PlaneTakeoff,
  Gift,
  UserMinus,
  MessageSquare,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import type { Automation, AutomationTrigger } from "@vialta/types";
import { AUTOMATION_TRIGGER_LABEL, AUTOMATION_STATUS_LABEL, MARKETING_CHANNEL_LABEL } from "@vialta/types";
import { Badge, Button, Switch, cn, formatInt, formatDate } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { AutomationForm } from "./automation-form";

const TRIGGER_ICON: Record<AutomationTrigger, LucideIcon> = {
  payment_due: CreditCard,
  trip_upcoming: PlaneTakeoff,
  birthday: Gift,
  inactive_client: UserMinus,
  quote_followup: MessageSquare,
  passport_expiry: ShieldAlert,
};

export function AutomationsView({ initial }: { initial: Automation[] }) {
  const { can } = useAuth();
  const canManage = can("automations.manage");
  const [automations, setAutomations] = useState<Automation[]>(initial);
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const active = automations.filter((a) => a.status === "active").length;
    const runs = automations.reduce((a, x) => a + x.runs, 0);
    return { total: automations.length, active, runs };
  }, [automations]);

  const visible = useMemo(
    () => automations.filter((a) => filter === "all" || a.status === filter),
    [automations, filter],
  );

  function toggle(id: string) {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a)),
    );
  }

  const statCards = [
    { label: "Automatizaciones", value: formatInt(stats.total), icon: Zap, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Activas", value: formatInt(stats.active), icon: Activity, tone: "bg-success/14 text-success", filter: "active" },
    { label: "Ejecuciones totales", value: formatInt(stats.runs), icon: Activity, tone: "bg-accent/12 text-accent", filter: "all" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Automatizaciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">Flujos disparados por eventos: pagos, viajes, cumpleaños y seguimiento</p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nueva automatización
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

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {visible.map((a) => {
          const Icon = TRIGGER_ICON[a.trigger];
          const on = a.status === "active";
          return (
            <div
              key={a.id}
              className={cn(
                "flex items-start gap-4 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-opacity",
                !on && "opacity-70",
              )}
            >
              <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", on ? "bg-primary/12 text-primary" : "bg-surface-2 text-muted-foreground")}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{AUTOMATION_TRIGGER_LABEL[a.trigger]} · {MARKETING_CHANNEL_LABEL[a.channel]}</p>
                  </div>
                  {canManage ? (
                    <Switch checked={on} onChange={() => toggle(a.id)} aria-label={`Activar automatización ${a.name}`} />
                  ) : (
                    <Badge tone={on ? "success" : "neutral"}>{AUTOMATION_STATUS_LABEL[a.status]}</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{a.timing}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span><span className="font-semibold tabular-nums text-foreground">{formatInt(a.runs)}</span> ejecuciones</span>
                  {a.lastRunAt && <span>Última: {formatDate(a.lastRunAt)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {canManage && (
        <AutomationForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(a) => setAutomations((prev) => [a, ...prev])} />
      )}
    </div>
  );
}
