import type { ID, ISODate, ISODateTime, Money } from "./common";

/* ------------------------------------------------------------------ */
/* Pago — control financiero.                                          */
/* ------------------------------------------------------------------ */

export type PaymentMethod = "cash" | "card" | "qr" | "transfer" | "paypal" | "stripe";

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  qr: "QR",
  transfer: "Transferencia",
  paypal: "PayPal",
  stripe: "Stripe",
};

export type PaymentStatus = "pending" | "partial" | "paid" | "refunded";

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Pendiente",
  partial: "Parcial",
  paid: "Pagado",
  refunded: "Reembolsado",
};

export interface PaymentTxn {
  id: ID;
  at: ISODateTime;
  method: PaymentMethod;
  amount: Money;
  reference?: string;
}

export interface Payment {
  id: ID;
  code: string;
  customerId?: ID;
  customerName: string;
  concept: string;
  /** Pasaje/cotización relacionado (código). */
  relatedCode?: string;
  method: PaymentMethod;
  total: Money;
  paid: Money;
  status: PaymentStatus;
  dueDate?: ISODate;
  agentName: string;
  createdAt: ISODateTime;
}

/** Pago con su historial de abonos. */
export interface PaymentDetail extends Payment {
  transactions: PaymentTxn[];
}

/** Saldo pendiente (nunca negativo). */
export function paymentBalance(p: Pick<Payment, "total" | "paid">): number {
  return Math.max(0, p.total.amount - p.paid.amount);
}

/** Recalcula el estado según total/pagado. */
export function paymentStatusFor(total: number, paid: number): PaymentStatus {
  if (paid <= 0) return "pending";
  if (paid >= total) return "paid";
  return "partial";
}
