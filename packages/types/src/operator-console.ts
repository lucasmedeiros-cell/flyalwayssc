import { ID, ISODate, ISODateTime, Money } from "./common";
import { TransportMode, TravelClass } from "./transport";

export type VehicleStatus = "active" | "maintenance" | "inactive";

export interface OperatorVehicle {
  id: ID;
  mode: TransportMode;
  /** Modelo: "Airbus A320neo", "Volvo 9800 DD". */
  name: string;
  /** Matrícula / registro / número de unidad. */
  registration: string;
  capacity: number;
  year: number;
  status: VehicleStatus;
}

export interface OperatorRoute {
  id: ID;
  mode: TransportMode;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  /** Frecuencia legible: "Diaria", "Lun, Mié, Vie". */
  frequency: string;
  durationMin: number;
  stops: number;
  active: boolean;
  /** Precio base por clase. */
  pricing: { travelClass: TravelClass; price: Money }[];
}

export type DepartureStatus = "scheduled" | "boarding" | "departed" | "cancelled";

export interface ScheduledDeparture {
  id: ID;
  mode: TransportMode;
  routeLabel: string; // "LIM → CUZ"
  vehicleName: string;
  departAt: ISODateTime;
  arriveAt: ISODateTime;
  travelClass: TravelClass;
  price: Money;
  seatsTotal: number;
  seatsSold: number;
  status: DepartureStatus;
}

export interface Promotion {
  id: ID;
  code: string;
  description: string;
  discountPct: number;
  validFrom: ISODate;
  validTo: ISODate;
  active: boolean;
  /** Veces usado / límite. */
  used: number;
  limit: number;
}

export type StaffRole = "pilot" | "driver" | "crew" | "host";

export interface StaffMember {
  id: ID;
  name: string;
  initials: string;
  role: StaffRole;
  mode: TransportMode;
  /** Licencia / brevete / certificación. */
  license: string;
  status: "available" | "on_trip" | "off";
  rating: number;
}

/** Bundle del panel de un operador. */
export interface OperatorConsole {
  company: {
    id: ID;
    name: string;
    logoMark: string;
    brandColor: string;
    modes: TransportMode[];
    rating: number;
    countryCode: string;
  };
  vehicles: OperatorVehicle[];
  routes: OperatorRoute[];
  departures: ScheduledDeparture[];
  promotions: Promotion[];
  staff: StaffMember[];
}

export const STAFF_ROLE_LABEL: Record<StaffRole, string> = {
  pilot: "Piloto",
  driver: "Conductor",
  crew: "Tripulación",
  host: "Anfitrión",
};
