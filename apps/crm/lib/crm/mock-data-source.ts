import type { CrmDashboard, Customer, CustomerDetail, Ticket, TicketDetail, Quote, PaymentDetail, GeneratedDocument, TravelPackage, Provider, CrmTask, CrmAgent, CrmCalendarEvent, CrmReports, MarketingOverview, Automation, CrmNotification } from "@vialta/types";
import type { CrmDataSource, CrmSettingsData } from "./data-source";
import { MOCK_DASHBOARD } from "./mock/dashboard";
import { MOCK_SETTINGS_USERS, MOCK_ACTIVE_SESSIONS, MOCK_AUDIT } from "./mock/settings";
import { MOCK_CUSTOMERS, findCustomer } from "./mock/customers";
import { MOCK_TICKETS, findTicket } from "./mock/tickets";
import { MOCK_QUOTES } from "./mock/quotes";
import { MOCK_PAYMENTS } from "./mock/payments";
import { MOCK_DOCUMENTS } from "./mock/documents";
import { MOCK_PACKAGES } from "./mock/packages";
import { MOCK_PROVIDERS } from "./mock/providers";
import { MOCK_TASKS } from "./mock/tasks";
import { MOCK_AGENTS } from "./mock/agents";
import { MOCK_CALENDAR_EVENTS } from "./mock/calendar";
import { MOCK_REPORTS } from "./mock/reports";
import { MOCK_MARKETING } from "./mock/marketing";
import { MOCK_AUTOMATIONS } from "./mock/automations";
import { MOCK_NOTIFICATIONS } from "./mock/notifications";

/** Adaptador en memoria. Implementa el mismo contrato que usará HttpDataSource. */
export class MockCrmDataSource implements CrmDataSource {
  constructor(private readonly latency = 0) {}

  private async delay<T>(value: T): Promise<T> {
    if (this.latency > 0) await new Promise((r) => setTimeout(r, this.latency));
    return value;
  }

  getDashboard(): Promise<CrmDashboard> {
    return this.delay(MOCK_DASHBOARD);
  }

  getSettings(): Promise<CrmSettingsData> {
    return this.delay({
      users: MOCK_SETTINGS_USERS,
      sessions: MOCK_ACTIVE_SESSIONS,
      audit: MOCK_AUDIT,
    });
  }

  listCustomers(): Promise<Customer[]> {
    return this.delay(MOCK_CUSTOMERS);
  }

  getCustomer(id: string): Promise<CustomerDetail | null> {
    return this.delay(findCustomer(id));
  }

  listTickets(): Promise<Ticket[]> {
    return this.delay(MOCK_TICKETS);
  }

  getTicket(id: string): Promise<TicketDetail | null> {
    return this.delay(findTicket(id));
  }

  listQuotes(): Promise<Quote[]> {
    return this.delay(MOCK_QUOTES);
  }

  listPayments(): Promise<PaymentDetail[]> {
    return this.delay(MOCK_PAYMENTS);
  }

  listDocuments(): Promise<GeneratedDocument[]> {
    return this.delay(MOCK_DOCUMENTS);
  }

  listPackages(): Promise<TravelPackage[]> {
    return this.delay(MOCK_PACKAGES);
  }

  listProviders(): Promise<Provider[]> {
    return this.delay(MOCK_PROVIDERS);
  }

  listTasks(): Promise<CrmTask[]> {
    return this.delay(MOCK_TASKS);
  }

  listAgents(): Promise<CrmAgent[]> {
    return this.delay(MOCK_AGENTS);
  }

  listCalendarEvents(): Promise<CrmCalendarEvent[]> {
    return this.delay(MOCK_CALENDAR_EVENTS);
  }

  getReports(): Promise<CrmReports> {
    return this.delay(MOCK_REPORTS);
  }

  getMarketing(): Promise<MarketingOverview> {
    return this.delay(MOCK_MARKETING);
  }

  listAutomations(): Promise<Automation[]> {
    return this.delay(MOCK_AUTOMATIONS);
  }

  listNotifications(): Promise<CrmNotification[]> {
    return this.delay(MOCK_NOTIFICATIONS);
  }
}
