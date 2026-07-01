import type { ID, ISODateTime } from "./common";

/* ------------------------------------------------------------------ */
/* Notificaciones del CRM — bandeja unificada (email, WhatsApp, etc).  */
/* Prefijo `Crm*` para no colisionar con las notificaciones del web    */
/* (apps/web usa el `NotificationChannel` de ./notification).          */
/* ------------------------------------------------------------------ */

export type CrmNotificationChannel = "email" | "whatsapp" | "sms" | "push" | "in_app";

export const CRM_NOTIFICATION_CHANNEL_LABEL: Record<CrmNotificationChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  sms: "SMS",
  push: "Push",
  in_app: "En la app",
};

export type CrmNotificationStatus = "sent" | "scheduled" | "failed" | "read";

export const CRM_NOTIFICATION_STATUS_LABEL: Record<CrmNotificationStatus, string> = {
  sent: "Enviada",
  scheduled: "Programada",
  failed: "Fallida",
  read: "Leída",
};

export type CrmNotificationKind = "payment" | "trip" | "task" | "birthday" | "campaign" | "system";

export const CRM_NOTIFICATION_KIND_LABEL: Record<CrmNotificationKind, string> = {
  payment: "Pago",
  trip: "Viaje",
  task: "Tarea",
  birthday: "Cumpleaños",
  campaign: "Campaña",
  system: "Sistema",
};

export interface CrmNotification {
  id: ID;
  kind: CrmNotificationKind;
  channel: CrmNotificationChannel;
  status: CrmNotificationStatus;
  title: string;
  body: string;
  /** Destinatario (cliente, agente o "Todos"). */
  recipient?: string;
  at: ISODateTime;
}
