import type { ID, ISODate, ISODateTime, Money } from "./common";
import type { TravelClass } from "./transport";

/* ------------------------------------------------------------------ */
/* Pasaje (boleto) — núcleo del módulo de ventas.                      */
/* ------------------------------------------------------------------ */

export type TicketStatus =
  | "quote"
  | "reserved"
  | "confirmed"
  | "issued"
  | "cancelled"
  | "refunded"
  | "reissued";

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  quote: "Cotización",
  reserved: "Reservado",
  confirmed: "Confirmado",
  issued: "Emitido",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  reissued: "Reemitido",
};

export type TicketTripType = "one_way" | "round_trip" | "multi_city";

export const TICKET_TRIP_TYPE_LABEL: Record<TicketTripType, string> = {
  one_way: "Solo ida",
  round_trip: "Ida y vuelta",
  multi_city: "Multidestino",
};

export interface TicketSegment {
  id: ID;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departAt: ISODateTime;
  arriveAt: ISODateTime;
  travelClass: TravelClass;
}

export interface TicketExtras {
  baggage?: string;
  seat?: string;
  insurance: boolean;
  services: string[];
}

export interface Ticket {
  id: ID;
  code: string;
  customerId: ID;
  customerName: string;
  agentId: ID;
  agentName: string;

  airline: string;
  airlineCode: string;
  pnr?: string;
  gds?: string;
  ticketNumber?: string;

  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  tripType: TicketTripType;
  travelClass: TravelClass;
  travelDate: ISODate;
  passengerCount: number;

  // Finanzas
  fare: Money;
  taxes: Money;
  total: Money;
  commission: Money;
  profit: Money;
  providerId: ID;
  providerName: string;

  status: TicketStatus;
  createdAt: ISODateTime;
}

/** Pasaje con itinerario detallado y extras (ficha de venta). */
export interface TicketDetail extends Ticket {
  segments: TicketSegment[];
  extras: TicketExtras;
}

/** Transiciones de estado permitidas (para la barra de acciones). */
export const TICKET_NEXT_STATUS: Record<TicketStatus, TicketStatus[]> = {
  quote: ["reserved", "cancelled"],
  reserved: ["confirmed", "cancelled"],
  confirmed: ["issued", "cancelled"],
  issued: ["reissued", "refunded"],
  reissued: ["refunded"],
  cancelled: [],
  refunded: [],
};
