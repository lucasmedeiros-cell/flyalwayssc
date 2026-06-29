"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Inbox } from "lucide-react";
import type {
  AppNotification,
  NotificationCategory,
  NotificationChannel,
  NotificationPreferences,
} from "@vialta/types";
import { CATEGORY_LABEL, CHANNEL_LABEL, NOTIFICATION_CHANNELS } from "@vialta/types";
import { cn, formatRelative } from "@/lib/utils";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { Chip } from "@/components/ui/chip";
import { ChannelIcon } from "./channel-icon";
import { PreferencesPanel } from "./preferences-panel";

type Tab = "inbox" | "prefs";
type Filter = "all" | NotificationChannel;

export function NotificationsView({
  initialNotifications,
  initialPrefs,
}: {
  initialNotifications: AppNotification[];
  initialPrefs: NotificationPreferences;
}) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [items, setItems] = useState(initialNotifications);
  const [prefs, setPrefs] = useState(initialPrefs);
  const [filter, setFilter] = useState<Filter>("all");

  const unread = items.filter((n) => !n.read).length;
  const visible = filter === "all" ? items : items.filter((n) => n.channel === filter);

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOne = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const togglePref = (
    category: NotificationCategory,
    channel: NotificationChannel,
    value: boolean
  ) =>
    setPrefs((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.category === category ? { ...c, channels: { ...c.channels, [channel]: value } } : c
      ),
    }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
            Notificaciones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0 ? `Tienes ${unread} sin leer` : "Estás al día"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex w-fit gap-1 rounded-full border border-border bg-surface-2/70 p-1 text-sm">
        {([
          { key: "inbox", label: "Bandeja" },
          { key: "prefs", label: "Preferencias" },
        ] as const).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "relative rounded-full px-4 py-1.5 font-medium transition-colors",
              tab === t.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === t.key && (
              <motion.span
                layoutId="notif-tab-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "inbox" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Chip active={filter === "all"} onClick={() => setFilter("all")}>
                  Todas
                </Chip>
                {NOTIFICATION_CHANNELS.map((ch) => (
                  <Chip key={ch} active={filter === ch} onClick={() => setFilter(ch)}>
                    {CHANNEL_LABEL[ch]}
                  </Chip>
                ))}
              </div>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Check className="h-4 w-4" />
                  Marcar todas
                </button>
              )}
            </div>

            {visible.length === 0 ? (
              <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-muted-foreground">
                  <Inbox className="h-6 w-6" />
                </span>
                <p className="mt-4 font-semibold">Sin notificaciones</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No hay mensajes para este canal.
                </p>
              </div>
            ) : (
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="mt-5 space-y-3"
              >
                {visible.map((n) => {
                  const inner = (
                    <div
                      className={cn(
                        "flex gap-4 rounded-3xl border bg-surface p-4 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)]",
                        n.read ? "border-border" : "border-primary/30"
                      )}
                    >
                      <ChannelIcon channel={n.channel} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <p className="flex-1 font-medium leading-snug">{n.title}</p>
                          {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {CATEGORY_LABEL[n.category]} · {CHANNEL_LABEL[n.channel]} ·{" "}
                          {formatRelative(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                  return (
                    <motion.li key={n.id} variants={fadeUp}>
                      {n.href ? (
                        <Link href={n.href} onClick={() => markOne(n.id)}>
                          {inner}
                        </Link>
                      ) : (
                        <button type="button" onClick={() => markOne(n.id)} className="block w-full text-left">
                          {inner}
                        </button>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </>
        ) : (
          <PreferencesPanel prefs={prefs} onToggle={togglePref} />
        )}
      </div>
    </div>
  );
}
