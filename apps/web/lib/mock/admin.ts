import type { AdminDashboard, AdminPeriodData } from "@vialta/types";

const rev = (revenue: number[], bookings: number[], labels: string[]): AdminPeriodData["revenue"] =>
  labels.map((label, i) => ({ label, revenue: revenue[i], bookings: bookings[i] }));

const PERIOD_7D: AdminPeriodData = {
  kpis: [
    { id: "revenue", label: "Ingresos", value: 312800, unit: "money", deltaPct: 5.2 },
    { id: "bookings", label: "Reservas", value: 2090, unit: "int", deltaPct: 4.0 },
    { id: "cancel", label: "Cancelaciones", value: 4.6, unit: "pct", deltaPct: -0.4, invert: true },
    { id: "occupancy", label: "Ocupación", value: 80, unit: "pct", deltaPct: 2.1 },
    { id: "users", label: "Usuarios activos", value: 9120, unit: "int", deltaPct: 6.4 },
  ],
  revenue: rev(
    [38200, 41800, 39600, 47200, 52400, 60900, 32700],
    [262, 288, 271, 322, 358, 410, 179],
    ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  ),
};

const PERIOD_30D: AdminPeriodData = {
  kpis: [
    { id: "revenue", label: "Ingresos", value: 1284500, unit: "money", deltaPct: 12.4 },
    { id: "bookings", label: "Reservas", value: 8640, unit: "int", deltaPct: 8.1 },
    { id: "cancel", label: "Cancelaciones", value: 4.2, unit: "pct", deltaPct: -1.3, invert: true },
    { id: "occupancy", label: "Ocupación", value: 78, unit: "pct", deltaPct: 3.5 },
    { id: "users", label: "Usuarios activos", value: 23940, unit: "int", deltaPct: 15.2 },
  ],
  revenue: rev(
    [186000, 204000, 198000, 232000, 246000, 218500],
    [1240, 1380, 1330, 1520, 1610, 1560],
    ["1–5", "6–10", "11–15", "16–20", "21–25", "26–30"]
  ),
};

const PERIOD_90D: AdminPeriodData = {
  kpis: [
    { id: "revenue", label: "Ingresos", value: 3690000, unit: "money", deltaPct: 9.8 },
    { id: "bookings", label: "Reservas", value: 25300, unit: "int", deltaPct: 10.2 },
    { id: "cancel", label: "Cancelaciones", value: 4.5, unit: "pct", deltaPct: -0.9, invert: true },
    { id: "occupancy", label: "Ocupación", value: 76, unit: "pct", deltaPct: 1.8 },
    { id: "users", label: "Usuarios activos", value: 41200, unit: "int", deltaPct: 18.7 },
  ],
  revenue: rev(
    [520000, 560000, 590000, 610000, 690000, 720000],
    [3600, 3900, 4100, 4300, 4800, 4600],
    ["Abr I", "Abr II", "May I", "May II", "Jun I", "Jun II"]
  ),
};

export const ADMIN_DASHBOARD: AdminDashboard = {
  currency: "BOB",
  periods: { "7d": PERIOD_7D, "30d": PERIOD_30D, "90d": PERIOD_90D },

  salesByMode: [
    { mode: "air", revenue: 612000, share: 48 },
    { mode: "bus", revenue: 372000, share: 29 },
    { mode: "train", revenue: 218000, share: 17 },
    { mode: "private", revenue: 82500, share: 6 },
  ],

  popularRoutes: [
    { id: "pr-1", label: "Santa Cruz → La Paz", mode: "air", bookings: 1820, revenue: 401000, trendPct: 14 },
    { id: "pr-2", label: "La Paz → Cochabamba", mode: "bus", bookings: 1540, revenue: 122000, trendPct: 6 },
    { id: "pr-3", label: "Oruro → Uyuni", mode: "train", bookings: 1290, revenue: 264000, trendPct: 9 },
    { id: "pr-4", label: "Cochabamba → Santa Cruz", mode: "bus", bookings: 980, revenue: 128000, trendPct: -3 },
    { id: "pr-5", label: "Santa Cruz → Miami", mode: "air", bookings: 870, revenue: 178000, trendPct: 4 },
  ],

  companies: [
    { id: "c-1", name: "Boliviana de Aviación", mark: "BoA", color: "#0a2d6e", modes: ["air"], bookings: 2410, revenue: 520000, rating: 4.6, status: "active" },
    { id: "c-2", name: "Trans Copacabana", mark: "TC", color: "#c8102e", modes: ["bus"], bookings: 1980, revenue: 312000, rating: 4.4, status: "active" },
    { id: "c-3", name: "Ferroviaria Andina", mark: "FA", color: "#0f9d8f", modes: ["train"], bookings: 1450, revenue: 286000, rating: 4.8, status: "active" },
    { id: "c-4", name: "El Dorado", mark: "ED", color: "#d4a017", modes: ["bus"], bookings: 1120, revenue: 168000, rating: 4.2, status: "active" },
    { id: "c-5", name: "Andes Privado", mark: "AP", color: "#5847f0", modes: ["private"], bookings: 540, revenue: 96000, rating: 4.9, status: "active" },
    { id: "c-6", name: "EcoJet", mark: "EJ", color: "#00963a", modes: ["air"], bookings: 320, revenue: 72000, rating: 4.3, status: "pending" },
  ],

  usersTotal: 184320,
  usersActive: 23940,
  usersNew: 1820,
};
