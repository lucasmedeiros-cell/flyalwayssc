import type { CrmCalendarEvent } from "@vialta/types";

/* Eventos de agenda — junio/julio 2026 (hoy = 2026-06-30). */
export const MOCK_CALENDAR_EVENTS: CrmCalendarEvent[] = [
  { id: "ev1", kind: "departure", title: "Salida VVI → MAD", date: "2026-07-02", time: "23:40", customerName: "Familia Gutiérrez" },
  { id: "ev2", kind: "payment", title: "Vence pago parcial PG-3043", date: "2026-07-03", customerName: "Pedro Quispe" },
  { id: "ev3", kind: "follow_up", title: "Seguimiento cotización crucero", date: "2026-07-03", time: "10:00", customerName: "Laura Vargas" },
  { id: "ev4", kind: "birthday", title: "Cumpleaños cliente VIP", date: "2026-07-04", customerName: "Roberto Áñez" },
  { id: "ev5", kind: "passport_renewal", title: "Pasaporte por vencer", date: "2026-07-12", customerName: "Carmen Justiniano" },
  { id: "ev6", kind: "flight", title: "Vuelo VVI → MIA ejecutiva", date: "2026-07-10", time: "08:40", customerName: "Roberto Áñez" },
  { id: "ev7", kind: "departure", title: "Salida CBB → GRU", date: "2026-07-05", time: "06:15", customerName: "Pedro Quispe" },
  { id: "ev8", kind: "meeting", title: "Reunión proveedor Europamundo", date: "2026-07-07", time: "15:00" },
  { id: "ev9", kind: "payment", title: "Vence anticipo crucero", date: "2026-07-10", customerName: "Laura Vargas" },
  { id: "ev10", kind: "departure", title: "Salida LPB → LIM", date: "2026-07-08", time: "07:30", customerName: "Luis Fernández" },
  { id: "ev11", kind: "reminder", title: "Cierre de comisiones del mes", date: "2026-06-30" },
  { id: "ev12", kind: "follow_up", title: "Llamada post-venta", date: "2026-06-30", time: "16:00", customerName: "Sofía Antelo" },
  { id: "ev13", kind: "departure", title: "Salida LPB → CUZ", date: "2026-07-15", time: "09:20", customerName: "Jorge Mamani" },
  { id: "ev14", kind: "meeting", title: "Capacitación GDS Amadeus", date: "2026-07-14", time: "09:00" },
  { id: "ev15", kind: "birthday", title: "Cumpleaños Patricia Vaca", date: "2026-07-18", customerName: "Patricia Vaca" },
];
