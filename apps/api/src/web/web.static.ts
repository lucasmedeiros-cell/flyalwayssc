/**
 * Datos agregados del frontend público servidos por el API (dashboard de
 * administración y consola de operador). Portados verbatim del antiguo mock
 * de la web; son paneles de solo lectura que no ameritan tablas propias.
 * La forma JSON coincide con `AdminDashboard` / `OperatorConsole` de la web.
 */

const rev = (revenue: number[], bookings: number[], labels: string[]) =>
  labels.map((label, i) => ({ label, revenue: revenue[i], bookings: bookings[i] }));

const PERIOD_7D = {
  kpis: [
    { id: "revenue", label: "Ingresos", value: 312800, unit: "money", deltaPct: 5.2 },
    { id: "bookings", label: "Reservas", value: 2090, unit: "int", deltaPct: 4.0 },
    { id: "cancel", label: "Cancelaciones", value: 4.6, unit: "pct", deltaPct: -0.4, invert: true },
    { id: "occupancy", label: "Ocupación", value: 80, unit: "pct", deltaPct: 2.1 },
    { id: "users", label: "Usuarios activos", value: 9120, unit: "int", deltaPct: 6.4 },
  ],
  revenue: rev([38200, 41800, 39600, 47200, 52400, 60900, 32700], [262, 288, 271, 322, 358, 410, 179], ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]),
};
const PERIOD_30D = {
  kpis: [
    { id: "revenue", label: "Ingresos", value: 1284500, unit: "money", deltaPct: 12.4 },
    { id: "bookings", label: "Reservas", value: 8640, unit: "int", deltaPct: 8.1 },
    { id: "cancel", label: "Cancelaciones", value: 4.2, unit: "pct", deltaPct: -1.3, invert: true },
    { id: "occupancy", label: "Ocupación", value: 78, unit: "pct", deltaPct: 3.5 },
    { id: "users", label: "Usuarios activos", value: 23940, unit: "int", deltaPct: 15.2 },
  ],
  revenue: rev([186000, 204000, 198000, 232000, 246000, 218500], [1240, 1380, 1330, 1520, 1610, 1560], ["1–5", "6–10", "11–15", "16–20", "21–25", "26–30"]),
};
const PERIOD_90D = {
  kpis: [
    { id: "revenue", label: "Ingresos", value: 3690000, unit: "money", deltaPct: 9.8 },
    { id: "bookings", label: "Reservas", value: 25300, unit: "int", deltaPct: 10.2 },
    { id: "cancel", label: "Cancelaciones", value: 4.5, unit: "pct", deltaPct: -0.9, invert: true },
    { id: "occupancy", label: "Ocupación", value: 76, unit: "pct", deltaPct: 1.8 },
    { id: "users", label: "Usuarios activos", value: 41200, unit: "int", deltaPct: 18.7 },
  ],
  revenue: rev([520000, 560000, 590000, 610000, 690000, 720000], [3600, 3900, 4100, 4300, 4800, 4600], ["Abr I", "Abr II", "May I", "May II", "Jun I", "Jun II"]),
};

