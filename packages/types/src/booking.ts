import { ID, ISODateTime, Money } from "./common";

/** Pasos del wizard de reserva. */
export type BookingStep =
  | "trip"
  | "seat"
  | "passenger"
  | "baggage"
  | "extras"
  | "payment"
  | "confirmation";

export const BOOKING_STEPS: { key: BookingStep; label: string }[] = [
  { key: "trip", label: "Viaje" },
  { key: "seat", label: "Asiento" },
  { key: "passenger", label: "Pasajero" },
  { key: "baggage", label: "Equipaje" },
  { key: "extras", label: "Servicios" },
  { key: "payment", label: "Pago" },
  { key: "confirmation", label: "Confirmación" },
];

export interface Passenger {
  id: ID;
  firstName: string;
  lastName: string;
  documentType: "dni" | "passport" | "other";
  documentNumber: string;
  email?: string;
  phone?: string;
}

export type SeatStatus = "available" | "occupied" | "selected" | "blocked";

export interface Seat {
  id: ID;
  /** Etiqueta visible: "12A", "B4". */
  label: string;
  row: number;
  col: string;
  status: SeatStatus;
  /** Recargo opcional por asiento premium. */
  surcharge?: Money;
}

/** Distribución del mapa de asientos de un viaje, para render visual. */
export interface SeatMapLayout {
  tripId: ID;
  /** Letras de columna en orden, p. ej. ["A","B","C","D","E","F"]. */
  columns: string[];
  /** Índices de columna tras los cuales se dibuja un pasillo. */
  aisleAfter: number[];
  rows: number;
  /** Etiqueta de la sección (p. ej. "Cabina", "Piso 1"). */
  deckLabel?: string;
  seats: Seat[];
}

export type BookingStatus =
  | "draft"
  | "pending_payment"
  | "confirmed"
  | "cancelled";

export interface Booking {
  id: ID;
  tripId: ID;
  status: BookingStatus;
  passengers: Passenger[];
  seatIds: ID[];
  total: Money;
  createdAt: ISODateTime;
}
