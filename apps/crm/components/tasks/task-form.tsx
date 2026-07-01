"use client";

import { useState } from "react";
import type { CrmTask, CrmTaskPriority, CrmTaskStatus } from "@vialta/types";
import { CRM_TASK_PRIORITY_LABEL, CRM_TASK_STATUS_LABEL } from "@vialta/types";
import { Modal, Input, Field, Select, Textarea, Button, initials as toInitials } from "@vialta/ui";

const PRIORITY_OPTIONS = (Object.keys(CRM_TASK_PRIORITY_LABEL) as CrmTaskPriority[]).map((k) => ({ value: k, label: CRM_TASK_PRIORITY_LABEL[k] }));
const STATUS_OPTIONS = (Object.keys(CRM_TASK_STATUS_LABEL) as CrmTaskStatus[]).map((k) => ({ value: k, label: CRM_TASK_STATUS_LABEL[k] }));
const ASSIGNEES = [
  { value: "a1", label: "Ana Flores" },
  { value: "a2", label: "Carlos Mendoza" },
  { value: "a3", label: "Lucía Pérez" },
];

export function TaskForm({
  open,
  onClose,
  onCreate,
  defaultStatus = "todo",
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (t: CrmTask) => void;
  defaultStatus?: CrmTaskStatus;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<CrmTaskPriority>("medium");
  const [status, setStatus] = useState<CrmTaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("a1");
  const [relatedTo, setRelatedTo] = useState("");

  function reset() {
    setTitle(""); setDescription(""); setPriority("medium"); setStatus(defaultStatus);
    setDueDate(""); setAssigneeId("a1"); setRelatedTo("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = ASSIGNEES.find((a) => a.value === assigneeId)?.label ?? "Ana Flores";
    const t: CrmTask = {
      id: `tk-${Date.now()}`,
      title,
      description: description || undefined,
      priority,
      status,
      dueDate: dueDate || undefined,
      assigneeId,
      assignee: name,
      assigneeInitials: toInitials(name),
      relatedTo: relatedTo || undefined,
      createdAt: new Date().toISOString(),
    };
    onCreate(t);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva tarea"
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="task-form" disabled={!title}>Crear tarea</Button>
        </>
      }
    >
      <form id="task-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Título" htmlFor="ti" className="sm:col-span-2">
          <Input id="ti" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Llamar a cliente…" />
        </Field>
        <Field label="Prioridad" htmlFor="pr">
          <Select id="pr" options={PRIORITY_OPTIONS} value={priority} onChange={(e) => setPriority(e.target.value as CrmTaskPriority)} />
        </Field>
        <Field label="Estado" htmlFor="st">
          <Select id="st" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as CrmTaskStatus)} />
        </Field>
        <Field label="Asignado a" htmlFor="as">
          <Select id="as" options={ASSIGNEES} value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} />
        </Field>
        <Field label="Fecha límite" htmlFor="dd">
          <Input id="dd" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
        <Field label="Relacionado (código)" htmlFor="rt" className="sm:col-span-2">
          <Input id="rt" value={relatedTo} onChange={(e) => setRelatedTo(e.target.value)} placeholder="FA-20418 / c5" />
        </Field>
        <Field label="Descripción" htmlFor="de" className="sm:col-span-2">
          <Textarea id="de" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalle de la tarea…" />
        </Field>
      </form>
    </Modal>
  );
}
