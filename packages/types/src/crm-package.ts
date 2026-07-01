import type { ID, ISODateTime, Money } from "./common";

/* ------------------------------------------------------------------ */
/* Paquete turístico — tours, hoteles, cruceros, traslados, etc.       */
/* ------------------------------------------------------------------ */

export type PackageType = "tour" | "hotel" | "excursion" | "cruise" | "transfer" | "insurance" | "vehicle";

export const PACKAGE_TYPE_LABEL: Record<PackageType, string> = {
  tour: "Tour",
  hotel: "Hotel",
  excursion: "Excursión",
  cruise: "Crucero",
  transfer: "Traslado",
  insurance: "Seguro",
  vehicle: "Vehículo",
};

export type PackageStatus = "active" | "draft" | "inactive";

export const PACKAGE_STATUS_LABEL: Record<PackageStatus, string> = {
  active: "Activo",
  draft: "Borrador",
  inactive: "Inactivo",
};

export interface TravelPackage {
  id: ID;
  code: string;
  name: string;
  type: PackageType;
  destination: string;
  durationDays: number;
  price: Money;
  providerName: string;
  includes: string[];
  status: PackageStatus;
  soldCount: number;
  description?: string;
  createdAt: ISODateTime;
}
