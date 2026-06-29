import { ID, ISODate, ISODateTime, Money } from "./common";
import { TransportMode, TravelClass } from "./transport";

export interface UserProfile {
  id: ID;
  fullName: string;
  email: string;
  /** Iniciales para el avatar generado. */
  initials: string;
  memberSince: ISODate;
  /** Nivel de fidelización. */
  tier: "Explorer" | "Silver" | "Gold" | "Platinum";
  points: number;
}

export type BookingRecordStatus = "upcoming" | "completed" | "cancelled";

/**
 * Reserva "aplanada" para el perfil: incluye un snapshot del viaje para no
 * tener que re-resolver el catálogo en cada vista.
 */
export interface BookingRecord {
  id: ID;
  reference: string;
  status: BookingRecordStatus;
  mode: TransportMode;
  operatorName: string;
  operatorMark: string;
  operatorColor: string;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departAt: ISODateTime;
  arriveAt: ISODateTime;
  travelClass: TravelClass;
  passengers: number;
  seats: string[];
  total: Money;
  favorite: boolean;
}

export type InvoiceStatus = "paid" | "pending" | "refunded";

export interface Invoice {
  id: ID;
  number: string;
  bookingReference: string;
  date: ISODate;
  amount: Money;
  status: InvoiceStatus;
}

export type PaymentMethodKind = "card" | "paypal" | "wallet";

export interface PaymentMethodInfo {
  id: ID;
  kind: PaymentMethodKind;
  /** "Visa", "Mastercard", "PayPal", "Wallet Vialta". */
  label: string;
  last4?: string;
  expiry?: string;
  /** Saldo, sólo para wallet. */
  balance?: Money;
  isDefault: boolean;
}

export interface FavoriteRoute {
  id: ID;
  mode: TransportMode;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  fromPrice: Money;
}

/** Paquete completo de la cuenta del usuario para el perfil. */
export interface Account {
  user: UserProfile;
  bookings: BookingRecord[];
  invoices: Invoice[];
  paymentMethods: PaymentMethodInfo[];
  favorites: FavoriteRoute[];
}
