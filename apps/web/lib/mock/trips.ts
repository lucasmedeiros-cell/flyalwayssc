import type {
  Amenity,
  CurrencyCode,
  Segment,
  Trip,
  TransportMode,
  TravelClass,
  SearchQuery,
} from "@vialta/types";
import { CLASSES_BY_MODE } from "@vialta/types";
import { findPlace, placesForMode } from "./places";
import { operatorsForMode } from "./operators";

/* --- RNG determinista (mulberry32) para que SSR y cliente coincidan --- */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VEHICLES: Record<TransportMode, string[]> = {
  air: ["Airbus A320neo", "Boeing 737 MAX", "Embraer E190", "Airbus A321"],
  bus: ["Volvo 9800 DD", "Scania Irizar i8", "Mercedes Tourismo", "Marcopolo G8"],
  train: ["Talgo 250", "AndesRail Vistadome", "Serie 730", "Panorámico XL"],
  private: ["Mercedes Sprinter VIP", "Toyota Hiace Premium", "Van Ejecutiva 12p"],
};

const AMENITIES_POOL: Record<TransportMode, Amenity[]> = {
  air: ["wifi", "power", "usb", "ac", "meal", "entertainment", "restroom", "luggage_included"],
  bus: ["wifi", "power", "usb", "ac", "snack", "restroom", "reclining_seats", "wheelchair", "pets_allowed"],
  train: ["wifi", "power", "usb", "ac", "meal", "restroom", "reclining_seats", "wheelchair"],
  private: ["wifi", "power", "usb", "ac", "snack", "pets_allowed", "wheelchair", "luggage_included"],
};

/** Duración base aproximada por modo (min) — escala por “distancia” ficticia. */
const BASE_DURATION: Record<TransportMode, number> = {
  air: 95,
  bus: 480,
  train: 210,
  private: 300,
};

const CURRENCY: CurrencyCode = "BOB";

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function sample<T>(rng: () => number, arr: T[], min: number, max: number): T[] {
  const n = Math.floor(min + rng() * (max - min + 1));
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return out;
}

/** Genera una lista determinista de viajes para una consulta. */
export function generateTrips(query: SearchQuery): Trip[] {
  const mode = query.mode;
  const operators = operatorsForMode(mode);
  if (operators.length === 0) return [];

  const places = placesForMode(mode);
  const origin = (query.originId && findPlace(query.originId)) || places[0];
  const destination =
    (query.destinationId && findPlace(query.destinationId)) || places[places.length - 1];
  if (!origin || !destination) return [];

  const dateStr = query.departDate ?? "2026-07-01";
  const seed = hashString(`${mode}|${origin.id}|${destination.id}|${dateStr}`);
  const rng = mulberry32(seed);

  const allowedClasses = CLASSES_BY_MODE[mode];
  const count = 7 + Math.floor(rng() * 6); // 7..12 resultados
  const trips: Trip[] = [];

  for (let i = 0; i < count; i++) {
    const operator = pick(rng, operators);
    const stops = mode === "air" ? (rng() < 0.65 ? 0 : 1) : mode === "private" ? 0 : rng() < 0.5 ? 0 : 1;

    const departHour = 5 + Math.floor(rng() * 17); // 05..21
    const departMin = pick(rng, [0, 10, 15, 25, 30, 40, 45, 55]);
    const baseDur = Math.round(BASE_DURATION[mode] * (0.7 + rng() * 0.9));
    const layover = stops > 0 ? 40 + Math.floor(rng() * 70) : 0;
    const totalDur = baseDur + layover;

    const depart = new Date(`${dateStr}T00:00:00`);
    depart.setHours(departHour, departMin, 0, 0);
    const arrive = new Date(depart.getTime() + totalDur * 60000);

    const travelClass: TravelClass = pick(rng, allowedClasses);
    const classFactor =
      travelClass === "first" || travelClass === "vip" || travelClass === "sleeper"
        ? 2.4
        : travelClass === "business" || travelClass === "executive" || travelClass === "premium_economy"
          ? 1.6
          : 1;
    // Bases aproximadas en bolivianos (Bs) por modo.
    const modeBase = mode === "air" ? 700 : mode === "train" ? 320 : mode === "private" ? 380 : 110;
    const price = Math.round((modeBase * (0.8 + rng() * 1.1) * classFactor) / 5) * 5 + 0.9;

    const amenities = sample(rng, AMENITIES_POOL[mode], 3, AMENITIES_POOL[mode].length);
    const baggageIncluded = amenities.includes("luggage_included") || rng() < 0.4;
    const petsAllowed = amenities.includes("pets_allowed");
    const accessible = amenities.includes("wheelchair");

    const segments: Segment[] = buildSegments(rng, mode, origin, destination, depart, arrive, stops, places);

    trips.push({
      id: `${mode}-${origin.id}-${destination.id}-${dateStr}-${i}`,
      mode,
      operatorId: operator.id,
      segments,
      departAt: depart.toISOString(),
      arriveAt: arrive.toISOString(),
      totalDurationMin: totalDur,
      stops,
      travelClass,
      price: { amount: price, currency: CURRENCY },
      seatsAvailable: 1 + Math.floor(rng() * 40),
      amenities,
      baggageIncluded,
      petsAllowed,
      accessible,
      recommendedScore: Math.round(rng() * 1000) / 1000,
    });
  }

  // Un puntaje "recomendado" coherente: barato + rápido + buena disponibilidad.
  const maxPrice = Math.max(...trips.map((t) => t.price.amount));
  const maxDur = Math.max(...trips.map((t) => t.totalDurationMin));
  for (const t of trips) {
    const cheap = 1 - t.price.amount / maxPrice;
    const fast = 1 - t.totalDurationMin / maxDur;
    const direct = t.stops === 0 ? 0.25 : 0;
    t.recommendedScore = Math.round((cheap * 0.45 + fast * 0.3 + direct + 0.05) * 1000) / 1000;
  }

  return trips;
}

