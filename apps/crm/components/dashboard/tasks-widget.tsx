"use client";

import type { CrmTaskSummary, CrmTaskPriority } from "@vialta/types";
import { CRM_TASK_PRIORITY_LABEL } from "@vialta/types";
import { Avatar, Badge, type BadgeTone, formatDate } from "@vialta/ui";

const PRIORITY_TONE: Record<CrmTaskPriority, BadgeTone> = {
  low: "neutral",
  medium: "primary",
  high: "warning",
  urgent: "danger",
};

export function TasksWidget({ tasks }: { tasks: CrmTaskSummary[] }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Tareas pendientes</h3>
        <span className="text-xs text-muted-foreground">{tasks.length} activas</span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-surface-2/60">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.title}</p>
              {t.dueDate && <p className="text-[11px] text-muted-foreground">Vence {formatDate(`${t.dueDate}T00:00:00`)}</p>}
            </div>
            <Badge tone={PRIORITY_TONE[t.priority]}>{CRM_TASK_PRIORITY_LABEL[t.priority]}</Badge>
            <Avatar initials={t.assigneeInitials} size={28} />
          </li>
        ))}
      </ul>
    </div>
  );
}
