import { ID } from "./common";
import { TransportMode } from "./transport";

export type AdminPeriod = "7d" | "30d" | "90d";

export const ADMIN_PERIOD_LABEL: Record<AdminPeriod, string> = {
  "7d": "7 días",
  "30d": "30 días",
  "90d": "90 días",
};

export interface AdminKpi {
  id: string;
  label: string;
  value: number;
  unit: "money" | "int" | "pct";
  /** Variación porcentual vs. periodo anterior. */
  deltaPct: number;
  /** Si subir es negativo (p. ej. cancelaciones). */
  invert?: boolean;
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  bookings: number;
}

export interface AdminPeriodData {
  kpis: AdminKpi[];
  revenue: RevenuePoint[];
}

export interface SalesByMode {
  mode: TransportMode;
  revenue: number;
  /** Porcentaje del total (0..100). */
  share: number;
}

export interface PopularRoute {
  id: ID;
  label: string;
  mode: TransportMode;
  bookings: number;
  revenue: number;
  trendPct: number;
}

export type CompanyStatus = "active" | "pending" | "suspended";

export interface AffiliatedCompany {
  id: ID;
  name: string;
  mark: string;
  color: string;
  modes: TransportMode[];
  bookings: number;
  revenue: number;
  rating: number;
  status: CompanyStatus;
}

export interface AdminDashboard {
  currency: string;
  periods: Record<AdminPeriod, AdminPeriodData>;
  salesByMode: SalesByMode[];
  popularRoutes: PopularRoute[];
  companies: AffiliatedCompany[];
  usersTotal: number;
  usersActive: number;
  usersNew: number;
}