function buildSegments(
  rng: () => number,
  mode: TransportMode,
  origin: ReturnType<typeof findPlace> & object,
  destination: ReturnType<typeof findPlace> & object,
  depart: Date,
  arrive: Date,
  stops: number,
  places: ReturnType<typeof placesForMode>
): Segment[] {
  const vehicle = pick(rng, VEHICLES[mode]);
  if (stops === 0 || !origin || !destination) {
    return [
      {
        id: "seg-0",
        origin,
        destination,
        departAt: depart.toISOString(),
        arriveAt: arrive.toISOString(),
        durationMin: Math.round((arrive.getTime() - depart.getTime()) / 60000),
        serviceCode: serviceCode(rng, mode),
        vehicleName: vehicle,
      },
    ];
  }

  const intermediates = places.filter((p) => p.id !== origin.id && p.id !== destination.id);
  const via = intermediates.length ? pick(rng, intermediates) : origin;
  const mid = new Date((depart.getTime() + arrive.getTime()) / 2);
  const midArr = new Date(mid.getTime() - 35 * 60000);
  const midDep = new Date(mid.getTime() + 35 * 60000);

  return [
    {
      id: "seg-0",
      origin,
      destination: via,
      departAt: depart.toISOString(),
      arriveAt: midArr.toISOString(),
      durationMin: Math.round((midArr.getTime() - depart.getTime()) / 60000),
      serviceCode: serviceCode(rng, mode),
      vehicleName: vehicle,
    },
    {
      id: "seg-1",
      origin: via,
      destination,
      departAt: midDep.toISOString(),
      arriveAt: arrive.toISOString(),
      durationMin: Math.round((arrive.getTime() - midDep.getTime()) / 60000),
      serviceCode: serviceCode(rng, mode),
      vehicleName: vehicle,
    },
  ];
}

function serviceCode(rng: () => number, mode: TransportMode): string {
  const prefix = mode === "air" ? "VA" : mode === "bus" ? "BUS" : mode === "train" ? "TR" : "PV";
  return `${prefix}${100 + Math.floor(rng() * 899)}`;
}
