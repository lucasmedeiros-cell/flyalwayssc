import type { ID, ISODateTime, Money } from "./common";

/* ------------------------------------------------------------------ */
/* Marketing — campañas, segmentación y embudos de conversión.         */
/* ------------------------------------------------------------------ */

export type MarketingChannel = "email" | "whatsapp" | "sms" | "push";

export const MARKETING_CHANNEL_LABEL: Record<MarketingChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  sms: "SMS",
  push: "Push",
};

export type CampaignStatus = "draft" | "scheduled" | "active" | "completed" | "paused";

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "Borrador",
  scheduled: "Programada",
  active: "En curso",
  completed: "Finalizada",
  paused: "Pausada",
};

/** Segmento de audiencia objetivo de la campaña. */
export type CampaignAudience = "all" | "frequent" | "inactive" | "new" | "birthday" | "with_balance" | "custom";

export const CAMPAIGN_AUDIENCE_LABEL: Record<CampaignAudience, string> = {
  all: "Todos los clientes",
  frequent: "Clientes frecuentes",
  inactive: "Clientes inactivos",
  new: "Clientes nuevos",
  birthday: "Cumpleañeros del mes",
  with_balance: "Con saldo pendiente",
  custom: "Segmento personalizado",
};

export interface CampaignMetrics {
  /** Tamaño de la audiencia segmentada. */
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  /** Ingresos atribuidos a la campaña. */
  revenue?: Money;
}

export interface Campaign {
  id: ID;
  name: string;
  channel: MarketingChannel;
  status: CampaignStatus;
  audience: CampaignAudience;
  /** Asunto (email) o primera línea del mensaje. */
  subject?: string;
  owner: string;
  scheduledAt?: ISODateTime;
  sentAt?: ISODateTime;
  metrics: CampaignMetrics;
  createdAt: ISODateTime;
}

/** Etapa del embudo de conversión (segmentación → venta). */
export interface FunnelStage {
  label: string;
  value: number;
}

/** Vista agregada del módulo de Marketing. */
export interface MarketingOverview {
  campaigns: Campaign[];
  funnel: FunnelStage[];
}

/** % de apertura sobre enviados (0–100). */
export function campaignOpenRate(m: CampaignMetrics): number {
  return m.sent > 0 ? (m.opened / m.sent) * 100 : 0;
}

/** % de conversión sobre enviados (0–100). */
export function campaignConversionRate(m: CampaignMetrics): number {
  return m.sent > 0 ? (m.converted / m.sent) * 100 : 0;
}
