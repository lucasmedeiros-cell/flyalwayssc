import {
  ALL_DESTINATIONS,
  FLIGHT_INFO,
  scopeOfSlug,
  type Destination,
} from "@/lib/destinations";

/**
 * Detalle de un paquete de viaje (vuelo + experiencia). Se deriva del catálogo
 * de destinos y se enriquece con itinerario, lo que incluye y datos de vuelo,
 * de forma coherente con la duración y categoría de cada destino. Es contenido
 * mock consistente: sirve la vista /paquetes/[slug] sin backend.
 */
export type TravelPackageDetail = Destination & {
  scope: "national" | "international";
  /** Nº de días parseado de `duration` (mínimo 1). */
  days: number;
  airline: string;
  flightTime: string;
  /** Puntos fuertes cortos para la cabecera. */
  highlights: string[];
  /** Qué incluye el paquete. */
  included: string[];
  /** Itinerario día a día. */
  itinerary: { day: number; title: string; desc: string }[];
};

/** Extrae el nº de días de una cadena tipo "3 días • Todo incluido". */
function daysFromDuration(duration: string): number {
  const m = duration.match(/(\d+)\s*d[ií]a/i);
  return m ? Math.max(1, Number(m[1])) : 3;
}

/** Régimen de comidas según el texto de duración. */
function mealPlan(duration: string): string {
  const d = duration.toLowerCase();
  if (d.includes("all inclusive") || d.includes("todo incluido")) return "Todas las comidas (desayuno, almuerzo y cena)";
  if (d.includes("media pensión")) return "Desayuno y cena diarios";
  if (d.includes("cata")) return "Desayuno diario + cata de vinos guiada";
  return "Desayuno buffet diario";
}

function buildIncluded(dest: Destination, days: number, airline: string): string[] {
  const nights = Math.max(0, days - 1);
  return [
    `Vuelos ida y vuelta con ${airline}, clase Económica`,
    "Traslados aeropuerto ↔ hotel",
    nights > 0 ? `Alojamiento ${nights} noche${nights > 1 ? "s" : ""} en hotel seleccionado` : "Excursión de día completo",
    mealPlan(dest.duration),
    "Guía profesional en español",
    "Excursiones y actividades del itinerario",
    "Asistencia de viaje 24/7 y seguro básico",
    "Impuestos y tasas incluidos",
  ];
}

function buildHighlights(dest: Destination, airline: string, flightTime: string): string[] {
  return [
    dest.badge,
    `Experiencia de ${dest.category.toLowerCase()}`,
    `Vuelo ${flightTime} con ${airline}`,
    `Valoración ${dest.rating}.0 · viajeros verificados`,
  ];
}

function buildItinerary(dest: Destination, days: number): { day: number; title: string; desc: string }[] {
  if (days <= 1) {
    return [
      {
        day: 1,
        title: `Día completo en ${dest.name}`,
        desc: `${dest.tagline} Traslados, guía y actividades incluidas. Regreso el mismo día.`,
      },
    ];
  }
  const items: { day: number; title: string; desc: string }[] = [];
  items.push({
    day: 1,
    title: "Llegada y bienvenida",
    desc: `Vuelo a ${dest.region}. Recepción, traslado al hotel y primer contacto con ${dest.name}. ${dest.tagline}`,
  });
  for (let d = 2; d < days; d++) {
    items.push({
      day: d,
      title: `Exploración de ${dest.name}`,
      desc: `Jornada guiada por lo mejor del destino: ${dest.category.toLowerCase()}, gastronomía local y tiempo libre para descubrir a tu ritmo.`,
    });
  }
  items.push({
    day: days,
    title: "Regreso a casa",
    desc: "Mañana libre según horario de vuelo, traslado al aeropuerto y regreso con recuerdos para toda la vida.",
  });
  return items;
}

/** Construye el detalle completo de un destino. */
function toPackage(dest: Destination): TravelPackageDetail {
  const flight = FLIGHT_INFO[dest.name] ?? { airline: "Boliviana de Aviación", time: "≈ 1h" };
  const days = daysFromDuration(dest.duration);
  return {
    ...dest,
    scope: scopeOfSlug(dest.slug),
    days,
    airline: flight.airline,
    flightTime: flight.time,
    highlights: buildHighlights(dest, flight.airline, flight.time),
    included: buildIncluded(dest, days, flight.airline),
    itinerary: buildItinerary(dest, days),
  };
}

/** Todos los paquetes (uno por destino). */
export const ALL_PACKAGES: TravelPackageDetail[] = ALL_DESTINATIONS.map(toPackage);

const BY_SLUG = new Map(ALL_PACKAGES.map((p) => [p.slug, p]));

/** Devuelve el paquete por slug, o null si no existe. */
export function getPackage(slug: string): TravelPackageDetail | null {
  return BY_SLUG.get(slug) ?? null;
}

/** Slugs válidos (para generar rutas estáticas). */
export function allPackageSlugs(): string[] {
  return ALL_PACKAGES.map((p) => p.slug);
}