export const ADMIN_DASHBOARD = {
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

const m = (amount: number) => ({ amount, currency: "BOB" });

export const OPERATOR_CONSOLE = {
  company: { id: "op-andino-bolivia", name: "Grupo Andino Bolivia", logoMark: "GA", brandColor: "#0a2d6e", modes: ["air", "bus", "train", "private"], rating: 4.7, countryCode: "BO" },
  vehicles: [
    { id: "v-1", mode: "air", name: "Airbus A320neo", registration: "OB-2031", capacity: 180, year: 2021, status: "active" },
    { id: "v-2", mode: "air", name: "Boeing 737-800", registration: "OB-1987", capacity: 189, year: 2019, status: "maintenance" },
    { id: "v-3", mode: "bus", name: "Volvo 9800 DD", registration: "D4K-882", capacity: 52, year: 2022, status: "active" },
    { id: "v-4", mode: "bus", name: "Scania Irizar i8", registration: "D7M-145", capacity: 46, year: 2020, status: "active" },
    { id: "v-5", mode: "train", name: "Vistadome Andino", registration: "TR-07", capacity: 84, year: 2018, status: "active" },
    { id: "v-6", mode: "train", name: "Serie 730", registration: "TR-12", capacity: 120, year: 2023, status: "active" },
    { id: "v-7", mode: "private", name: "Mercedes Sprinter VIP", registration: "V9P-330", capacity: 16, year: 2023, status: "active" },
    { id: "v-8", mode: "private", name: "Toyota Hiace Premium", registration: "V2H-118", capacity: 12, year: 2021, status: "inactive" },
  ],
  routes: [
    { id: "r-1", mode: "air", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "La Paz", destinationCode: "LPB", frequency: "Diaria", durationMin: 65, stops: 0, active: true, pricing: [{ travelClass: "economy", price: m(640) }, { travelClass: "business", price: m(1400) }] },
    { id: "r-2", mode: "air", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Cochabamba", destinationCode: "CBB", frequency: "Diaria", durationMin: 40, stops: 0, active: true, pricing: [{ travelClass: "economy", price: m(520) }, { travelClass: "business", price: m(1150) }] },
    { id: "r-3", mode: "bus", originCity: "La Paz", originCode: "LPB", destinationCity: "Cochabamba", destinationCode: "CBB", frequency: "Lun a Sáb", durationMin: 450, stops: 1, active: true, pricing: [{ travelClass: "standard", price: m(70) }, { travelClass: "executive", price: m(110) }, { travelClass: "vip", price: m(160) }] },
    { id: "r-4", mode: "train", originCity: "Oruro", originCode: "ORU", destinationCity: "Uyuni", destinationCode: "UYU", frequency: "4 días/semana", durationMin: 430, stops: 0, active: true, pricing: [{ travelClass: "standard", price: m(160) }, { travelClass: "first", price: m(320) }] },
    { id: "r-5", mode: "private", originCity: "La Paz", originCode: "LPB", destinationCity: "El Alto", destinationCode: "LPB", frequency: "Bajo demanda", durationMin: 45, stops: 0, active: true, pricing: [{ travelClass: "vip", price: m(450) }] },
    { id: "r-6", mode: "bus", originCity: "Cochabamba", originCode: "CBB", destinationCity: "Santa Cruz", destinationCode: "VVI", frequency: "Diaria", durationMin: 600, stops: 1, active: false, pricing: [{ travelClass: "executive", price: m(120) }] },
  ],
  departures: [
    { id: "d-1", mode: "air", routeLabel: "VVI → LPB", vehicleName: "Airbus A320neo", departAt: "2026-06-28T08:30:00", arriveAt: "2026-06-28T09:35:00", travelClass: "economy", price: m(640), seatsTotal: 180, seatsSold: 142, status: "scheduled" },
    { id: "d-2", mode: "bus", routeLabel: "LPB → CBB", vehicleName: "Volvo 9800 DD", departAt: "2026-06-28T21:30:00", arriveAt: "2026-06-29T05:00:00", travelClass: "vip", price: m(160), seatsTotal: 52, seatsSold: 38, status: "scheduled" },
    { id: "d-3", mode: "train", routeLabel: "ORU → UYU", vehicleName: "Vistadome Andino", departAt: "2026-06-28T14:00:00", arriveAt: "2026-06-28T21:10:00", travelClass: "first", price: m(320), seatsTotal: 84, seatsSold: 80, status: "boarding" },
    { id: "d-4", mode: "air", routeLabel: "VVI → LPB", vehicleName: "Boeing 737-800", departAt: "2026-06-29T06:15:00", arriveAt: "2026-06-29T07:20:00", travelClass: "economy", price: m(620), seatsTotal: 189, seatsSold: 95, status: "scheduled" },
    { id: "d-5", mode: "bus", routeLabel: "CBB → VVI", vehicleName: "Scania Irizar i8", departAt: "2026-06-29T19:00:00", arriveAt: "2026-06-30T05:00:00", travelClass: "executive", price: m(120), seatsTotal: 46, seatsSold: 41, status: "scheduled" },
    { id: "d-6", mode: "air", routeLabel: "VVI → CBB", vehicleName: "Airbus A320neo", departAt: "2026-06-30T11:00:00", arriveAt: "2026-06-30T11:40:00", travelClass: "business", price: m(1150), seatsTotal: 180, seatsSold: 150, status: "scheduled" },
    { id: "d-7", mode: "private", routeLabel: "LPB → El Alto", vehicleName: "Mercedes Sprinter VIP", departAt: "2026-06-27T18:00:00", arriveAt: "2026-06-27T18:45:00", travelClass: "vip", price: m(450), seatsTotal: 16, seatsSold: 11, status: "departed" },
    { id: "d-8", mode: "train", routeLabel: "ORU → UYU", vehicleName: "Serie 730", departAt: "2026-06-27T09:30:00", arriveAt: "2026-06-27T16:40:00", travelClass: "standard", price: m(160), seatsTotal: 120, seatsSold: 60, status: "cancelled" },
  ],
  promotions: [
    { id: "p-1", code: "ANDES15", description: "15% en rutas ferroviarias", discountPct: 15, validFrom: "2026-06-01", validTo: "2026-07-31", active: true, used: 320, limit: 1000 },
    { id: "p-2", code: "VUELA2X1", description: "2.º pasajero al 50% en vuelos", discountPct: 50, validFrom: "2026-06-15", validTo: "2026-06-30", active: true, used: 88, limit: 200 },
    { id: "p-3", code: "INVIERNO", description: "10% temporada baja en buses", discountPct: 10, validFrom: "2026-05-01", validTo: "2026-06-20", active: false, used: 540, limit: 1000 },
    { id: "p-4", code: "VIPUP", description: "Upgrade a VIP con 25% off", discountPct: 25, validFrom: "2026-06-20", validTo: "2026-07-15", active: true, used: 12, limit: 100 },
  ],
  staff: [
    { id: "s-1", name: "Carlos Mendoza", initials: "CM", role: "pilot", mode: "air", license: "ATPL-4471", status: "available", rating: 4.9 },
    { id: "s-2", name: "Lucía Ríos", initials: "LR", role: "pilot", mode: "air", license: "ATPL-3320", status: "on_trip", rating: 4.8 },
    { id: "s-3", name: "José Quispe", initials: "JQ", role: "driver", mode: "bus", license: "A-IIIb 88213", status: "available", rating: 4.7 },
    { id: "s-4", name: "Marta Flores", initials: "MF", role: "driver", mode: "bus", license: "A-IIIb 77120", status: "on_trip", rating: 4.6 },
    { id: "s-5", name: "Pedro Salas", initials: "PS", role: "driver", mode: "private", license: "A-IIa 55012", status: "off", rating: 4.9 },
    { id: "s-6", name: "Ana Torres", initials: "AT", role: "crew", mode: "air", license: "TCP-2201", status: "available", rating: 4.8 },
    { id: "s-7", name: "Diego Vega", initials: "DV", role: "host", mode: "train", license: "AT-0098", status: "available", rating: 4.7 },
    { id: "s-8", name: "Rosa Núñez", initials: "RN", role: "crew", mode: "train", license: "AT-0142", status: "on_trip", rating: 4.9 },
  ],
};
