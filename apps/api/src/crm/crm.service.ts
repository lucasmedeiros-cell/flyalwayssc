import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  mapAgent,
  mapAudit,
  mapAutomation,
  mapCalendarEvent,
  mapCampaign,
  mapCustomer,
  mapCustomerDetail,
  mapDocument,
  mapNotification,
  mapPackage,
  mapPayment,
  mapProvider,
  mapQuote,
  mapSession,
  mapTask,
  mapTicket,
  mapTicketDetail,
  mapUser,
} from "./crm.mappers";

const NOT_DELETED = { deletedAt: null };

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  /* --------------------------- Dashboard / Reportes -------------------- */

  async getDashboard() {
    const snap = await this.prisma.crmSnapshot.findUnique({ where: { key: "dashboard" } });
    return snap?.data ?? {};
  }

  async getReports() {
    const snap = await this.prisma.crmSnapshot.findUnique({ where: { key: "reports" } });
    return snap?.data ?? {};
  }

  /* ------------------------------ Ajustes ------------------------------ */

  async getSettings() {
    const [users, sessions, audit] = await Promise.all([
      this.prisma.crmUser.findMany({ where: NOT_DELETED, orderBy: { createdAt: "asc" } }),
      this.prisma.crmSession.findMany({ orderBy: { lastActiveAt: "desc" } }),
      this.prisma.crmAuditEntry.findMany({ orderBy: { at: "desc" }, take: 50 }),
    ]);
    return { users: users.map(mapUser), sessions: sessions.map(mapSession), audit: audit.map(mapAudit) };
  }

  /* ------------------------------ Clientes ----------------------------- */

  async listCustomers() {
    const rows = await this.prisma.crmCustomer.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapCustomer);
  }

  async getCustomer(id: string) {
    const row = await this.prisma.crmCustomer.findFirst({ where: { id, ...NOT_DELETED } });
    if (!row) throw new NotFoundException("Cliente no encontrado");
    return mapCustomerDetail(row);
  }

  /* ------------------------------- Pasajes ----------------------------- */

  async listTickets() {
    const rows = await this.prisma.crmTicket.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapTicket);
  }

  async getTicket(id: string) {
    const row = await this.prisma.crmTicket.findFirst({ where: { id, ...NOT_DELETED } });
    if (!row) throw new NotFoundException("Pasaje no encontrado");
    return mapTicketDetail(row);
  }

  /* ----------------------- Cotizaciones / Pagos ------------------------ */

  async listQuotes() {
    const rows = await this.prisma.crmQuote.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapQuote);
  }

  async listPayments() {
    const rows = await this.prisma.crmPayment.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapPayment);
  }

  async listDocuments() {
    const rows = await this.prisma.crmDocument.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapDocument);
  }

  /* -------------------- Paquetes / Proveedores / etc ------------------- */

  async listPackages() {
    const rows = await this.prisma.crmPackage.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapPackage);
  }

  async listProviders() {
    const rows = await this.prisma.crmProvider.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapProvider);
  }

  async listTasks() {
    const rows = await this.prisma.crmTask.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapTask);
  }

  async listAgents() {
    const rows = await this.prisma.crmAgent.findMany({ where: NOT_DELETED, orderBy: { sales: "desc" } });
    return rows.map(mapAgent);
  }

  async listCalendarEvents() {
    const rows = await this.prisma.crmCalendarEvent.findMany({ orderBy: { date: "asc" } });
    return rows.map(mapCalendarEvent);
  }

  /* -------------- Marketing / Automatizaciones / Notif ----------------- */

  async getMarketing() {
    const [campaigns, funnel] = await Promise.all([
      this.prisma.crmCampaign.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } }),
      this.prisma.crmFunnelStage.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    return {
      campaigns: campaigns.map(mapCampaign),
      funnel: funnel.map((f) => ({ label: f.label, value: f.value })),
    };
  }

  async listAutomations() {
    const rows = await this.prisma.crmAutomation.findMany({ where: NOT_DELETED, orderBy: { createdAt: "desc" } });
    return rows.map(mapAutomation);
  }

  async listNotifications() {
    const rows = await this.prisma.crmNotification.findMany({ orderBy: { at: "desc" } });
    return rows.map(mapNotification);
  }
}
