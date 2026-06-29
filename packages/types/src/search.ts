import { ISODate } from "./common";
import { Amenity, TransportMode, TravelClass } from "./transport";

export type TripKind = "round_trip" | "one_way";

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

/** Consulta del buscador inteligente. Campos opcionales = sin filtrar. */
export interface SearchQuery {
  mode: TransportMode;
  originId?: string;
  destinationId?: string;
  departDate?: ISODate;
  returnDate?: ISODate;
  tripKind: TripKind;
  passengers: PassengerCount;
  travelClass?: TravelClass;
}

/** Filtros aplicados sobre los resultados (panel lateral). */
export interface SearchFilters {
  operatorIds?: string[];
  priceMin?: number;
  priceMax?: number;
  /** Rango de hora de salida en minutos desde medianoche [0..1440]. */
  departWindow?: [number, number];
  /** Duración máxima del viaje en minutos. */
  maxDurationMin?: number;
  /** Número máximo de escalas/paradas (0 = directo). */
  maxStops?: number;
  classes?: TravelClass[];
  amenities?: Amenity[];
  baggageIncluded?: boolean;
  petsAllowed?: boolean;
  accessible?: boolean;
}

export type SortKey =
  | "recommended"
  | "price"
  | "duration"
  | "depart_time"
  | "arrive_time";

export const SORT_LABEL: Record<SortKey, string> = {
  recommended: "Recomendados",
  price: "Precio",
  duration: "Duración",
  depart_time: "Hora de salida",
  arrive_time: "Hora de llegada",
};

export function emptyPassengers(): PassengerCount {
  return { adults: 1, children: 0, infants: 0 };
}

export function totalPassengers(p: PassengerCount): number {
  return p.adults + p.children + p.infants;
}
