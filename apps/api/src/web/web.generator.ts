/**
 * Generador determinista de viajes y asientos (portado del mock del frontend).
 * Produce la MISMA forma JSON que consume la web (`Trip`, `SeatMapLayout`), sin
 * acoplar el paquete de tipos del frontend en runtime. La aleatoriedad es
 * reproducible (mulberry32 con semilla por consulta) para que resultados,
 * paginación y mapa de asientos sean estables.
 */

export type Mode = "air" | "bus" | "train" | "private";

export interface WebPlace {
  id: string; code: string; name: string; city: string; country: string;
  countryCode: string; kind: string; geo?: { lat: number; lng: number };
}
export interface WebOperator {
  id: string; name: string; slug: string; modes: string[]; logoMark: string;
  brandColor: string; rating: number; reviewsCount: number; countryCode: string;
}
export interface SearchQuery {
  mode: Mode; originId?: string; destinationId?: string; departDate?: string;
  returnDate?: string; tripKind?: string; passengers?: unknown;
}
export interface SearchFilters {
  operatorIds?: string[]; priceMin?: number; priceMax?: number; maxDurationMin?: number;
  maxStops?: number; classes?: string[]; baggageIncluded?: boolean; petsAllowed?: boolean;
  accessible?: boolean; amenities?: string[]; departWindow?: [number, number];
}
export type SortKey = "recommended" | "price" | "duration" | "depart_time" | "arrive_time";

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CLASSES_BY_MODE: Record<Mode, string[]> = {
  air: ["economy", "premium_economy", "business", "first"],
  bus: ["standard", "executive", "vip"],
  train: ["standard", "business", "first", "sleeper"],
  private: ["standard", "executive", "vip"],
};
const VEHICLES: Record<Mode, string[]> = {
  air: ["Airbus A320neo", "Boeing 737 MAX", "Embraer E190", "Airbus A321"],
  bus: ["Volvo 9800 DD", "Scania Irizar i8", "Mercedes Tourismo", "Marcopolo G8"],
  train: ["Wara Wara del Sur", "Expreso del Sur", "Serie 730", "Panorámico XL"],
  private: ["Mercedes Sprinter VIP", "Toyota Hiace Premium", "Van Ejecutiva 12p"],
};
const AMENITIES_POOL: Record<Mode, string[]> = {
  air: ["wifi", "power", "usb", "ac", "meal", "entertainment", "restroom", "luggage_included"],
  bus: ["wifi", "power", "usb", "ac", "snack", "restroom", "reclining_seats", "wheelchair", "pets_allowed"],
  train: ["wifi", "power", "usb", "ac", "meal", "restroom", "reclining_seats", "wheelchair"],
  private: ["wifi", "power", "usb", "ac", "snack", "pets_allowed", "wheelchair", "luggage_included"],
};
const BASE_DURATION: Record<Mode, number> = { air: 95, bus: 480, train: 210, private: 300 };
const CURRENCY = "BOB";

function pick<T>(rng: () => number, arr: T[]): T { return arr[Math.floor(rng() * arr.length)]; }
function sample<T>(rng: () => number, arr: T[], min: number, max: number): T[] {
  const n = Math.floor(min + rng() * (max - min + 1));
  const copy = [...arr]; const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  return out;
}

export interface GenCtx {
  places: WebPlace[];               // lugares del modo (p.ej. aeropuertos)
  findPlace: (id: string) => WebPlace | undefined; // sobre TODOS los lugares
  operators: WebOperator[];         // operadores del modo
}

function serviceCode(rng: () => number, mode: Mode): string {
  const prefix = mode === "air" ? "VA" : mode === "bus" ? "BUS" : mode === "train" ? "TR" : "PV";
  return `${prefix}${100 + Math.floor(rng() * 899)}`;
}

function buildSegments(rng: () => number, mode: Mode, origin: WebPlace, destination: WebPlace, depart: Date, arrive: Date, stops: number, places: WebPlace[]) {
  const vehicle = pick(rng, VEHICLES[mode]);
  if (stops === 0) {
    return [{
      id: "seg-0", origin, destination,
      departAt: depart.toISOString(), arriveAt: arrive.toISOString(),
      durationMin: Math.round((arrive.getTime() - depart.getTime()) / 60000),
      serviceCode: serviceCode(rng, mode), vehicleName: vehicle,
    }];
  }
  const intermediates = places.filter((p) => p.id !== origin.id && p.id !== destination.id);
  const via = intermediates.length ? pick(rng, intermediates) : origin;
  const mid = new Date((depart.getTime() + arrive.getTime()) / 2);
  const midArr = new Date(mid.getTime() - 35 * 60000);
  const midDep = new Date(mid.getTime() + 35 * 60000);
  return [
    { id: "seg-0", origin, destination: via, departAt: depart.toISOString(), arriveAt: midArr.toISOString(), durationMin: Math.round((midArr.getTime() - depart.getTime()) / 60000), serviceCode: serviceCode(rng, mode), vehicleName: vehicle },
    { id: "seg-1", origin: via, destination, departAt: midDep.toISOString(), arriveAt: arrive.toISOString(), durationMin: Math.round((arrive.getTime() - midDep.getTime()) / 60000), serviceCode: serviceCode(rng, mode), vehicleName: vehicle },
  ];
}

