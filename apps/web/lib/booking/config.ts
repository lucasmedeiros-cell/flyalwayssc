import type { SeatMapLayout, Trip } from "@vialta/types";

export type PaymentMethod =
  | "card"
  | "paypal"
  | "mercadopago"
  | "transfer"
  | "qr"
  | "wallet";

export interface PassengerForm {
  firstName: string;
  lastName: string;
  documentType: "dni" | "passport" | "other";
  documentNumber: string;
  email: string;
  phone: string;
}

export interface PaymentForm {
  method: PaymentMethod;
  cardName: string;
  cardNumber: string;
  cardExp: string;
  cardCvc: string;
}

/** Estado completo del borrador de reserva que recorre el wizard. */
export interface BookingDraft {
  adults: number;
  children: number;
  seatIds: string[];
  passengers: PassengerForm[];
  /** Maletas facturadas adicionales por pasajero (índice = pasajero). */
  checkedBags: number[];
  /** Ids de servicios adicionales seleccionados. */
  extras: string[];
  payment: PaymentForm;
}

export const TAX_RATE = 0.18;
export const CHECKED_BAG_PRICE = 35;

export interface ExtraOption {
  id: string;
  label: string;
  description: string;
  price: number;
  /** Si el precio es por pasajero (true) o por reserva (false). */
  perPassenger: boolean;
}

export const EXTRA_OPTIONS: ExtraOption[] = [
  { id: "meal", label: "Menú a bordo", description: "Comida caliente y bebida", price: 25, perPassenger: true },
  { id: "insurance", label: "Seguro de viaje", description: "Cobertura ante imprevistos", price: 40, perPassenger: true },
  { id: "priority", label: "Embarque prioritario", description: "Sube primero, sin filas", price: 18, perPassenger: false },
  { id: "lounge", label: "Acceso a sala VIP", description: "Sala de espera premium", price: 60, perPassenger: false },
  { id: "flex", label: "Tarifa flexible", description: "Cambios de fecha sin costo", price: 35, perPassenger: false },
];

export function emptyPassenger(): PassengerForm {
  return { firstName: "", lastName: "", documentType: "dni", documentNumber: "", email: "", phone: "" };
}

export function initialDraft(): BookingDraft {
  return {
    adults: 1,
    children: 0,
    seatIds: [],
    passengers: [emptyPassenger()],
    checkedBags: [0],
    extras: [],
    payment: { method: "card", cardName: "", cardNumber: "", cardExp: "", cardCvc: "" },
  };
}

export function totalPassengers(d: BookingDraft): number {
  return d.adults + d.children;
}

/** Reajusta los arrays por pasajero al cambiar la cantidad. */
export function resizeForPassengers(d: BookingDraft): BookingDraft {
  const n = Math.max(1, totalPassengers(d));
  const passengers = [...d.passengers];
  const checkedBags = [...d.checkedBags];
  while (passengers.length < n) passengers.push(emptyPassenger());
  while (checkedBags.length < n) checkedBags.push(0);
  passengers.length = n;
  checkedBags.length = n;
  // Si sobran asientos seleccionados, recórtalos.
  const seatIds = d.seatIds.slice(0, n);
  return { ...d, passengers, checkedBags, seatIds };
}

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  currency: string;
  lines: QuoteLine[];
  subtotal: number;
  taxes: number;
  total: number;
}

/** Calcula el desglose de precio del borrador. */
export function computeQuote(trip: Trip, draft: BookingDraft, seatMap?: SeatMapLayout | null): Quote {
  const currency = trip.price.currency;
  const pax = totalPassengers(draft);
  const lines: QuoteLine[] = [];

  const fare = trip.price.amount * pax;
  lines.push({ label: `Tarifa base × ${pax}`, amount: fare });

  // Recargos por asiento
  let seatSurcharge = 0;
  if (seatMap) {
    const byId = new Map(seatMap.seats.map((s) => [s.id, s]));
    for (const id of draft.seatIds) {
      const s = byId.get(id);
      if (s?.surcharge) seatSurcharge += s.surcharge.amount;
    }
  }
  if (seatSurcharge > 0) lines.push({ label: "Asientos premium", amount: seatSurcharge });

  // Equipaje adicional
  const totalBags = draft.checkedBags.reduce((a, b) => a + b, 0);
  if (totalBags > 0) {
    lines.push({ label: `Equipaje facturado × ${totalBags}`, amount: totalBags * CHECKED_BAG_PRICE });
  }

  // Servicios adicionales
  for (const id of draft.extras) {
    const opt = EXTRA_OPTIONS.find((e) => e.id === id);
    if (!opt) continue;
    const amount = opt.perPassenger ? opt.price * pax : opt.price;
    lines.push({ label: opt.perPassenger ? `${opt.label} × ${pax}` : opt.label, amount });
  }

  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + taxes) * 100) / 100;

  return { currency, lines, subtotal, taxes, total };
}

/** Genera un código de reserva determinista a partir de un seed. */
export function bookingReference(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  const code = (Math.abs(h) % 1_000_000).toString(36).toUpperCase().padStart(4, "0");
  return `VL-${code}`;
}
