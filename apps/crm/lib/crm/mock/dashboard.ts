import type { CrmDashboard, CrmKpi, CrmRevenuePoint } from "@vialta/types";

/* Datos mock del dashboard — realistas para FLYALWAYS (Bolivia, BOB).
   Timestamps fijos (ISO) para evitar desajustes de hidratación. */

const kpis = (vals: CrmKpi[]) => vals;

const revenueNow: CrmRevenuePoint[] = [
  { label: "09h", revenue: 1800, sales: 1 },
  { label: "11h", revenue: 3200, sales: 2 },
  { label: "13h", revenue: 1500, sales: 1 },
  { label: "15h", revenue: 4100, sales: 3 },
  { label: "Ahora", revenue: 2600, sales: 2 },
];

const revenueToday: CrmRevenuePoint[] = [
  { label: "08h", revenue: 3200, sales: 2 },
  { label: "11h", revenue: 5600, sales: 4 },
  { label: "14h", revenue: 4100, sales: 3 },
  { label: "17h", revenue: 8900, sales: 6 },
  { label: "20h", revenue: 7100, sales: 4 },
];

const revenueYesterday: CrmRevenuePoint[] = [
  { label: "08h", revenue: 2800, sales: 2 },
  { label: "11h", revenue: 4900, sales: 3 },
  { label: "14h", revenue: 5300, sales: 4 },
  { label: "17h", revenue: 6100, sales: 4 },
  { label: "20h", revenue: 5000, sales: 3 },
];

const revenueMonth: CrmRevenuePoint[] = [
  { label: "Sem 1", revenue: 96400, sales: 61 },
  { label: "Sem 2", revenue: 112300, sales: 74 },
  { label: "Sem 3", revenue: 87600, sales: 58 },
  { label: "Sem 4", revenue: 134800, sales: 89 },
];

const revenueYear: CrmRevenuePoint[] = [
  { label: "Ene", revenue: 342100, sales: 224 },
  { label: "Feb", revenue: 368400, sales: 241 },
  { label: "Mar", revenue: 401900, sales: 262 },
  { label: "Abr", revenue: 384200, sales: 248 },
  { label: "May", revenue: 421700, sales: 276 },
  { label: "Jun", revenue: 468900, sales: 312 },
];

