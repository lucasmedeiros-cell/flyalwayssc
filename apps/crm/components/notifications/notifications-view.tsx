"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Bell,
  Send,
  Clock,
  AlertTriangle,
  CreditCard,
  Plane,
  CheckSquare,
  Gift,
  Megaphone,
  Settings,
  Mail,
  MessageCircle,
  Smartphone,
  BellRing,
  type LucideIcon,
} from "lucide-react";
import type { CrmNotification, CrmNotificationKind, CrmNotificationChannel, CrmNotificationStatus } from "@vialta/types";
import { CRM_NOTIFICATION_STATUS_LABEL, CRM_NOTIFICATION_CHANNEL_LABEL } from "@vialta/types";
import { Badge, Button, type BadgeTone, Tabs, cn, formatInt, formatDate, formatTime } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { NotificationForm } from "./notification-form";

const KIND_ICON: Record<CrmNotificationKind, LucideIcon> = {
  payment: CreditCard,
  trip: Plane,
  task: CheckSquare,
  birthday: Gift,
  campaign: Megaphone,
  system: Settings,
};

const CHANNEL_ICON: Record<CrmNotificationChannel, LucideIcon> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: Smartphone,
  push: BellRing,
  in_app: Bell,
};

const STATUS_TONE: Record<CrmNotificationStatus, BadgeTone> = {
  sent: "success",
  scheduled: "primary",
  failed: "danger",
  read: "neutral",
};

const KIND_TONE: Record<CrmNotificationKind, string> = {
  payment: "bg-success/14 text-success",
  trip: "bg-primary/12 text-primary",
  task: "bg-accent/12 text-accent",
  birthday: "bg-warning/16 text-warning",
  campaign: "bg-primary/12 text-primary",
  system: "bg-surface-2 text-muted-foreground",
};

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "sent", label: "Enviadas" },
  { key: "scheduled", label: "Programadas" },
  { key: "failed", label: "Fallidas" },
  { key: "read", label: "Leídas" },
];

export function NotificationsView({ initial }: { initial: CrmNotification[] }) {
  const { can } = useAuth();
  const canManage = can("notifications.manage");
  const [items, setItems] = useState<CrmNotification[]>(initial);
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);

  const stats = useMemo(() => {
    const sent = items.filter((n) => n.status === "sent").length;
    const scheduled = items.filter((n) => n.status === "scheduled").length;
    const failed = items.filter((n) => n.status === "failed").length;
    return { total: items.length, sent, scheduled, failed };
  }, [items]);

  const rows = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((n) => n.status === (filter as CrmNotificationStatus));
  }, [items, filter]);

  const statCards = [
    { label: "Total", value: formatInt(stats.total), icon: Bell, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Enviadas", value: formatInt(stats.sent), icon: Send, tone: "bg-success/14 text-success", filter: "sent" },
    { label: "Programadas", value: formatInt(stats.scheduled), icon: Clock, tone: "bg-accent/12 text-accent", filter: "scheduled" },
    { label: "Fallidas", value: formatInt(stats.failed), icon: AlertTriangle, tone: "bg-danger/14 text-danger", filter: "failed" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Notificaciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">Bandeja unificada: email, WhatsApp, SMS, push y en la app</p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Enviar notificación
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

      <div className="mt-6 overflow-x-auto pb-1">
        <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="notifications-filter" />
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">No hay notificaciones en este filtro.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((n) => {
              const Icon = KIND_ICON[n.kind];
              const ChannelIcon = CHANNEL_ICON[n.channel];
              return (
                <li key={n.id} className="flex items-start gap-4 px-4 py-4 transition-colors hover:bg-surface-2/40 sm:px-5">
                  <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", KIND_TONE[n.kind])}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate font-medium">{n.title}</p>
                      <Badge tone={STATUS_TONE[n.status]}>{CRM_NOTIFICATION_STATUS_LABEL[n.status]}</Badge>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{n.body}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <ChannelIcon className="h-3.5 w-3.5" /> {CRM_NOTIFICATION_CHANNEL_LABEL[n.channel]}
                      </span>
                      {n.recipient && <span>· {n.recipient}</span>}
                      <span>· {formatDate(n.at)} {formatTime(n.at)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {canManage && (
        <NotificationForm open={formOpen} onClose={() => setFormOpen(false)} onSend={(n) => setItems((prev) => [n, ...prev])} />
      )}
    </div>
  );
}
