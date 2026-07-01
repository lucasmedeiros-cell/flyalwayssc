import type { ID, ISODate, ISODateTime } from "./common";
import type { CrmTaskPriority, CrmTaskStatus } from "./crm";

/* ------------------------------------------------------------------ */
/* Tarea completa (gestor interno). Reutiliza prioridad/estado de crm. */
/* ------------------------------------------------------------------ */

export interface CrmTask {
  id: ID;
  title: string;
  description?: string;
  priority: CrmTaskPriority;
  status: CrmTaskStatus;
  dueDate?: ISODate;
  assigneeId: ID;
  assignee: string;
  assigneeInitials: string;
  /** Entidad relacionada (cliente, pasaje…). */
  relatedTo?: string;
  createdAt: ISODateTime;
}
