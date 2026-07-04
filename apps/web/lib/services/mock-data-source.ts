import type {
  Account,
  AdminDashboard,
  Amenity,
  AppNotification,
  CurrencyCode,
  NotificationPreferences,
  Operator,
  OperatorConsole,
  Paginated,
  Place,
  PromoProduct,
  SearchFacets,
  SearchFilters,
  SearchQuery,
  SeatMapLayout,
  SortKey,
  TransportMode,
  TravelClass,
  Trip,
  TripTracking,
} from "@vialta/types";
import type { DataSource } from "./data-source";
import { placesForMode } from "../mock/places";
import { operatorsForMode, OPERATORS } from "../mock/operators";
import { generateTrips } from "../mock/trips";
import { generateSeatMap } from "../mock/seatmap";
import { ACCOUNT } from "../mock/profile";
import { OPERATOR_CONSOLE } from "../mock/operator-console";
import { ADMIN_DASHBOARD } from "../mock/admin";
import { findTracking } from "../mock/tracking";
import { NOTIFICATIONS, NOTIFICATION_PREFERENCES } from "../mock/notifications";

/** Minutos desde medianoche de un ISODateTime (hora local). */
function minutesOfDay(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function applyFilters(trips: Trip[], f?: SearchFilters): Trip[] {
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
    if (f.departWindow) {
      const m = minutesOfDay(t.departAt);
      if (m < f.departWindow[0] || m > f.departWindow[1]) return false;
    }
    return true;
  });
}

function sortTrips(trips: Trip[], sort: SortKey): Trip[] {
  const arr = [...trips];
  switch (sort) {
    case "price":
      return arr.sort((a, b) => a.price.amount - b.price.amount);
    case "duration":
      return arr.sort((a, b) => a.totalDurationMin - b.totalDurationMin);
    case "depart_time":
      return arr.sort((a, b) => minutesOfDay(a.departAt) - minutesOfDay(b.departAt));
    case "arrive_time":
      return arr.sort((a, b) => minutesOfDay(a.arriveAt) - minutesOfDay(b.arriveAt));
    case "recommended":
    default:
      return arr.sort((a, b) => b.recommendedScore - a.recommendedScore);
  }
}

/** Adaptador en memoria. Simula latencia leve para microanimaciones de carga. */
export class MockDataSource implements DataSource {
  private readonly latency: number;
  constructor(latency = 0) {
    this.latency = latency;
  }

  private async delay() {
    if (this.latency > 0) await new Promise((r) => setTimeout(r, this.latency));
  }