export const MOCK_DASHBOARD: CrmDashboard = {
  currency: "BOB",
  periods: {
    now: {
      kpis: kpis([
        { id: "sales-now", label: "Ventas ahora", value: 6800, unit: "money", deltaPct: 5 },
        { id: "tickets-now", label: "Boletos emitidos", value: 4, unit: "int", deltaPct: 2 },
        { id: "new-clients-now", label: "Clientes nuevos", value: 1, unit: "int", deltaPct: 0 },
        { id: "pending", label: "Reservas pendientes", value: 3, unit: "int", deltaPct: -5, invert: true },
        { id: "margin-now", label: "Margen promedio", value: 18, unit: "pct", deltaPct: 1 },
      ]),
      revenue: revenueNow,
    },
    yesterday: {
      kpis: kpis([
        { id: "sales-yesterday", label: "Ventas de ayer", value: 24100, unit: "money", deltaPct: -6 },
        { id: "tickets-yesterday", label: "Boletos emitidos", value: 16, unit: "int", deltaPct: -3 },
        { id: "new-clients-yesterday", label: "Clientes nuevos", value: 5, unit: "int", deltaPct: 25 },
        { id: "confirmed-yesterday", label: "Reservas confirmadas", value: 12, unit: "int", deltaPct: 8 },
        { id: "margin-yesterday", label: "Margen promedio", value: 17, unit: "pct", deltaPct: -1 },
      ]),
      revenue: revenueYesterday,
    },
    today: {
      kpis: kpis([
        { id: "sales-today", label: "Ventas de hoy", value: 28900, unit: "money", deltaPct: 12 },
        { id: "tickets-today", label: "Boletos emitidos", value: 19, unit: "int", deltaPct: 8 },
        { id: "new-clients", label: "Clientes nuevos", value: 4, unit: "int", deltaPct: 33 },
        { id: "pending", label: "Reservas pendientes", value: 7, unit: "int", deltaPct: -10, invert: true },
        { id: "margin", label: "Margen promedio", value: 18, unit: "pct", deltaPct: 3 },
      ]),
      revenue: revenueToday,
    },
    month: {
      kpis: kpis([
        { id: "sales-month", label: "Ventas del mes", value: 431100, unit: "money", deltaPct: 15 },
        { id: "tickets-month", label: "Boletos emitidos", value: 282, unit: "int", deltaPct: 12 },
        { id: "new-clients-month", label: "Clientes nuevos", value: 96, unit: "int", deltaPct: 22 },
        { id: "confirmed-month", label: "Reservas confirmadas", value: 241, unit: "int", deltaPct: 9 },
        { id: "margin-month", label: "Margen promedio", value: 18, unit: "pct", deltaPct: 2 },
      ]),
      revenue: revenueMonth,
    },
    year: {
      kpis: kpis([
        { id: "sales-year", label: "Ventas del año", value: 4890200, unit: "money", deltaPct: 24 },
        { id: "tickets-year", label: "Boletos emitidos", value: 3120, unit: "int", deltaPct: 19 },
        { id: "new-clients-year", label: "Clientes nuevos", value: 1180, unit: "int", deltaPct: 28 },
        { id: "confirmed-year", label: "Reservas confirmadas", value: 2860, unit: "int", deltaPct: 16 },
        { id: "margin-year", label: "Margen promedio", value: 18, unit: "pct", deltaPct: 1 },
      ]),
      revenue: revenueYear,
    },
  },
  salesByChannel: [
    { label: "Mostrador", value: 42, color: "#3a23a8" },
    { label: "WhatsApp", value: 31, color: "#1ca71c" },
    { label: "Web", value: 18, color: "#8b7bf5" },
    { label: "Referidos", value: 9, color: "#e0a106" },
  ],
  topAgents: [
    { id: "a1", name: "Ana Flores", initials: "AF", sales: 89, revenue: 168400, goalPct: 112 },
    { id: "a2", name: "Carlos Mendoza", initials: "CM", sales: 76, revenue: 142800, goalPct: 95 },
    { id: "a3", name: "Lucía Pérez", initials: "LP", sales: 64, revenue: 118900, goalPct: 88 },
    { id: "a4", name: "Diego Rojas", initials: "DR", sales: 53, revenue: 97200, goalPct: 71 },
  ],
  topDestinations: [
    { id: "d1", label: "Santa Cruz → Madrid", bookings: 142, trendPct: 18 },
    { id: "d2", label: "La Paz → Miami", bookings: 118, trendPct: 9 },
    { id: "d3", label: "Cochabamba → Buenos Aires", bookings: 96, trendPct: -4 },
    { id: "d4", label: "Santa Cruz → São Paulo", bookings: 81, trendPct: 12 },
    { id: "d5", label: "La Paz → Lima", bookings: 74, trendPct: 6 },
  ],
  recentActivity: [
    { id: "ac1", kind: "sale", title: "Venta confirmada — VCB→MAD", description: "Familia Gutiérrez · 3 pax", actor: "Ana Flores", at: "2026-06-30T14:05:00Z", amount: { amount: 18450, currency: "BOB" } },
    { id: "ac2", kind: "payment", title: "Pago recibido (QR)", description: "Reserva #FA-20418", actor: "Sistema", at: "2026-06-30T13:32:00Z", amount: { amount: 6200, currency: "BOB" } },
    { id: "ac3", kind: "quote", title: "Cotización enviada por WhatsApp", description: "Crucero Caribe · 2 pax", actor: "Carlos Mendoza", at: "2026-06-30T12:48:00Z" },
    { id: "ac4", kind: "client", title: "Nuevo cliente registrado", description: "María Salazar", actor: "Lucía Pérez", at: "2026-06-30T11:20:00Z" },
    { id: "ac5", kind: "ticket", title: "Boleto emitido — LPB→MIA", description: "PNR AB12CD · BoA", actor: "Diego Rojas", at: "2026-06-30T10:02:00Z" },
    { id: "ac6", kind: "task", title: "Tarea completada", description: "Seguimiento post-venta", actor: "Ana Flores", at: "2026-06-30T09:15:00Z" },
  ],
  upcomingEvents: [
    { id: "e1", kind: "departure", title: "Salida VCB → MAD", date: "2026-07-02", time: "23:40", customerName: "Familia Gutiérrez" },
    { id: "e2", kind: "payment", title: "Vence pago parcial #FA-20390", date: "2026-07-03", customerName: "Pedro Quispe" },
    { id: "e3", kind: "follow_up", title: "Seguimiento cotización crucero", date: "2026-07-03", time: "10:00", customerName: "Laura Vargas" },
    { id: "e4", kind: "birthday", title: "Cumpleaños cliente VIP", date: "2026-07-04", customerName: "Roberto Áñez" },
    { id: "e5", kind: "passport_renewal", title: "Pasaporte por vencer", date: "2026-07-06", customerName: "Carmen Justiniano" },
  ],
  pendingTasks: [
    { id: "t1", title: "Llamar a cliente por reemisión LPB→LIM", priority: "urgent", status: "todo", dueDate: "2026-06-30", assignee: "Ana Flores", assigneeInitials: "AF" },
    { id: "t2", title: "Enviar voucher hotel Cancún", priority: "high", status: "in_progress", dueDate: "2026-07-01", assignee: "Carlos Mendoza", assigneeInitials: "CM" },
    { id: "t3", title: "Confirmar asientos grupo corporativo", priority: "medium", status: "todo", dueDate: "2026-07-01", assignee: "Lucía Pérez", assigneeInitials: "LP" },
    { id: "t4", title: "Cargar comprobante de transferencia", priority: "low", status: "todo", dueDate: "2026-07-02", assignee: "Diego Rojas", assigneeInitials: "DR" },
  ],
  bookingsPending: 7,
  bookingsConfirmed: 64,
  bookingsCancelled: 3,
  ticketsIssued: 282,
  newCustomers: 96,
  frequentCustomers: 38,
};