export function generateTrips(query: SearchQuery, ctx: GenCtx): any[] {
  const mode = query.mode;
  const operators = ctx.operators;
  if (operators.length === 0) return [];
  const places = ctx.places;
  const origin = (query.originId && ctx.findPlace(query.originId)) || places[0];
  const destination = (query.destinationId && ctx.findPlace(query.destinationId)) || places[places.length - 1];
  if (!origin || !destination) return [];

  const dateStr = query.departDate ?? "2026-07-01";
  const rng = mulberry32(hashString(`${mode}|${origin.id}|${destination.id}|${dateStr}`));
  const allowedClasses = CLASSES_BY_MODE[mode];
  const count = 7 + Math.floor(rng() * 6);
  const trips: any[] = [];

  for (let i = 0; i < count; i++) {
    const operator = pick(rng, operators);
    const stops = mode === "air" ? (rng() < 0.65 ? 0 : 1) : mode === "private" ? 0 : rng() < 0.5 ? 0 : 1;
    const departHour = 5 + Math.floor(rng() * 17);
    const departMin = pick(rng, [0, 10, 15, 25, 30, 40, 45, 55]);
    const baseDur = Math.round(BASE_DURATION[mode] * (0.7 + rng() * 0.9));
    const layover = stops > 0 ? 40 + Math.floor(rng() * 70) : 0;
    const totalDur = baseDur + layover;
    const depart = new Date(`${dateStr}T00:00:00`);
    depart.setHours(departHour, departMin, 0, 0);
    const arrive = new Date(depart.getTime() + totalDur * 60000);
    const travelClass = pick(rng, allowedClasses);
    const classFactor = ["first", "vip", "sleeper"].includes(travelClass) ? 2.4
      : ["business", "executive", "premium_economy"].includes(travelClass) ? 1.6 : 1;
    const modeBase = mode === "air" ? 700 : mode === "train" ? 320 : mode === "private" ? 380 : 110;
    const price = Math.round((modeBase * (0.8 + rng() * 1.1) * classFactor) / 5) * 5 + 0.9;
    const amenities = sample(rng, AMENITIES_POOL[mode], 3, AMENITIES_POOL[mode].length);
    const baggageIncluded = amenities.includes("luggage_included") || rng() < 0.4;
    const petsAllowed = amenities.includes("pets_allowed");
    const accessible = amenities.includes("wheelchair");
    const segments = buildSegments(rng, mode, origin, destination, depart, arrive, stops, places);
    trips.push({
      id: `${mode}-${origin.id}-${destination.id}-${dateStr}-${i}`,
      mode, operatorId: operator.id, segments,
      departAt: depart.toISOString(), arriveAt: arrive.toISOString(),
      totalDurationMin: totalDur, stops, travelClass,
      price: { amount: price, currency: CURRENCY },
      seatsAvailable: 1 + Math.floor(rng() * 40),
      amenities, baggageIncluded, petsAllowed, accessible, recommendedScore: 0,
    });
  }

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

function minutesOfDay(iso: string): number { const d = new Date(iso); return d.getHours() * 60 + d.getMinutes(); }

export function applyFilters(trips: any[], f?: SearchFilters): any[] {
  if (!f) return trips;
  return trips.filter((t) => {
    if (f.operatorIds?.length && !f.operatorIds.includes(t.operatorId)) return false;
    if (f.priceMin != null && t.price.amount < f.priceMin) return false;
    if (f.priceMax != null && t.price.amount > f.priceMax) return false;
    if (f.maxDurationMin != null && t.totalDurationMin > f.maxDurationMin) return false;
    if (f.maxStops != null && t.stops > f.maxStops) return false;
    if (f.classes?.length && !f.classes.includes(t.travelClass)) return false;
    if (f.baggageIncluded && !t.baggageIncluded) return false;
    if (f.petsAllowed && !t.petsAllowed) return false;
    if (f.accessible && !t.accessible) return false;
    if (f.amenities?.length && !f.amenities.every((a) => t.amenities.includes(a))) return false;
    if (f.departWindow) { const m = minutesOfDay(t.departAt); if (m < f.departWindow[0] || m > f.departWindow[1]) return false; }
    return true;
  });
}

export function sortTrips(trips: any[], sort: SortKey): any[] {
  const arr = [...trips];
  switch (sort) {
    case "price": return arr.sort((a, b) => a.price.amount - b.price.amount);
    case "duration": return arr.sort((a, b) => a.totalDurationMin - b.totalDurationMin);
    case "depart_time": return arr.sort((a, b) => minutesOfDay(a.departAt) - minutesOfDay(b.departAt));
    case "arrive_time": return arr.sort((a, b) => minutesOfDay(a.arriveAt) - minutesOfDay(b.arriveAt));
    default: return arr.sort((a, b) => b.recommendedScore - a.recommendedScore);
  }
}

export function computeFacets(trips: any[]) {
  if (trips.length === 0) {
    return { total: 0, priceMin: 0, priceMax: 0, durationMin: 0, durationMax: 0, maxStops: 0, operators: [], amenities: [], classes: [], baggageAvailable: false, petsAvailable: false, accessibleAvailable: false };
  }
  const prices = trips.map((t) => t.price.amount);
  const durations = trips.map((t) => t.totalDurationMin);
  const opMap = new Map<string, { count: number; fromPrice: number }>();
  for (const t of trips) {
    const prev = opMap.get(t.operatorId);
    if (prev) { prev.count += 1; prev.fromPrice = Math.min(prev.fromPrice, t.price.amount); }
    else opMap.set(t.operatorId, { count: 1, fromPrice: t.price.amount });
  }
  const amenities = new Set<string>(); const classes = new Set<string>();
  for (const t of trips) { t.amenities.forEach((a: string) => amenities.add(a)); classes.add(t.travelClass); }
  return {
    total: trips.length,
    priceMin: Math.floor(Math.min(...prices)), priceMax: Math.ceil(Math.max(...prices)),
    durationMin: Math.min(...durations), durationMax: Math.max(...durations),
    maxStops: Math.max(...trips.map((t) => t.stops)),
    operators: Array.from(opMap.entries()).map(([operatorId, v]) => ({ operatorId, count: v.count, fromPrice: v.fromPrice })).sort((a, b) => a.fromPrice - b.fromPrice),
    amenities: Array.from(amenities), classes: Array.from(classes),
    baggageAvailable: trips.some((t) => t.baggageIncluded),
    petsAvailable: trips.some((t) => t.petsAllowed),
    accessibleAvailable: trips.some((t) => t.accessible),
  };
}

const LAYOUTS: Record<Mode, { columns: string[]; aisleAfter: number[]; rows: number; deckLabel: string; premiumRows: number; premiumSurcharge: number }> = {
  air: { columns: ["A", "B", "C", "D", "E", "F"], aisleAfter: [2], rows: 26, deckLabel: "Cabina", premiumRows: 3, premiumSurcharge: 30 },
  bus: { columns: ["A", "B", "C", "D"], aisleAfter: [1], rows: 13, deckLabel: "Salón principal", premiumRows: 2, premiumSurcharge: 20 },
  train: { columns: ["A", "B", "C", "D"], aisleAfter: [1], rows: 16, deckLabel: "Vagón", premiumRows: 2, premiumSurcharge: 18 },
  private: { columns: ["A", "B", "C"], aisleAfter: [0], rows: 4, deckLabel: "Van", premiumRows: 0, premiumSurcharge: 0 },
};

export function generateSeatMap(tripId: string, mode: Mode, currency = CURRENCY): any {
  const layout = LAYOUTS[mode];
  const rng = mulberry32(hashString(`seats|${tripId}`));
  const seats: any[] = [];
  for (let row = 1; row <= layout.rows; row++) {
    for (const col of layout.columns) {
      const isPremium = row <= layout.premiumRows;
      const occupied = rng() < 0.33;
      const seat: any = { id: `${tripId}-${row}${col}`, label: `${row}${col}`, row, col, status: occupied ? "occupied" : "available" };
      if (isPremium && layout.premiumSurcharge > 0) seat.surcharge = { amount: layout.premiumSurcharge, currency };
      seats.push(seat);
    }
  }
  return { tripId, columns: layout.columns, aisleAfter: layout.aisleAfter, rows: layout.rows, deckLabel: layout.deckLabel, seats };
}

/** Decodifica el id de viaje (mode-origin-destination-YYYY-MM-DD-index). */
export function parseTripId(id: string): { mode: Mode; originId: string; destinationId: string; departDate: string } | null {
  const parts = id.split("-");
  if (parts.length < 5) return null;
  const mode = parts[0] as Mode;
  const originId = parts[1];
  const destinationId = parts[2];
  const departDate = parts.slice(3, parts.length - 1).join("-");
  return { mode, originId, destinationId, departDate };
}
