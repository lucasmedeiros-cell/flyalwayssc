"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  FileText,
  CreditCard,
  UserPlus,
  CheckSquare,
  Phone,
  MessageSquare,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import type { CrmActivity, CrmActivityKind } from "@vialta/types";
import { formatMoney, RelativeTime } from "@vialta/ui";

const ICON: Record<CrmActivityKind, LucideIcon> = {
  sale: ShoppingBag,
  quote: FileText,
  payment: CreditCard,
  client: UserPlus,
  task: CheckSquare,
  call: Phone,
  message: MessageSquare,
  ticket: Ticket,
};

const TONE: Record<CrmActivityKind, string> = {
  sale: "bg-success/14 text-success",
  quote: "bg-primary/12 text-primary",
  payment: "bg-success/14 text-success",
  client: "bg-accent/14 text-accent-strong dark:text-accent",
  task: "bg-warning/16 text-warning",
  call: "bg-primary/12 text-primary",
  message: "bg-primary/12 text-primary",
  ticket: "bg-primary/12 text-primary",
};

export function RecentActivity({ items }: { items: CrmActivity[] }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Actividad reciente</h3>
        <span className="relative flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          En vivo
        </span>
      </div>
      <ul className="mt-4 space-y-1">
        <AnimatePresence initial={false}>
          {items.map((a) => {
            const Icon = ICON[a.kind];
            return (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-surface-2/60"
              >
                <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONE[a.kind]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  {a.description && <p className="truncate text-xs text-muted-foreground">{a.description}</p>}
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {a.actor} · <RelativeTime iso={a.at} />
                  </p>
                </div>
                {a.amount && (
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-success">
                    {formatMoney(a.amount.amount, a.amount.currency)}
                  </span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
