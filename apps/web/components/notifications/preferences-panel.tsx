"use client";

import { Mail, Smartphone, MessageCircle } from "lucide-react";
import type {
  NotificationChannel,
  NotificationCategory,
  NotificationPreferences,
} from "@vialta/types";
import { CATEGORY_LABEL, CHANNEL_LABEL, NOTIFICATION_CHANNELS } from "@vialta/types";
import { Switch } from "@/components/ui/switch";
import { CHANNEL_ICON } from "./channel-icon";

export function PreferencesPanel({
  prefs,
  onToggle,
}: {
  prefs: NotificationPreferences;
  onToggle: (category: NotificationCategory, channel: NotificationChannel, value: boolean) => void;
}) {
  const contacts = [
    { icon: Mail, label: "Email", value: prefs.email },
    { icon: Smartphone, label: "SMS", value: prefs.phone },
    { icon: MessageCircle, label: "WhatsApp", value: prefs.whatsapp },
  ];

  return (
    <div className="space-y-6">
      {/* Datos de contacto */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {contacts.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-muted-foreground">
              <c.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="truncate text-sm font-medium">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Matriz categoría × canal */}
      <div className="space-y-4">
        {prefs.categories.map((cat) => (
          <div
            key={cat.category}
            className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]"
          >
            <p className="font-semibold">{CATEGORY_LABEL[cat.category]}</p>
            <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {NOTIFICATION_CHANNELS.map((ch) => {
                const Icon = CHANNEL_ICON[ch];
                return (
                  <Switch
                    key={ch}
                    checked={cat.channels[ch]}
                    onChange={(v) => onToggle(cat.category, ch, v)}
                    icon={<Icon className="h-4 w-4" />}
                    label={CHANNEL_LABEL[ch]}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
