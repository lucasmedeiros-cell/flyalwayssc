import { cookies } from "next/headers";
import type {
  CrmDashboard,
  CrmUser,
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
import { SESSION_COOKIE } from "@/lib/auth/session";
import type { CrmDataSource, CrmSettingsData } from "./data-source";
import { CRM_API_URL } from "./config";

/**
 * Adaptador HTTP: implementa el MISMO contrato `CrmDataSource` consultando el
 * API NestJS (Postgres). Lee el access JWT de la cookie de sesión en cada
 * petición (uso desde Server Components). Mismo patrón puerto/adaptador que el
 * mock — la UI no cambia.
 */
export class HttpCrmDataSource implements CrmDataSource {
  private async token(): Promise<string | undefined> {
    const store = await cookies();
    return store.get(SESSION_COOKIE)?.value;
  }

  private async get<T>(path: string): Promise<T> {
    const token = await this.token();
    const res = await fetch(`${CRM_API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`CRM API ${path} → ${res.status}`);
    return (await res.json()) as T;
  }

  /** Variante que devuelve null en 404 (fichas por id). */
  private async getOrNull<T>(path: string): Promise<T | null> {
    const token = await this.token();
    const res = await fetch(`${CRM_API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`CRM API ${path} → ${res.status}`);
    return (await res.json()) as T;
  }

  getDashboard() {
    return this.get<CrmDashboard>("/crm/dashboard");
  }
  getSettings() {
    return this.get<CrmSettingsData>("/crm/settings");
  }
  listCustomers() {
    return this.get<Customer[]>("/crm/customers");
  }
  getCustomer(id: string) {
    return this.getOrNull<CustomerDetail>(`/crm/customers/${id}`);
  }
  listTickets() {
    return this.get<Ticket[]>("/crm/tickets");
  }
  getTicket(id: string) {
    return this.getOrNull<TicketDetail>(`/crm/tickets/${id}`);
  }
  listQuotes() {
    return this.get<Quote[]>("/crm/quotes");
  }
  listPayments() {
    return this.get<PaymentDetail[]>("/crm/payments");
  }
  listDocuments() {
    return this.get<GeneratedDocument[]>("/crm/documents");
  }
  listPackages() {
    return this.get<TravelPackage[]>("/crm/packages");
  }
  listProviders() {
    return this.get<Provider[]>("/crm/providers");
  }
  listTasks() {
    return this.get<CrmTask[]>("/crm/tasks");
  }
  listAgents() {
    return this.get<CrmAgent[]>("/crm/agents");
  }
  listCalendarEvents() {
    return this.get<CrmCalendarEvent[]>("/crm/calendar");
  }
  getReports() {
    return this.get<CrmReports>("/crm/reports");
  }
  getMarketing() {
    return this.get<MarketingOverview>("/crm/marketing");
  }
  listAutomations() {
    return this.get<Automation[]>("/crm/automations");
  }
  listNotifications() {
    return this.get<CrmNotification[]>("/crm/notifications");
  }
}

/** Re-export para tipos que el adaptador usa sólo en firmas. */
export type { CrmUser };
