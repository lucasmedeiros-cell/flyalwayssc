"use client";

import { useState } from "react";
import { Plus, CalendarClock, Link2 } from "lucide-react";
import type { CrmTask, CrmTaskStatus, CrmTaskPriority } from "@vialta/types";
import { CRM_TASK_STATUS_LABEL, CRM_TASK_PRIORITY_LABEL } from "@vialta/types";
import { Avatar, Badge, type BadgeTone, Button, cn, formatDate } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { TaskForm } from "./task-form";

const COLUMNS: { key: CrmTaskStatus; accent: string }[] = [
  { key: "todo", accent: "bg-warning" },
  { key: "in_progress", accent: "bg-primary" },
  { key: "done", accent: "bg-success" },
];

const PRIORITY_TONE: Record<CrmTaskPriority, BadgeTone> = {
  low: "neutral",
  medium: "primary",
  high: "warning",
  urgent: "danger",
};

export function TasksBoard({ initialTasks }: { initialTasks: CrmTask[] }) {
  const { can } = useAuth();
  const canManage = can("tasks.manage");
  const [tasks, setTasks] = useState<CrmTask[]>(initialTasks);
  const [formOpen, setFormOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<CrmTaskStatus | null>(null);

  function move(id: string, status: CrmTaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  function onDrop(status: CrmTaskStatus) {
    if (dragId) move(dragId, status);
    setDragId(null);
    setOverCol(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Tareas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tablero de tareas{canManage ? " · arrastra para cambiar de estado" : ""}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nueva tarea
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={canManage ? (e) => { e.preventDefault(); setOverCol(col.key); } : undefined}
              onDragLeave={() => setOverCol((c) => (c === col.key ? null : c))}
              onDrop={canManage ? () => onDrop(col.key) : undefined}
              className={cn(
                "rounded-3xl border bg-surface-2/40 p-3 transition-colors",
                overCol === col.key ? "border-primary/50 bg-primary/5" : "border-border"
              )}
            >
              <div className="flex items-center gap-2 px-2 py-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", col.accent)} />
                <h2 className="text-sm font-semibold">{CRM_TASK_STATUS_LABEL[col.key]}</h2>
                <span className="ml-auto rounded-full bg-surface px-2 text-xs tabular-nums text-muted-foreground">{colTasks.length}</span>
              </div>

              <div className="mt-2 space-y-2.5">
                {colTasks.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                    Sin tareas
                  </p>
                )}
                {colTasks.map((t) => (
                  <article
                    key={t.id}
                    draggable={canManage}
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => { setDragId(null); setOverCol(null); }}
                    className={cn(
                      "rounded-2xl border border-border bg-surface p-3.5 shadow-[var(--shadow-sm)] transition-opacity",
                      canManage && "cursor-grab active:cursor-grabbing",
                      dragId === t.id && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{t.title}</p>
                      <Badge tone={PRIORITY_TONE[t.priority]}>{CRM_TASK_PRIORITY_LABEL[t.priority]}</Badge>
                    </div>
                    {t.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.description}</p>}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        {t.dueDate && (
                          <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{formatDate(t.dueDate)}</span>
                        )}
                        {t.relatedTo && (
                          <span className="inline-flex items-center gap-1"><Link2 className="h-3 w-3" />{t.relatedTo}</span>
                        )}
                      </div>
                      <Avatar initials={t.assigneeInitials} size={26} />
                    </div>
                    {/* Mover (accesible / móvil sin drag) */}
                    {canManage && (
                      <div className="mt-2.5 flex gap-1.5 border-t border-border pt-2.5">
                        {COLUMNS.filter((c) => c.key !== t.status).map((c) => (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => move(t.id, c.key)}
                            className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/12 hover:text-primary"
                          >
                            → {CRM_TASK_STATUS_LABEL[c.key]}
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {canManage && (
        <TaskForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(t) => setTasks((prev) => [t, ...prev])} />
      )}
    </div>
  );
}
