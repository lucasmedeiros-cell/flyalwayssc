/* Formateadores compartidos (locale es-BO). Espejo de apps/web/lib/utils.ts
   para que web y CRM rindan números/fechas/moneda idénticos. */

/**
 * Normaliza los espacios especiales que inserta Intl (U+00A0 no-break space,
 * U+202F narrow no-break space). Node y el navegador usan versiones de ICU
 * distintas y a veces eligen un carácter de espacio diferente — eso provoca
 * errores de hidratación SSR/cliente. Forzar un espacio normal lo elimina.
 */
function norm(s: string): string {
  return s.replace(/[  ]/g, " ");
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
  return norm(d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false }));
}

/** Formatea un ISODateTime como "1 jul 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return norm(d.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" }));
}

/** Formatea importe + moneda como "Bs 129,90" / "$129.90". */
export function formatMoney(amount: number, currency: string): string {
  try {
    return norm(
      new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(amount)
    );
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Versión compacta de moneda ("1,28 M"). */
export function formatMoneyCompact(amount: number, currency: string): string {
  try {
    return norm(
      new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(amount)
    );
  } catch {
    return `${currency} ${amount}`;
  }
}

/** Número compacto: 23940 → "24 mil". */
export function formatCompact(n: number): string {
  return norm(new Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(n));
}

/** Entero con separadores de miles. */
export function formatInt(n: number): string {
  return norm(new Intl.NumberFormat("es").format(Math.round(n)));
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

/** Iniciales a partir de un nombre completo ("Ana Pérez" → "AP"). */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
