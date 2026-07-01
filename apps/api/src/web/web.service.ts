import { Injectable } from "@nestjs/common";
import { TransportMode } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CatalogService } from "../catalog/catalog.service";
import { OperatorsService } from "../operators/operators.service";
import { ADMIN_DASHBOARD, OPERATOR_CONSOLE } from "./web.static";
import {
  generateTrips, generateSeatMap, applyFilters, sortTrips, computeFacets, parseTripId,
  type GenCtx, type SearchQuery, type SearchFilters, type SortKey, type Mode, type WebOperator,
} from "./web.generator";

const money = (amount: number, currency: string) => ({ amount, currency });

@Injectable()
export class WebService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogService,
    private readonly operators: OperatorsService,
  ) {}

  /** Contexto de generación (catálogo desde Postgres) para un modo. */
  private async ctx(mode: Mode): Promise<GenCtx> {
    const enumMode = mode.toUpperCase() as TransportMode;
    const [modePlaces, allPlaces, ops] = await Promise.all([
      this.catalog.listPlaces(enumMode),
      this.catalog.listPlaces(),
      this.operators.findAll(enumMode) as Promise<WebOperator[]>,
    ]);
    const byId = new Map(allPlaces.map((p) => [p.id, p]));
    return { places: modePlaces, findPlace: (id) => byId.get(id), operators: ops };
  }

  async search(body: { query: SearchQuery; filters?: SearchFilters; sort?: SortKey; page?: number; pageSize?: number }) {
    const ctx = await this.ctx(body.query.mode);
    const all = generateTrips(body.query, ctx);
    const filtered = applyFilters(all, body.filters);
    const sorted = sortTrips(filtered, body.sort ?? "recommended");
    const page = body.page ?? 1;
    const pageSize = body.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    return { items: sorted.slice(start, start + pageSize), total: sorted.length, page, pageSize };
  }

  async facets(query: SearchQuery) {
    const ctx = await this.ctx(query.mode);
    return computeFacets(generateTrips(query, ctx));
  }

  async getTrip(id: string) {
    const parsed = parseTripId(id);
    if (!parsed) return null;
    const ctx = await this.ctx(parsed.mode);
    const trips = generateTrips(
      { mode: parsed.mode, originId: parsed.originId, destinationId: parsed.destinationId, departDate: parsed.departDate },
      ctx,
    );
    return trips.find((t) => t.id === id) ?? null;
  }

  async getSeatMap(id: string) {
    const trip = await this.getTrip(id);
    if (!trip) return null;
    return generateSeatMap(id, trip.mode as Mode, trip.price.currency);
  }

  /* --------------------------------- Cuenta -------------------------------- */

  async getAccount() {
    const [account, bookings, invoices, methods, favorites] = await Promise.all([
      this.prisma.webAccount.findUnique({ where: { id: "me" } }),
      this.prisma.webBookingRecord.findMany({ orderBy: { sort: "asc" } }),
      this.prisma.webInvoice.findMany({ orderBy: { sort: "asc" } }),
      this.prisma.webPaymentMethod.findMany({ orderBy: { sort: "asc" } }),
      this.prisma.webFavoriteRoute.findMany({ orderBy: { sort: "asc" } }),
    ]);
    return {
      user: account
        ? { id: "user-maria", fullName: account.fullName, email: account.email, initials: account.initials, memberSince: account.memberSince, tier: account.tier, points: account.points }
        : null,
      bookings: bookings.map((b) => ({
        id: b.id, reference: b.reference, status: b.status, mode: b.mode,
        operatorName: b.operatorName, operatorMark: b.operatorMark, operatorColor: b.operatorColor,
        originCity: b.originCity, originCode: b.originCode, destinationCity: b.destinationCity, destinationCode: b.destinationCode,
        departAt: b.departAt, arriveAt: b.arriveAt, travelClass: b.travelClass, passengers: b.passengers,
        seats: b.seats, total: money(b.totalAmount, b.totalCurrency), favorite: b.favorite,
      })),
      invoices: invoices.map((v) => ({ id: v.id, number: v.number, bookingReference: v.bookingReference, date: v.date, amount: money(v.amount, v.currency), status: v.status })),
      paymentMethods: methods.map((m) => ({ id: m.id, kind: m.kind, label: m.label, last4: m.last4 ?? undefined, expiry: m.expiry ?? undefined, balance: m.balanceAmount != null ? money(m.balanceAmount, m.balanceCurrency ?? "BOB") : undefined, isDefault: m.isDefault })),
      favorites: favorites.map((f) => ({ id: f.id, mode: f.mode, originCity: f.originCity, originCode: f.originCode, destinationCity: f.destinationCity, destinationCode: f.destinationCode, fromPrice: money(f.fromPriceAmount, f.fromPriceCurrency) })),
    };
  }

  /* ----------------------------- Notificaciones ---------------------------- */

  async getNotifications() {
    const rows = await this.prisma.webNotification.findMany({ orderBy: { sort: "asc" } });
    return rows.map((n) => ({ id: n.id, title: n.title, body: n.body, channel: n.channel, category: n.category, createdAt: n.createdAt, read: n.read, href: n.href ?? undefined }));
  }

  async getNotificationPreferences() {
    const p = await this.prisma.webNotificationPreference.findUnique({ where: { id: "default" } });
    if (!p) return null;
    return { email: p.email, phone: p.phone, whatsapp: p.whatsapp, categories: p.categories };
  }

  /* ------------------------------- Seguimiento ----------------------------- */

  async getTripTracking(reference: string) {
    const t = await this.prisma.webTripTracking.findUnique({ where: { reference } });
    if (!t) return null;
    return {
      reference: t.reference, mode: t.mode, operatorName: t.operatorName, operatorMark: t.operatorMark, operatorColor: t.operatorColor,
      vehicleName: t.vehicleName, originCity: t.originCity, originCode: t.originCode, destinationCity: t.destinationCity, destinationCode: t.destinationCode,
      status: t.status, progressPct: t.progressPct, departAt: t.departAt, etaAt: t.etaAt,
      distanceTotalKm: t.distanceTotalKm, speedKmh: t.speedKmh, path: t.path, waypoints: t.waypoints,
    };
  }

  /* --------------------------- Paneles agregados --------------------------- */

  getAdminDashboard() {
    return ADMIN_DASHBOARD;
  }

  getOperatorConsole() {
    return OPERATOR_CONSOLE;
  }
}
