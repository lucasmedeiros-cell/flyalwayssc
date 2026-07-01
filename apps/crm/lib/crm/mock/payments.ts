import type { PaymentDetail } from "@vialta/types";

const bob = (amount: number) => ({ amount, currency: "BOB" as const });

export const MOCK_PAYMENTS: PaymentDetail[] = [
  {
    id: "pay1", code: "PG-3041", customerId: "c8", customerName: "Familia Gutiérrez", concept: "Boletos VVI → MAD (4 pax)", relatedCode: "FA-20418",
    method: "qr", total: bob(18450), paid: bob(18450), status: "paid", agentName: "Ana Flores", createdAt: "2026-06-12T16:00:00Z",
    transactions: [
      { id: "x1", at: "2026-06-12T16:00:00Z", method: "qr", amount: bob(9450), reference: "QR-88123" },
      { id: "x2", at: "2026-06-20T10:00:00Z", method: "transfer", amount: bob(9000), reference: "TRX-55012" },
    ],
  },
  {
    id: "pay2", code: "PG-3042", customerId: "c1", customerName: "Roberto Áñez", concept: "Boleto VVI → MIA ejecutiva", relatedCode: "FA-20419",
    method: "card", total: bob(26500), paid: bob(13250), status: "partial", dueDate: "2026-07-08", agentName: "Ana Flores", createdAt: "2026-06-20T11:30:00Z",
    transactions: [{ id: "x1", at: "2026-06-20T11:30:00Z", method: "card", amount: bob(13250), reference: "VISA-4421" }],
  },
  {
    id: "pay3", code: "PG-3043", customerId: "c3", customerName: "Pedro Quispe", concept: "Reserva CBB → GRU", relatedCode: "FA-20420",
    method: "transfer", total: bob(6600), paid: bob(0), status: "pending", dueDate: "2026-07-03", agentName: "Carlos Mendoza", createdAt: "2026-06-28T09:30:00Z",
    transactions: [],
  },
  {
    id: "pay4", code: "PG-3044", customerId: "c4", customerName: "Laura Vargas", concept: "Anticipo crucero Caribe", relatedCode: "FA-Q1042",
    method: "qr", total: bob(23052), paid: bob(5000), status: "partial", dueDate: "2026-07-10", agentName: "Lucía Pérez", createdAt: "2026-06-30T13:00:00Z",
    transactions: [{ id: "x1", at: "2026-06-30T13:00:00Z", method: "qr", amount: bob(5000), reference: "QR-90455" }],
  },
  {
    id: "pay5", code: "PG-3045", customerId: "c5", customerName: "Carmen Justiniano", concept: "Boletos VVI → MCO (reembolso)", relatedCode: "FA-20410",
    method: "card", total: bob(23100), paid: bob(23100), status: "refunded", agentName: "Ana Flores", createdAt: "2026-04-15T10:30:00Z",
    transactions: [
      { id: "x1", at: "2026-04-15T10:30:00Z", method: "card", amount: bob(23100), reference: "VISA-9001" },
      { id: "x2", at: "2026-05-02T09:00:00Z", method: "transfer", amount: bob(-23100), reference: "REEMB-12" },
    ],
  },
  {
    id: "pay6", code: "PG-3046", customerId: "c12", customerName: "Sofía Antelo", concept: "Boleto VVI → CTG", relatedCode: "FA-20411",
    method: "stripe", total: bob(8800), paid: bob(8800), status: "paid", agentName: "Lucía Pérez", createdAt: "2026-06-05T12:30:00Z",
    transactions: [{ id: "x1", at: "2026-06-05T12:30:00Z", method: "stripe", amount: bob(8800), reference: "ch_3PqX" }],
  },
  {
    id: "pay7", code: "PG-3047", customerId: "c10", customerName: "Patricia Vaca", concept: "Anticipo VVI → JFK", relatedCode: "FA-20423",
    method: "paypal", total: bob(19000), paid: bob(9500), status: "partial", dueDate: "2026-07-20", agentName: "Carlos Mendoza", createdAt: "2026-06-29T16:30:00Z",
    transactions: [{ id: "x1", at: "2026-06-29T16:30:00Z", method: "paypal", amount: bob(9500), reference: "PP-77231" }],
  },
];
