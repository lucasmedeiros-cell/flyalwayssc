"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppNotification } from "@vialta/types";
import { getDataSource } from "@/lib/services";
import { cn, formatRelative } from "@/lib/utils";
import { ChannelIcon } from "./channel-icon";

export function NotificationsBell() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getDataSource()
      .getNotifications()
      .then(setItems);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;
  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOne = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notificaciones${unread ? `, ${unread} sin leer` : ""}`}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 backdrop-blur transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-semibold">Notificaciones</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Check className="h-3.5 w-3.5" />
                  Marcar todas
                </button>
              )}
            </div>

            <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto border-t border-border">
              {items.length === 0 && (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No hay notificaciones.
                </li>
              )}
              {items.slice(0, 6).map((n) => {
                const content = (
                  <div className="flex gap-3 px-4 py-3 transition-colors hover:bg-surface-2">
                    <ChannelIcon channel={n.channel} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <p className="flex-1 text-sm font-medium leading-snug">{n.title}</p>
                        {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{formatRelative(n.createdAt)}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id} className={cn(!n.read && "bg-primary/[0.04]")}>
                    {n.href ? (
                      <Link href={n.href} onClick={() => { markOne(n.id); setOpen(false); }}>
                        {content}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => markOne(n.id)} className="block w-full text-left">
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <Link
              href="/notificaciones"
              onClick={() => setOpen(false)}
              className="block border-t border-border px-4 py-3 text-center text-sm font-medium text-primary hover:bg-surface-2"
            >
              Ver todas
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
