import type { ID, ISODateTime } from "./common";
import type { MarketingChannel } from "./crm-marketing";

/* ------------------------------------------------------------------ */
/* Automatizaciones — flujos disparados por eventos del negocio.       */
/* ------------------------------------------------------------------ */

export type AutomationTrigger =
  | "payment_due"
  | "trip_upcoming"
  | "birthday"
  | "inactive_client"
  | "quote_followup"
  | "passport_expiry";

export const AUTOMATION_TRIGGER_LABEL: Record<AutomationTrigger, string> = {
  payment_due: "Pago por vencer",
  trip_upcoming: "Viaje próximo",
  birthday: "Cumpleaños del cliente",
  inactive_client: "Cliente inactivo",
  quote_followup: "Seguimiento de cotización",
  passport_expiry: "Vencimiento de pasaporte",
};

export type AutomationStatus = "active" | "paused";

export const AUTOMATION_STATUS_LABEL: Record<AutomationStatus, string> = {
  active: "Activa",
  paused: "Pausada",
};

export interface Automation {
  id: ID;
  name: string;
  trigger: AutomationTrigger;
  channel: MarketingChannel;
  status: AutomationStatus;
  /** Condición legible del disparador, ej. "3 días antes del viaje". */
  timing: string;
  /** Veces que se ejecutó. */
  runs: number;
  lastRunAt?: ISODateTime;
  createdAt: ISODateTime;
}
