"use client";

import {
  PlaneTakeoff,
  Plane,
  Users,
  PhoneCall,
  CreditCard,
  Cake,
  BookUser,
  Bell,
  type LucideIcon,
} from "lucide-react";
import type { CrmCalendarEvent, CrmEventKind } from "@vialta/types";
import { CRM_EVENT_LABEL } from "@vialta/types";

const ICON: Record<CrmEventKind, LucideIcon> = {
  departure: PlaneTakeoff,
  flight: Plane,
  meeting: Users,
  follow_up: PhoneCall,
  payment: CreditCard,
  birthday: Cake,
  passport_renewal: BookUser,
  reminder: Bell,
};

function formatDay(isoDate: string): { day: string; month: string } {
  const d = new Date(`${isoDate}T00:00:00`);
  return {
    day: d.toLocaleDateString("es", { day: "2-digit" }),
    month: d.toLocaleDateString("es", { month: "short" }),
  };
}

export function MiniAgenda({ events }: { events: CrmCalendarEvent[] }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold">Próximos eventos</h3>
      <ul className="mt-4 space-y-2.5">
        {events.map((e) => {
          const Icon = ICON[e.kind];
          const { day, month } = formatDay(e.date);
          return (
            <li key={e.id} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl bg-surface-2 leading-none">
                <span className="text-sm font-bold tabular-nums">{day}</span>
                <span className="text-[10px] uppercase text-muted-foreground">{month}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {CRM_EVENT_LABEL[e.kind]}
                  {e.time ? ` · ${e.time}` : ""}
                  {e.customerName ? ` · ${e.customerName}` : ""}
                </p>
              </div>
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
