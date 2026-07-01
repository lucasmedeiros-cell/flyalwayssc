import type { ID, ISODateTime, Money } from "./common";

/* ------------------------------------------------------------------ */
/* Proveedor — operadores, hoteles, aerolíneas, mayoristas, etc.       */
/* ------------------------------------------------------------------ */

export type ProviderType = "operator" | "hotel" | "airline" | "wholesaler" | "insurance" | "transport";

export const PROVIDER_TYPE_LABEL: Record<ProviderType, string> = {
  operator: "Operador",
  hotel: "Hotel",
  airline: "Aerolínea",
  wholesaler: "Mayorista",
  insurance: "Seguros",
  transport: "Transporte",
};

export type ProviderStatus = "active" | "inactive";

export const PROVIDER_STATUS_LABEL: Record<ProviderStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

export interface Provider {
  id: ID;
  name: string;
  type: ProviderType;
  contactName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country: string;
  rating: number;
  status: ProviderStatus;
  /** Saldo por pagar al proveedor. */
  balance?: Money;
  notes?: string;
  createdAt: ISODateTime;
}
