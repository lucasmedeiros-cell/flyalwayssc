import type { ID, ISODate, ISODateTime, CurrencyCode } from "./common";

/* ------------------------------------------------------------------ */
/* Cotización — módulo Cotizador.                                      */
/* ------------------------------------------------------------------ */

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted";

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  draft: "Borrador",
  sent: "Enviada",
  accepted: "Aceptada",
  rejected: "Rechazada",
  expired: "Vencida",
  converted: "Convertida",
};

export interface QuoteItem {
  id: ID;
  description: string;
  detail?: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: ID;
  code: string;
  customerId?: ID;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  agentName: string;
  items: QuoteItem[];
  currency: CurrencyCode;
  /** Impuesto en porcentaje (p. ej. 13 para IVA). */
  taxPct: number;
  validUntil: ISODate;
  status: QuoteStatus;
  notes?: string;
  createdAt: ISODateTime;
}

/* --------------------------- Cálculos ------------------------------ */

export function quoteSubtotal(q: Pick<Quote, "items">): number {
  return q.items.reduce((a, it) => a + it.quantity * it.unitPrice, 0);
}

export function quoteTaxes(q: Pick<Quote, "items" | "taxPct">): number {
  return Math.round(quoteSubtotal(q) * (q.taxPct / 100) * 100) / 100;
}

export function quoteTotal(q: Pick<Quote, "items" | "taxPct">): number {
  return quoteSubtotal(q) + quoteTaxes(q);
}