  async listPlaces(mode: TransportMode, query?: string): Promise<Place[]> {
    await this.delay();
    const all = placesForMode(mode);
    if (!query) return all;
    const q = query.trim().toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
    );
  }

  async listOperators(mode?: TransportMode): Promise<Operator[]> {
    await this.delay();
    return mode ? operatorsForMode(mode) : OPERATORS;
  }

  async searchTrips(
    query: SearchQuery,
    opts?: { filters?: SearchFilters; sort?: SortKey; page?: number; pageSize?: number }
  ): Promise<Paginated<Trip>> {
    await this.delay();
    const all = generateTrips(query);
    const filtered = applyFilters(all, opts?.filters);
    const sorted = sortTrips(filtered, opts?.sort ?? "recommended");

    const page = opts?.page ?? 1;
    const pageSize = opts?.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    return {
      items: sorted.slice(start, start + pageSize),
      total: sorted.length,
      page,
      pageSize,
    };
  }

  async searchFacets(query: SearchQuery): Promise<SearchFacets> {
    await this.delay();
    const trips = generateTrips(query);
    if (trips.length === 0) {
      return {
        total: 0,
        priceMin: 0,
        priceMax: 0,
        durationMin: 0,
        durationMax: 0,
        maxStops: 0,
        operators: [],
        amenities: [],
        classes: [],
        baggageAvailable: false,
        petsAvailable: false,
        accessibleAvailable: false,
      };
    }

    const prices = trips.map((t) => t.price.amount);
    const durations = trips.map((t) => t.totalDurationMin);

    const opMap = new Map<string, { count: number; fromPrice: number }>();
    for (const t of trips) {
      const prev = opMap.get(t.operatorId);
      if (prev) {
        prev.count += 1;
        prev.fromPrice = Math.min(prev.fromPrice, t.price.amount);
      } else {
        opMap.set(t.operatorId, { count: 1, fromPrice: t.price.amount });
      }
    }

    const amenities = new Set<Amenity>();
    const classes = new Set<TravelClass>();
    for (const t of trips) {
      t.amenities.forEach((a) => amenities.add(a));
      classes.add(t.travelClass);
    }

    return {
      total: trips.length,
      priceMin: Math.floor(Math.min(...prices)),
      priceMax: Math.ceil(Math.max(...prices)),
      durationMin: Math.min(...durations),
      durationMax: Math.max(...durations),
      maxStops: Math.max(...trips.map((t) => t.stops)),
      operators: Array.from(opMap.entries())
        .map(([operatorId, v]) => ({ operatorId, count: v.count, fromPrice: v.fromPrice }))
        .sort((a, b) => a.fromPrice - b.fromPrice),
      amenities: Array.from(amenities),
      classes: Array.from(classes),
      baggageAvailable: trips.some((t) => t.baggageIncluded),
      petsAvailable: trips.some((t) => t.petsAllowed),
      accessibleAvailable: trips.some((t) => t.accessible),
    };
  }

  async getTrip(id: string): Promise<Trip | null> {
    await this.delay();
    // El id codifica la consulta: mode-origin-destination-date-index
    const parts = id.split("-");
    if (parts.length < 5) return null;
    const mode = parts[0] as TransportMode;
    const originId = parts[1];
    const destinationId = parts[2];
    // La fecha puede contener guiones (YYYY-MM-DD): reconstruirla.
    const dateStr = parts.slice(3, parts.length - 1).join("-");
    const trips = generateTrips({
      mode,
      originId,
      destinationId,
      departDate: dateStr,
      tripKind: "one_way",
      passengers: { adults: 1, children: 0, infants: 0 },
    });
    return trips.find((t) => t.id === id) ?? null;
  }

  async getSeatMap(tripId: string): Promise<SeatMapLayout | null> {
    await this.delay();
    const trip = await this.getTrip(tripId);
    if (!trip) return null;
    return generateSeatMap(tripId, trip.mode, trip.price.currency as CurrencyCode);
  }

  async getAccount(): Promise<Account> {
    await this.delay();
    return ACCOUNT;
  }

  async getOperatorConsole(): Promise<OperatorConsole> {
    await this.delay();
    return OPERATOR_CONSOLE;
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    await this.delay();
    return ADMIN_DASHBOARD;
  }

  async getTripTracking(reference: string): Promise<TripTracking | null> {
    await this.delay();
    return findTracking(reference);
  }

  async getNotifications(): Promise<AppNotification[]> {
    await this.delay();
    return NOTIFICATIONS;
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    await this.delay();
    return NOTIFICATION_PREFERENCES;
  }

  async getPromo(): Promise<PromoProduct | null> {
    await this.delay();
    return MOCK_PROMO.active ? MOCK_PROMO : null;
  }
}

/** Promoción de demostración (modo mock). */
const MOCK_PROMO: PromoProduct = {
  active: true,
  eyebrow: "Producto destacado",
  title: "Salar de Uyuni — Expedición Premium",
  subtitle: "3 días · 2 noches en el desierto de sal más grande del mundo, con guía certificado y hotel de sal.",
  productName: "Expedición Salar de Uyuni 3D/2N",
  description:
    "La aventura definitiva por el altiplano boliviano: amaneceres imposibles sobre el espejo de sal, lagunas de colores, geiseres y cielos estrellados. Todo incluido, en grupos reducidos y con los mejores guías del país.",
  badge: "Edición limitada",
  price: { amount: 2200, currency: "BOB" },
  originalPrice: { amount: 3100, currency: "BOB" },
  ctaLabel: "Reservar ahora",
  ctaHref: "/buscar?mode=air&destinationId=uyu",
  imageUrl: "/images/experiences/tours.jpg",
  accentColor: "#e0a106",
  highlights: [
    { icon: "Sparkles", title: "Amanecer en el salar", text: "El espejo de sal al alba, una experiencia irrepetible." },
    { icon: "ShieldCheck", title: "Guía certificado", text: "Expertos locales y grupos reducidos (máx. 8 personas)." },
    { icon: "BedDouble", title: "Hotel de sal", text: "Dos noches en alojamiento construido íntegramente en sal." },
    { icon: "Utensils", title: "Todo incluido", text: "Traslados 4x4, comidas y entradas a reservas naturales." },
  ],
  stats: [
    { label: "Valoración", value: "4.9 ★" },
    { label: "Viajeros", value: "+2.300" },
    { label: "Duración", value: "3 días" },
    { label: "Ahorro", value: "-29%" },
  ],
  validUntil: "2026-08-15T23:59:59",
};
