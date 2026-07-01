import type {
  CrmDashboard,
  CrmUser,
  CrmActiveSession,
  CrmAuditEntry,
  Customer,
  CustomerDetail,
  Ticket,
  TicketDetail,
  Quote,
  PaymentDetail,
  GeneratedDocument,
  TravelPackage,
  Provider,
  CrmTask,
  CrmAgent,
  CrmCalendarEvent,
  CrmReports,
  MarketingOverview,
  Automation,
  CrmNotification,
} from "@vialta/types";

export interface CrmSettingsData {
  users: CrmUser[];
  sessions: CrmActiveSession[];
  audit: CrmAuditEntry[];
}

/**
 * Contrato estable de acceso a datos del CRM. La UI sólo depende de esta
 * interfaz; cambiar el adaptador mock por `HttpDataSource` (API NestJS, Fase 9)
 * no requiere tocar componentes. Mismo patrón puerto/adaptador que apps/web.
 *
 * Crece módulo a módulo: clientes, pasajes, pagos, etc.
 */
export interface CrmDataSource {
  /** Métricas y widgets del dashboard ejecutivo. */
  getDashboard(): Promise<CrmDashboard>;
  /** Datos del módulo de Ajustes: usuarios, sesiones activas y auditoría. */
  getSettings(): Promise<CrmSettingsData>;
  /** Lista de clientes (filtrado/paginado se hace en la vista por ahora). */
  listCustomers(): Promise<Customer[]>;
  /** Ficha 360° de un cliente (con documentos e historial). */
  getCustomer(id: string): Promise<CustomerDetail | null>;
  /** Pipeline de pasajes/ventas. */
  listTickets(): Promise<Ticket[]>;
  /** Ficha de un pasaje (itinerario + extras). */
  getTicket(id: string): Promise<TicketDetail | null>;
  /** Cotizaciones del cotizador. */
  listQuotes(): Promise<Quote[]>;
  /** Pagos con su historial de abonos. */
  listPayments(): Promise<PaymentDetail[]>;
  /** Documentos generados (facturas, recibos, vouchers, …). */
  listDocuments(): Promise<GeneratedDocument[]>;
  /** Paquetes turísticos. */
  listPackages(): Promise<TravelPackage[]>;
  /** Proveedores. */
  listProviders(): Promise<Provider[]>;
  /** Tareas internas. */
  listTasks(): Promise<CrmTask[]>;
  /** Agentes / personal con métricas. */
  listAgents(): Promise<CrmAgent[]>;
  /** Eventos de agenda. */
  listCalendarEvents(): Promise<CrmCalendarEvent[]>;
  /** Reportes agregados (ventas, utilidades, comisiones, etc.). */
  getReports(): Promise<CrmReports>;
  /** Marketing: campañas + embudo de conversión. */
  getMarketing(): Promise<MarketingOverview>;
  /** Automatizaciones (flujos disparados por eventos). */
  listAutomations(): Promise<Automation[]>;
  /** Bandeja unificada de notificaciones. */
  listNotifications(): Promise<CrmNotification[]>;
}
