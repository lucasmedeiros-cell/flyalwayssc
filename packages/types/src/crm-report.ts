import type { CurrencyCode } from "./common";
import type { CrmKpi } from "./crm";

/* ------------------------------------------------------------------ */
/* Reportes — datos agregados para el módulo de Reportes.              */
/* ------------------------------------------------------------------ */

export interface ReportSeriesPoint {
  label: string;
  income: number;
  expense: number;
  profit: number;
  sales: number;
}

export interface ReportAgentRow {
  name: string;
  sales: number;
  revenue: number;
  commission: number;
}

export interface ReportDestinationRow {
  destination: string;
  bookings: number;
  revenue: number;
}

export interface ReportAirlineRow {
  airline: string;
  tickets: number;
  revenue: number;
}

export interface ReportProviderRow {
  provider: string;
  bookings: number;
  payable: number;
}

export interface ReportCustomerRow {
  name: string;
  trips: number;
  spent: number;
}

export interface CrmReports {
  currency: CurrencyCode;
  kpis: CrmKpi[];
  monthly: ReportSeriesPoint[];
  byAgent: ReportAgentRow[];
  byDestination: ReportDestinationRow[];
  byAirline: ReportAirlineRow[];
  byProvider: ReportProviderRow[];
  topCustomers: ReportCustomerRow[];
}
