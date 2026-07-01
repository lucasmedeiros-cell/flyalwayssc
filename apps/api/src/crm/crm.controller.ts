import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CrmJwtGuard } from "../crm-auth/crm-jwt.guard";
import { CrmService } from "./crm.service";

/** Endpoints de lectura del CRM. Todo el módulo exige un access JWT válido. */
@ApiTags("crm")
@ApiBearerAuth()
@UseGuards(CrmJwtGuard)
@Controller("crm")
export class CrmController {
  constructor(private readonly crm: CrmService) {}

  @Get("dashboard")
  dashboard() {
    return this.crm.getDashboard();
  }

  @Get("reports")
  reports() {
    return this.crm.getReports();
  }

  @Get("settings")
  settings() {
    return this.crm.getSettings();
  }

  @Get("customers")
  customers() {
    return this.crm.listCustomers();
  }

  @Get("customers/:id")
  customer(@Param("id") id: string) {
    return this.crm.getCustomer(id);
  }

  @Get("tickets")
  tickets() {
    return this.crm.listTickets();
  }

  @Get("tickets/:id")
  ticket(@Param("id") id: string) {
    return this.crm.getTicket(id);
  }

  @Get("quotes")
  quotes() {
    return this.crm.listQuotes();
  }

  @Get("payments")
  payments() {
    return this.crm.listPayments();
  }

  @Get("documents")
  documents() {
    return this.crm.listDocuments();
  }

  @Get("packages")
  packages() {
    return this.crm.listPackages();
  }

  @Get("providers")
  providers() {
    return this.crm.listProviders();
  }

  @Get("tasks")
  tasks() {
    return this.crm.listTasks();
  }

  @Get("agents")
  agents() {
    return this.crm.listAgents();
  }

  @Get("calendar")
  calendar() {
    return this.crm.listCalendarEvents();
  }

  @Get("marketing")
  marketing() {
    return this.crm.getMarketing();
  }

  @Get("automations")
  automations() {
    return this.crm.listAutomations();
  }

  @Get("notifications")
  notifications() {
    return this.crm.listNotifications();
  }
}
