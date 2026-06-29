import { ID, ISODateTime } from "./common";

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp";

export const NOTIFICATION_CHANNELS: NotificationChannel[] = ["email", "sms", "push", "whatsapp"];

export const CHANNEL_LABEL: Record<NotificationChannel, string> = {
  email: "Email",
  sms: "SMS",
  push: "Push",
  whatsapp: "WhatsApp",
};

export type NotificationCategory = "booking" | "trip" | "promo" | "payment" | "account";

export const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  booking: "Reservas",
  trip: "Estado del viaje",
  promo: "Promociones",
  payment: "Pagos y facturas",
  account: "Cuenta y seguridad",
};

export interface AppNotification {
  id: ID;
  title: string;
  body: string;
  channel: NotificationChannel;
  category: NotificationCategory;
  createdAt: ISODateTime;
  read: boolean;
  /** Enlace opcional al recurso relacionado. */
  href?: string;
}

export interface CategoryPreference {
  category: NotificationCategory;
  channels: Record<NotificationChannel, boolean>;
}

export interface NotificationPreferences {
  email: string;
  phone: string;
  whatsapp: string;
  /** Activación por categoría y canal. */
  categories: CategoryPreference[];
}
