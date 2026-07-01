import type { GeneratedDocument } from "@vialta/types";

const bob = (amount: number) => ({ amount, currency: "BOB" as const });

export const MOCK_DOCUMENTS: GeneratedDocument[] = [
  {
    id: "d1", code: "FAC-10231", kind: "invoice", customerName: "Familia Gutiérrez", customerEmail: "gutierrez.familia@gmail.com",
    relatedCode: "FA-20418", concept: "Boletos VVI → MAD (4 pax)", amount: bob(18450), issuedAt: "2026-06-20", status: "issued",
    agentName: "Ana Flores", createdAt: "2026-06-20T10:05:00Z",
  },
  {
    id: "d2", code: "REC-20489", kind: "receipt", customerName: "Familia Gutiérrez", customerEmail: "gutierrez.familia@gmail.com",
    relatedCode: "PG-3041", concept: "Pago total boletos Madrid", amount: bob(18450), issuedAt: "2026-06-20", status: "issued",
    agentName: "Ana Flores", createdAt: "2026-06-20T10:06:00Z",
  },
  {
    id: "d3", code: "VOU-5512", kind: "voucher", customerName: "Sofía Antelo", relatedCode: "FA-20411",
    concept: "Hotel Cartagena · 4 noches", amount: bob(3200), issuedAt: "2026-06-06", status: "issued",
    agentName: "Lucía Pérez", createdAt: "2026-06-06T09:00:00Z",
  },
  {
    id: "d4", code: "ITN-8841", kind: "itinerary", customerName: "Roberto Áñez", relatedCode: "FA-20419",
    concept: "Itinerario VVI → MIA ida y vuelta", issuedAt: "2026-06-21", status: "issued",
    agentName: "Ana Flores", createdAt: "2026-06-21T08:00:00Z",
  },
  {
    id: "d5", code: "CNF-3120", kind: "confirmation", customerName: "Patricia Vaca", relatedCode: "FA-20423",
    concept: "Confirmación de reserva VVI → JFK", issuedAt: "2026-06-29", status: "issued",
    agentName: "Carlos Mendoza", createdAt: "2026-06-29T17:00:00Z",
  },
  {
    id: "d6", code: "CTR-1190", kind: "contract", customerName: "Laura Vargas", customerEmail: "laura.vargas@gmail.com",
    relatedCode: "FA-Q1042", concept: "Contrato de servicios turísticos (crucero)", amount: bob(23052), issuedAt: "2026-06-30", status: "issued",
    agentName: "Lucía Pérez", createdAt: "2026-06-30T13:30:00Z",
  },
  {
    id: "d7", code: "NC-0042", kind: "credit_note", customerName: "Carmen Justiniano", customerEmail: "carmen.justiniano@gmail.com",
    relatedCode: "FAC-10180", concept: "Nota de crédito por reembolso VVI → MCO", amount: bob(23100), issuedAt: "2026-05-02", status: "issued",
    agentName: "Ana Flores", createdAt: "2026-05-02T09:30:00Z",
  },
  {
    id: "d8", code: "FAC-10198", kind: "invoice", customerName: "Sofía Antelo", relatedCode: "FA-20411",
    concept: "Boleto VVI → CTG", amount: bob(8800), issuedAt: "2026-06-06", status: "issued",
    agentName: "Lucía Pérez", createdAt: "2026-06-06T10:00:00Z",
  },
];
