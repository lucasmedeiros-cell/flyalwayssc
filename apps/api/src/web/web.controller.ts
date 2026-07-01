import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WebService } from "./web.service";
import type { SearchQuery, SearchFilters, SortKey } from "./web.generator";

/** API del frontend público (búsqueda de viajes, detalle y mapa de asientos). */
@ApiTags("web")
@Controller("web")
export class WebController {
  constructor(private readonly web: WebService) {}

  @Post("search")
  search(@Body() body: { query: SearchQuery; filters?: SearchFilters; sort?: SortKey; page?: number; pageSize?: number }) {
    return this.web.search(body);
  }

  @Post("facets")
  facets(@Body() body: { query: SearchQuery }) {
    return this.web.facets(body.query);
  }

  @Get("trips/:id")
  async getTrip(@Param("id") id: string) {
    const trip = await this.web.getTrip(id);
    if (!trip) throw new NotFoundException();
    return trip;
  }

  @Get("trips/:id/seatmap")
  async getSeatMap(@Param("id") id: string) {
    const map = await this.web.getSeatMap(id);
    if (!map) throw new NotFoundException();
    return map;
  }

  @Get("account")
  getAccount() {
    return this.web.getAccount();
  }

  @Get("notifications")
  getNotifications() {
    return this.web.getNotifications();
  }

  @Get("notification-preferences")
  async getNotificationPreferences() {
    const prefs = await this.web.getNotificationPreferences();
    if (!prefs) throw new NotFoundException();
    return prefs;
  }

  @Get("tracking/:reference")
  async getTracking(@Param("reference") reference: string) {
    const t = await this.web.getTripTracking(reference);
    if (!t) throw new NotFoundException();
    return t;
  }

  @Get("admin")
  getAdmin() {
    return this.web.getAdminDashboard();
  }

  @Get("operator-console")
  getOperatorConsole() {
    return this.web.getOperatorConsole();
  }
}
