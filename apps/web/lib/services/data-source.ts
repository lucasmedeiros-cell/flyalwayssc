import type {
  Account,
  AdminDashboard,
  AppNotification,
  NotificationPreferences,
  Operator,
  OperatorConsole,
  Paginated,
  Place,
  SearchFacets,
  SearchFilters,
  SearchQuery,
  SeatMapLayout,
  SortKey,
  TransportMode,
  Trip,
  TripTracking,
} from "@vialta/types";

/**
 * Contrato estable de acceso a datos. La UI sólo depende de esta interfaz,
 * así que cambiar el adaptador mock por la API real de NestJS no requiere
 * tocar componentes.
 */
export interface DataSource {
  listPlaces(mode: TransportMode, query?: string): Promise<Place[]>;
  listOperators(mode?: TransportMode): Promise<Operator[]>;
  searchTrips(
    query: SearchQuery,
    opts?: { filters?: SearchFilters; sort?: SortKey; page?: number; pageSize?: number }
  ): Promise<Paginated<Trip>>;
  /** Resumen del conjunto SIN filtrar, para alimentar el panel de filtros. */
  searchFacets(query: SearchQuery): Promise<SearchFacets>;
  getTrip(id: string): Promise<Trip | null>;
  /** Mapa de asientos del viaje (para la selección visual en la reserva). */
  getSeatMap(tripId: string): Promise<SeatMapLayout | null>;
  /** Cuenta del usuario actual (perfil: reservas, facturas, pagos, favoritos). */
  getAccount(): Promise<Account>;
  /** Panel del operador actual (flota, rutas, horarios, promociones, personal). */
  getOperatorConsole(): Promise<OperatorConsole>;
  /** Métricas ejecutivas para el dashboard de administrador. */
  getAdminDashboard(): Promise<AdminDashboard>;
  /** Seguimiento en tiempo real de un viaje por referencia de reserva. */
  getTripTracking(reference: string): Promise<TripTracking | null>;
  /** Notificaciones del usuario (email, SMS, push, WhatsApp). */
  getNotifications(): Promise<AppNotification[]>;
  /** Preferencias de notificación por categoría y canal. */
  getNotificationPreferences(): Promise<NotificationPreferences>;
}
