import type { ID, ISODate, ISODateTime, Money } from "./common";

/* ------------------------------------------------------------------ */
/* Documento generado — facturas, recibos, vouchers, etc.              */
/* ------------------------------------------------------------------ */

export type DocumentKind =
  | "invoice"
  | "receipt"
  | "credit_note"
  | "voucher"
  | "itinerary"
  | "confirmation"
  | "contract";

export const DOCUMENT_KIND_LABEL: Record<DocumentKind, string> = {
  invoice: "Factura",
  receipt: "Recibo",
  credit_note: "Nota de crédito",
  voucher: "Voucher",
  itinerary: "Itinerario",
  confirmation: "Confirmación",
  contract: "Contrato",
};

export type DocumentStatus = "issued" | "void";

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  issued: "Emitido",
  void: "Anulado",
};

export interface GeneratedDocument {
  id: ID;
  code: string;
  kind: DocumentKind;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  /** Pasaje/pago relacionado. */
  relatedCode?: string;
  concept: string;
  amount?: Money;
  issuedAt: ISODate;
  status: DocumentStatus;
  agentName: string;
  createdAt: ISODateTime;
}
