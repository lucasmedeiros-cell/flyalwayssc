import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases condicionales y resuelve conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Formatea minutos como "2 h 45 min". */
export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

/** Formatea un ISODateTime como "14:30". */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Formatea un ISODateTime como "1 jul 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
}

/** Formatea importe + moneda como "Bs 129,90" / "$129.90". */
export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Versión compacta: "S/ 1,3 mil M" → usa notación compacta ("1,28 M"). */
export function formatMoneyCompact(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

/** Número compacto: 23940 → "24 mil". */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** Entero con separadores de miles. */
export function formatInt(n: number): string {
  return new Intl.NumberFormat("es").format(Math.round(n));
}

/**
 * Tiempo relativo: "ahora", "hace 5 min", "hace 3 h", "hace 2 d" o fecha.
 * Solo para componentes cliente (usa la hora actual).
 */
export function formatRelative(iso: string): string {
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const h = Math.round(diffMin / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return `hace ${d} d`;
  return formatDate(iso);
}
