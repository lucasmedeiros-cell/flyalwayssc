import type { ID, ISODateTime } from "./common";
import type { CrmRole } from "./crm";

/* ------------------------------------------------------------------ */
/* Permisos granulares (RBAC). Convención: "<recurso>.<acción>".        */
/* ------------------------------------------------------------------ */

export type CrmPermission =
  | "dashboard.view"
  | "clients.view"
  | "clients.edit"
  | "clients.delete"
  | "tickets.view"
  | "tickets.sell"
  | "tickets.refund"
  | "packages.view"
  | "packages.manage"
  | "quotes.view"
  | "quotes.manage"
  | "payments.view"
  | "payments.manage"
  | "calendar.view"
  | "tasks.view"
  | "tasks.manage"
  | "agents.view"
  | "agents.manage"
  | "providers.view"
  | "providers.manage"
  | "reports.view"
  | "documents.view"
  | "documents.manage"
  | "marketing.view"
  | "marketing.manage"
  | "automations.view"
  | "automations.manage"
  | "notifications.view"
  | "notifications.manage"
  | "settings.view"
  | "settings.manage";

export const CRM_ALL_PERMISSIONS: CrmPermission[] = [
  "dashboard.view",
  "clients.view",
  "clients.edit",
  "clients.delete",
  "tickets.view",
  "tickets.sell",
  "tickets.refund",
  "packages.view",
  "packages.manage",
  "quotes.view",
  "quotes.manage",
  "payments.view",
  "payments.manage",
  "calendar.view",
  "tasks.view",
  "tasks.manage",
  "agents.view",
  "agents.manage",
  "providers.view",
  "providers.manage",
  "reports.view",
  "documents.view",
  "documents.manage",
  "marketing.view",
  "marketing.manage",
  "automations.view",
  "automations.manage",
  "notifications.view",
  "notifications.manage",
  "settings.view",
  "settings.manage",
];

export const CRM_PERMISSION_LABEL: Record<CrmPermission, string> = {
  "dashboard.view": "Ver dashboard",
  "clients.view": "Ver clientes",
  "clients.edit": "Editar clientes",
  "clients.delete": "Eliminar clientes",
  "tickets.view": "Ver pasajes",
  "tickets.sell": "Vender / emitir pasajes",
  "tickets.refund": "Reembolsos y reemisiones",
  "packages.view": "Ver paquetes",
  "packages.manage": "Gestionar paquetes",
  "quotes.view": "Ver cotizaciones",
  "quotes.manage": "Gestionar cotizaciones",
  "payments.view": "Ver pagos",
  "payments.manage": "Gestionar pagos",
  "calendar.view": "Ver calendario",
  "tasks.view": "Ver tareas",
  "tasks.manage": "Gestionar tareas",
  "agents.view": "Ver agentes",
  "agents.manage": "Gestionar agentes",
  "providers.view": "Ver proveedores",
  "providers.manage": "Gestionar proveedores",
  "reports.view": "Ver reportes",
  "documents.view": "Ver documentos",
  "documents.manage": "Generar documentos",
  "marketing.view": "Ver marketing",
  "marketing.manage": "Gestionar marketing",
  "automations.view": "Ver automatizaciones",
  "automations.manage": "Gestionar automatizaciones",
  "notifications.view": "Ver notificaciones",
  "notifications.manage": "Enviar notificaciones",
  "settings.view": "Ver ajustes",
  "settings.manage": "Administrar ajustes",
};

/** Matriz rol → permisos. `admin` recibe todos. */
export const CRM_ROLE_PERMISSIONS: Record<CrmRole, CrmPermission[]> = {
  admin: CRM_ALL_PERMISSIONS,
  supervisor: [
    "dashboard.view",
    "clients.view",
    "clients.edit",
    "clients.delete",
    "tickets.view",
    "tickets.sell",
    "tickets.refund",
    "packages.view",
    "packages.manage",
    "quotes.view",
    "quotes.manage",
    "payments.view",
    "payments.manage",
    "calendar.view",
    "tasks.view",
    "tasks.manage",
    "agents.view",
    "agents.manage",
    "providers.view",
    "providers.manage",
    "reports.view",
    "documents.view",
    "documents.manage",
    "marketing.view",
    "automations.view",
    "notifications.view",
    "notifications.manage",
    "settings.view",
  ],
  agent: [
    "dashboard.view",
    "clients.view",
    "clients.edit",
    "tickets.view",
    "tickets.sell",
    "packages.view",
    "quotes.view",
    "quotes.manage",
    "payments.view",
    "calendar.view",
    "tasks.view",
    "tasks.manage",
    "providers.view",
    "documents.view",
    "notifications.view",
  ],
  accounting: [
    "dashboard.view",
    "clients.view",
    "tickets.view",
    "payments.view",
    "payments.manage",
    "reports.view",
    "documents.view",
    "documents.manage",
    "providers.view",
    "notifications.view",
  ],
  marketing: [
    "dashboard.view",
    "clients.view",
    "calendar.view",
    "reports.view",
    "marketing.view",
    "marketing.manage",
    "automations.view",
    "automations.manage",
    "notifications.view",
    "notifications.manage",
  ],
};

/** ¿El rol incluye el permiso? */
export function roleCan(role: CrmRole, permission: CrmPermission): boolean {
  return CRM_ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/* ------------------------------------------------------------------ */
/* Usuario, sesión y auditoría.                                        */
/* ------------------------------------------------------------------ */

export interface CrmUser {
  id: ID;
  name: string;
  initials: string;
  email: string;
  role: CrmRole;
  /** Color de marca para el avatar (hex). */
  color?: string;
  active: boolean;
  twoFactorEnabled: boolean;
  lastActiveAt?: ISODateTime;
}

export interface CrmActiveSession {
  id: ID;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActiveAt: ISODateTime;
  current: boolean;
}

export type CrmAuditAction = "create" | "update" | "delete" | "login" | "logout" | "export" | "permission_change";

export const CRM_AUDIT_ACTION_LABEL: Record<CrmAuditAction, string> = {
  create: "Creación",
  update: "Modificación",
  delete: "Eliminación",
  login: "Inicio de sesión",
  logout: "Cierre de sesión",
  export: "Exportación",
  permission_change: "Cambio de permisos",
};

export interface CrmAuditEntry {
  id: ID;
  actor: string;
  actorInitials: string;
  action: CrmAuditAction;
  entity: string;
  detail?: string;
  at: ISODateTime;
  ip?: string;
}
