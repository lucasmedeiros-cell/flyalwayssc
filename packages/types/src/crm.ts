import type { ID, ISODate, ISODateTime, Money, CurrencyCode } from "./common";

/* ------------------------------------------------------------------ */
/* Roles internos del CRM (RBAC). Net-new — el `UserRole` de Prisma    */
/* (TRAVELER/OPERATOR_ADMIN/STAFF/PLATFORM_ADMIN) modela la plataforma  */
/* pública; estos roles modelan al personal de la agencia FLYALWAYS.    */
/* ------------------------------------------------------------------ */

export type CrmRole = "admin" | "supervisor" | "agent" | "accounting" | "marketing";

export const CRM_ROLE_LABEL: Record<CrmRole, string> = {
  admin: "Administrador",
  supervisor: "Supervisor",
  agent: "Agente",
  accounting: "Contabilidad",
  marketing: "Marketing",
};

/* ------------------------------------------------------------------ */
/* Indicadores y dashboard ejecutivo.                                  */
/* ------------------------------------------------------------------ */

export type CrmPeriod = "now" | "yesterday" | "today" | "month" | "year";

export const CRM_PERIOD_LABEL: Record<CrmPeriod, string> = {
  now: "Ahora",
  yesterday: "Ayer",
  today: "Hoy",
  month: "Mes",
  year: "Año",
};

/** KPI presentacional (números crudos, igual que `AdminKpi`). */
export interface CrmKpi {
  id: string;
  label: string;
  value: number;
  unit: "money" | "int" | "pct";
  deltaPct: number;
  /** "Bueno" cuando baja (p. ej. cancelaciones). */
  invert?: boolean;
}

export interface CrmRevenuePoint {
  label: string;
  revenue: number;
  sales: number;
}

export interface CrmDonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface CrmDashboardPeriodData {
  kpis: CrmKpi[];
  revenue: CrmRevenuePoint[];
}

/* ------------------------------------------------------------------ */
/* Actividad reciente (timeline unificado).                            */
/* ------------------------------------------------------------------ */

export type CrmActivityKind =
  | "sale"
  | "quote"
  | "payment"
  | "client"
  | "task"
  | "call"
  | "message"
  | "ticket";

export const CRM_ACTIVITY_LABEL: Record<CrmActivityKind, string> = {
  sale: "Venta",
  quote: "Cotización",
  payment: "Pago",
  client: "Cliente",
  task: "Tarea",
  call: "Llamada",
  message: "Mensaje",
  ticket: "Pasaje",
};

export interface CrmActivity {
  id: ID;
  kind: CrmActivityKind;
  title: string;
  description?: string;
  actor: string;
  at: ISODateTime;
  amount?: Money;
}

/* ------------------------------------------------------------------ */
/* Calendario / agenda.                                                */
/* ------------------------------------------------------------------ */

export type CrmEventKind =
  | "departure"
  | "flight"
  | "meeting"
  | "follow_up"
  | "payment"
  | "birthday"
  | "passport_renewal"
  | "reminder";

export const CRM_EVENT_LABEL: Record<CrmEventKind, string> = {
  departure: "Salida",
  flight: "Vuelo",
  meeting: "Reunión",
  follow_up: "Seguimiento",
  payment: "Pago pendiente",
  birthday: "Cumpleaños",
  passport_renewal: "Renovación de pasaporte",
  reminder: "Recordatorio",
};

export interface CrmCalendarEvent {
  id: ID;
  kind: CrmEventKind;
  title: string;
  date: ISODate;
  time?: string;
  customerName?: string;
}

/* ------------------------------------------------------------------ */
/* Tareas.                                                             */
/* ------------------------------------------------------------------ */

export type CrmTaskPriority = "low" | "medium" | "high" | "urgent";
export type CrmTaskStatus = "todo" | "in_progress" | "done";

export const CRM_TASK_PRIORITY_LABEL: Record<CrmTaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export const CRM_TASK_STATUS_LABEL: Record<CrmTaskStatus, string> = {
  todo: "Pendiente",
  in_progress: "En curso",
  done: "Completada",
};

export interface CrmTaskSummary {
  id: ID;
  title: string;
  priority: CrmTaskPriority;
  status: CrmTaskStatus;
  dueDate?: ISODate;
  assignee: string;
  assigneeInitials: string;
}

/* ------------------------------------------------------------------ */
/* Rankings.                                                           */
/* ------------------------------------------------------------------ */

export interface CrmTopAgent {
  id: ID;
  name: string;
  initials: string;
  sales: number;
  revenue: number;
  /** % de avance sobre objetivo (0..100+). */
  goalPct: number;
}

export interface CrmTopDestination {
  id: ID;
  label: string;
  bookings: number;
  trendPct: number;
}

/* ------------------------------------------------------------------ */
/* Dashboard agregado (raíz que consume la vista).                     */
/* ------------------------------------------------------------------ */

export interface CrmDashboard {
  currency: CurrencyCode;
  periods: Record<CrmPeriod, CrmDashboardPeriodData>;
  salesByChannel: CrmDonutSegment[];
  topAgents: CrmTopAgent[];
  topDestinations: CrmTopDestination[];
  recentActivity: CrmActivity[];
  upcomingEvents: CrmCalendarEvent[];
  pendingTasks: CrmTaskSummary[];
  /** Conteos de cabecera (reservas, boletos, clientes). */
  bookingsPending: number;
  bookingsConfirmed: number;
  bookingsCancelled: number;
  ticketsIssued: number;
  newCustomers: number;
  frequentCustomers: number;
}
