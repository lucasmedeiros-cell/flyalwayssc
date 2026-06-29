import { ID, ISODateTime } from "./common";
import { TransportMode } from "./transport";

export type TripTrackingStatus = "boarding" | "in_transit" | "delayed" | "arrived";

export const TRIP_TRACKING_LABEL: Record<TripTrackingStatus, string> = {
  boarding: "Embarcando",
  in_transit: "En ruta",
  delayed: "Con retraso",
  arrived: "Llegó a destino",
};

/** Punto de la geometría de la ruta, normalizado al viewBox del mapa (0..100). */
export interface RoutePoint {
  x: number;
  y: number;
}

/** Hito intermedio del recorrido (parada, escala, control). */
export interface TrackingWaypoint {
  id: ID;
  label: string;
  /** Posición a lo largo de la ruta (0..100). */
  atPct: number;
}

export interface TripTracking {
  reference: string;
  mode: TransportMode;
  operatorName: string;
  operatorMark: string;
  operatorColor: string;
  vehicleName: string;

  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;

  status: TripTrackingStatus;
  /** Progreso inicial del recorrido (0..100) al cargar la vista. */
  progressPct: number;

  departAt: ISODateTime;
  etaAt: ISODateTime;

  distanceTotalKm: number;
  speedKmh: number;

  /** Geometría de la ruta para dibujar en el mapa. */
  path: RoutePoint[];
  waypoints: TrackingWaypoint[];
}
