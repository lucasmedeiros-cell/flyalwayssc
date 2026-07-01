import type { ID, ISODate, ISODateTime, Money } from "./common";

/* ------------------------------------------------------------------ */
/* Cliente del CRM — entidad central del módulo de Clientes.           */
/* ------------------------------------------------------------------ */

export type CustomerStatus = "active" | "inactive" | "prospect" | "vip";

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
  prospect: "Prospecto",
  vip: "VIP",
};

export type CustomerDocumentType = "dni" | "passport" | "ce" | "other";

export const CUSTOMER_DOCUMENT_TYPE_LABEL: Record<CustomerDocumentType, string> = {
  dni: "Cédula de identidad",
  passport: "Pasaporte",
  ce: "Carnet de extranjería",
  other: "Otro",
};

/* ------------------------------ Archivos --------------------------- */

export type CustomerFileKind = "passport" | "visa" | "id" | "invoice" | "voucher" | "contract" | "other";

export const CUSTOMER_FILE_LABEL: Record<CustomerFileKind, string> = {
  passport: "Pasaporte",
  visa: "Visa",
  id: "Documento de identidad",
  invoice: "Factura",
  voucher: "Voucher",
  contract: "Contrato",
  other: "Otro",
};

export interface CustomerFile {
  id: ID;
  kind: CustomerFileKind;
  name: string;
  fileType: "pdf" | "image" | "other";
  url: string;
  sizeKb?: number;
  uploadedAt: ISODateTime;
  /** Vencimiento (pasaportes, visas). */
  expiresAt?: ISODate;
}

/* ----------------------------- Timeline ---------------------------- */

export type CustomerActivityKind = "call" | "message" | "email" | "quote" | "booking" | "payment" | "note";

export const CUSTOMER_ACTIVITY_LABEL: Record<CustomerActivityKind, string> = {
  call: "Llamada",
  message: "Mensaje",
  email: "Correo",
  quote: "Cotización",
  booking: "Reserva",
  payment: "Pago",
  note: "Nota interna",
};

export interface CustomerActivity {
  id: ID;
  kind: CustomerActivityKind;
  title: string;
  detail?: string;
  at: ISODateTime;
  agent: string;
  amount?: Money;
}

/* ------------------------------ Cliente ---------------------------- */

export interface Customer {
  id: ID;
  firstName: string;
  lastName: string;

  // Datos personales
  documentType: CustomerDocumentType;
  documentNumber: string;
  passportNumber?: string;
  passportExpiry?: ISODate;
  birthDate?: ISODate;
  nationality: string;
  phone?: string;
  whatsapp?: string;
  email: string;
  address?: string;
  city?: string;
  country: string;

  // Información comercial
  assignedAgentId: ID;
  assignedAgentName: string;
  status: CustomerStatus;
  tags: string[];
  notes?: string;
  totalSpent: Money;
  tripsCount: number;
  favoriteDestinations: string[];
  favoriteAirlines: string[];

  createdAt: ISODateTime;
  lastActivityAt?: ISODateTime;
}

/** Cliente con su documentación e historial completo (ficha 360°). */
export interface CustomerDetail extends Customer {
  files: CustomerFile[];
  activity: CustomerActivity[];
}

/** Iniciales del cliente ("Ana", "Pérez" → "AP"). */
export function customerInitials(c: Pick<Customer, "firstName" | "lastName">): string {
  return `${c.firstName[0] ?? ""}${c.lastName[0] ?? ""}`.toUpperCase();
}
