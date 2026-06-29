/** Tipos base reutilizables en todo el dominio Vialta. */

export type ID = string;

export type ISODate = string; // "2026-06-27"
export type ISODateTime = string; // "2026-06-27T14:30:00Z"

export type CurrencyCode =
  | "BOB"
  | "USD"
  | "EUR"
  | "PEN"
  | "MXN"
  | "ARS"
  | "BRL"
  | "CLP"
  | "GBP";

export interface Money {
  amount: number; // en la unidad mayor (no centavos): 129.90
  currency: CurrencyCode;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Ciudad / terminal / aeropuerto / estación — punto de origen o destino. */
export interface Place {
  id: ID;
  /** Código corto: IATA para aeropuertos, o slug interno (LIM, CUZ, BCN-SANTS). */
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  /** Tipo de terminal según el modo. */
  kind: "airport" | "bus_terminal" | "train_station" | "private_hub" | "city";
  geo?: GeoPoint;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
