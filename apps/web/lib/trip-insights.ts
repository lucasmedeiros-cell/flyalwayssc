import type { Trip } from "@vialta/types";
import { seededInt, seededFloat } from "./seed";

/** Etiquetas comparativas a nivel de lista de resultados. */
export type TripTag = "best" | "cheapest" | "fastest";

/**
 * Calcula, para una lista de viajes, qué etiquetas comparativas merece cada uno:
 * "best" (mayor recommendedScore), "cheapest" (menor precio), "fastest" (menor
 * duración). Un mismo viaje puede acumular varias.
 */
export function computeTripTags(trips: Trip[]): Record<string, TripTag[]> {
  const tags: Record<string, TripTag[]> = {};
  if (trips.length === 0) return tags;
  trips.forEach((t) => (tags[t.id] = []));

  const cheapest = trips.reduce((a, b) => (b.price.amount < a.price.amount ? b : a));
  const fastest = trips.reduce((a, b) => (b.totalDurationMin < a.totalDurationMin ? b : a));
  const best = trips.reduce((a, b) => (b.recommendedScore > a.recommendedScore ? b : a));

  tags[cheapest.id].push("cheapest");
  tags[fastest.id].push("fastest");
  tags[best.id].push("best");
  return tags;
}

/** Señales de conversión deterministas (no cambian entre SSR y cliente). */
export interface TripSignals {
  viewers: number;
  lastBookedMin: number;
  satisfaction: number;
  reviews: number;
  freeCancellation: boolean;
  bestseller: boolean;
}

export function tripSignals(trip: Trip): TripSignals {
  return {
    viewers: seededInt(`${trip.id}:viewers`, 8, 73),
    lastBookedMin: seededInt(`${trip.id}:booked`, 2, 28),
    satisfaction: seededInt(`${trip.id}:sat`, 88, 99),
    reviews: seededInt(`${trip.id}:rev`, 120, 4800),
    freeCancellation: seededFloat(`${trip.id}:cancel`) > 0.45,
    bestseller: trip.recommendedScore > 0.8,
  };
}

export const TRIP_TAG_META: Record<
  TripTag,
  { label: string; className: string }
> = {
  best: {
    label: "Recomendado",
    className: "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]",
  },
  cheapest: {
    label: "Más barato",
    className: "bg-success text-white",
  },
  fastest: {
    label: "Más rápido",
    className: "bg-accent text-accent-foreground",
  },
};
