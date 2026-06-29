import { ID, ISODateTime, Money, Place } from "./common";
import { Amenity, TransportMode, TravelClass } from "./transport";

/** Un tramo continuo de viaje (sin trasbordo). Un viaje directo tiene 1 segmento. */
export interface Segment {
  id: ID;
  origin: Place;
  destination: Place;
  departAt: ISODateTime;
  arriveAt: ISODateTime;
  /** Duración en minutos. */
  durationMin: number;
  /** Identificador comercial: nº de vuelo, código de servicio, etc. */
  serviceCode: string;
  /** Modelo de vehículo: "Airbus A320", "Volvo 9800", "Talgo 250"... */
  vehicleName?: string;
}

/** Resultado individual del buscador: una oferta de viaje de un operador. */
export interface Trip {
  id: ID;
  mode: TransportMode;
  operatorId: ID;
  segments: Segment[];
  /** Hora de salida del primer segmento. */
  departAt: ISODateTime;
  /** Hora de llegada del último segmento. */
  arriveAt: ISODateTime;
  /** Duración total puerta a puerta, en minutos (incluye esperas). */
  totalDurationMin: number;
  /** Nº de escalas/paradas con trasbordo (= segments.length - 1). */
  stops: number;
  travelClass: TravelClass;
  price: Money;
  /** Asientos disponibles para venta. */
  seatsAvailable: number;
  amenities: Amenity[];
  baggageIncluded: boolean;
  petsAllowed: boolean;
  accessible: boolean;
  /** Puntaje 0..1 que alimenta el orden "Recomendados". */
  recommendedScore: number;
}
