import type {
  Operator, Place, TransportMode, Paginated, Trip, SearchQuery, SearchFilters, SortKey,
  SearchFacets, SeatMapLayout, Account, OperatorConsole, AdminDashboard, TripTracking,
  AppNotification, NotificationPreferences,
} from "@vialta/types";
import { MockDataSource } from "./mock-data-source";

/**
 * Adaptador HTTP de la web. Extiende el mock e implementa contra el API NestJS
 * (Postgres en bilbo) los métodos que ya tienen respaldo en la base — hoy el
 * catálogo (lugares y operadores). El resto se hereda del mock mientras se
 * construye su backend, de modo que migrar es incremental y NO rompe la UI.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class HttpDataSource extends MockDataSource {
  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`web API ${path} → ${res.status}`);
    return (await res.json()) as T;
  }

  private async getOrNull<T>(path: string): Promise<T | null> {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`web API ${path} → ${res.status}`);
    return (await res.json()) as T;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`web API ${path} → ${res.status}`);
    return (await res.json()) as T;
  }

  async listPlaces(mode: TransportMode, query?: string): Promise<Place[]> {
    const qs = new URLSearchParams({ mode: mode.toUpperCase() });
    if (query?.trim()) qs.set("q", query.trim());
    return this.get<Place[]>(`/catalog/places?${qs.toString()}`);
  }

  async listOperators(mode?: TransportMode): Promise<Operator[]> {
    const qs = mode ? `?mode=${mode.toUpperCase()}` : "";
    return this.get<Operator[]>(`/operators${qs}`);
  }

  async searchTrips(
    query: SearchQuery,
    opts?: { filters?: SearchFilters; sort?: SortKey; page?: number; pageSize?: number },
  ): Promise<Paginated<Trip>> {
    return this.post<Paginated<Trip>>("/web/search", {
      query, filters: opts?.filters, sort: opts?.sort, page: opts?.page, pageSize: opts?.pageSize,
    });
  }

  async searchFacets(query: SearchQuery): Promise<SearchFacets> {
    return this.post<SearchFacets>("/web/facets", { query });
  }

  async getTrip(id: string): Promise<Trip | null> {
    return this.getOrNull<Trip>(`/web/trips/${encodeURIComponent(id)}`);
  }

  async getSeatMap(tripId: string): Promise<SeatMapLayout | null> {
    return this.getOrNull<SeatMapLayout>(`/web/trips/${encodeURIComponent(tripId)}/seatmap`);
  }

  async getAccount(): Promise<Account> {
    return this.get<Account>("/web/account");
  }

  async getOperatorConsole(): Promise<OperatorConsole> {
    return this.get<OperatorConsole>("/web/operator-console");
  }

  async getAdminDashboard(): Promise<AdminDashboard> {
    return this.get<AdminDashboard>("/web/admin");
  }

  async getTripTracking(reference: string): Promise<TripTracking | null> {
    return this.getOrNull<TripTracking>(`/web/tracking/${encodeURIComponent(reference)}`);
  }

  async getNotifications(): Promise<AppNotification[]> {
    return this.get<AppNotification[]>("/web/notifications");
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return this.get<NotificationPreferences>("/web/notification-preferences");
  }
}
