/**
 * Seed del dominio WEB de lectura: cuenta (perfil), notificaciones y
 * seguimiento. Idempotente (reemplaza estas tablas). Datos de Bolivia.
 *   DATABASE_URL=... npx ts-node prisma/seed-web-account.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BOOKINGS = [
  { id: "bk-1", reference: "VL-7K2A", status: "upcoming", mode: "air", operatorName: "Boliviana de Aviación", operatorMark: "BoA", operatorColor: "#0a2d6e", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "La Paz", destinationCode: "LPB", departAt: "2026-07-03T08:30:00", arriveAt: "2026-07-03T09:35:00", travelClass: "economy", passengers: 2, seats: ["12A", "12B"], totalAmount: 1340, totalCurrency: "BOB", favorite: true },
  { id: "bk-2", reference: "VL-3M9X", status: "upcoming", mode: "train", operatorName: "Ferroviaria Andina", operatorMark: "FA", operatorColor: "#0f9d8f", originCity: "Oruro", originCode: "ORU", destinationCity: "Uyuni", destinationCode: "UYU", departAt: "2026-07-15T14:00:00", arriveAt: "2026-07-15T21:10:00", travelClass: "first", passengers: 2, seats: ["4A", "4B"], totalAmount: 640, totalCurrency: "BOB", favorite: false },
  { id: "bk-3", reference: "VL-8QP1", status: "upcoming", mode: "bus", operatorName: "Trans Copacabana", operatorMark: "TC", operatorColor: "#c8102e", originCity: "La Paz", originCode: "LPB", destinationCity: "Copacabana", destinationCode: "COPA", departAt: "2026-08-02T07:30:00", arriveAt: "2026-08-02T11:00:00", travelClass: "executive", passengers: 1, seats: ["3A"], totalAmount: 95, totalCurrency: "BOB", favorite: false },
  { id: "bk-4", reference: "VL-1A4D", status: "completed", mode: "air", operatorName: "Boliviana de Aviación", operatorMark: "BoA", operatorColor: "#0a2d6e", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Cochabamba", destinationCode: "CBB", departAt: "2026-05-10T06:15:00", arriveAt: "2026-05-10T06:55:00", travelClass: "economy", passengers: 1, seats: ["18C"], totalAmount: 520, totalCurrency: "BOB", favorite: false },
  { id: "bk-5", reference: "VL-5T2K", status: "completed", mode: "bus", operatorName: "El Dorado", operatorMark: "ED", operatorColor: "#d4a017", originCity: "Cochabamba", originCode: "CBB", destinationCity: "La Paz", destinationCode: "LPB", departAt: "2026-03-22T22:00:00", arriveAt: "2026-03-23T05:30:00", travelClass: "vip", passengers: 2, seats: ["1A", "1B"], totalAmount: 340, totalCurrency: "BOB", favorite: true },
  { id: "bk-6", reference: "VL-9R0M", status: "completed", mode: "air", operatorName: "Boliviana de Aviación", operatorMark: "BoA", operatorColor: "#0a2d6e", originCity: "La Paz", originCode: "LPB", destinationCity: "Rurrenabaque", destinationCode: "RBQ", departAt: "2026-01-18T09:30:00", arriveAt: "2026-01-18T10:15:00", travelClass: "economy", passengers: 2, seats: ["6C", "6D"], totalAmount: 980, totalCurrency: "BOB", favorite: false },
  { id: "bk-7", reference: "VL-2C7H", status: "cancelled", mode: "private", operatorName: "Andes Privado", operatorMark: "AP", operatorColor: "#5847f0", originCity: "La Paz", originCode: "LPB", destinationCity: "El Alto", destinationCode: "LPB", departAt: "2026-04-05T05:00:00", arriveAt: "2026-04-05T05:45:00", travelClass: "vip", passengers: 3, seats: ["A", "B", "C"], totalAmount: 450, totalCurrency: "BOB", favorite: false },
];

const INVOICES = [
  { id: "inv-7", number: "INV-2026-0007", bookingReference: "VL-7K2A", date: "2026-06-20", amount: 1340, currency: "BOB", status: "paid" },
  { id: "inv-6", number: "INV-2026-0006", bookingReference: "VL-3M9X", date: "2026-06-18", amount: 640, currency: "BOB", status: "paid" },
  { id: "inv-5", number: "INV-2026-0005", bookingReference: "VL-8QP1", date: "2026-06-25", amount: 95, currency: "BOB", status: "paid" },
  { id: "inv-4", number: "INV-2026-0004", bookingReference: "VL-1A4D", date: "2026-05-08", amount: 520, currency: "BOB", status: "paid" },
  { id: "inv-3", number: "INV-2026-0003", bookingReference: "VL-5T2K", date: "2026-03-20", amount: 340, currency: "BOB", status: "paid" },
  { id: "inv-2", number: "INV-2026-0002", bookingReference: "VL-9R0M", date: "2026-01-15", amount: 980, currency: "BOB", status: "paid" },
  { id: "inv-1", number: "INV-2026-0001", bookingReference: "VL-2C7H", date: "2026-04-01", amount: 450, currency: "BOB", status: "refunded" },
];

const PAYMENT_METHODS = [
  { id: "pm-1", kind: "card", label: "Visa", last4: "4242", expiry: "08/27", balanceAmount: null, balanceCurrency: null, isDefault: true },
  { id: "pm-2", kind: "card", label: "Mastercard", last4: "5318", expiry: "11/26", balanceAmount: null, balanceCurrency: null, isDefault: false },
  { id: "pm-3", kind: "paypal", label: "PayPal", last4: null, expiry: null, balanceAmount: null, balanceCurrency: null, isDefault: false },
  { id: "pm-4", kind: "wallet", label: "Wallet FlyAlways", last4: null, expiry: null, balanceAmount: 420, balanceCurrency: "BOB", isDefault: false },
];

const FAVORITES = [
  { id: "fav-1", mode: "air", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "La Paz", destinationCode: "LPB", fromPriceAmount: 640, fromPriceCurrency: "BOB" },
  { id: "fav-2", mode: "bus", originCity: "La Paz", originCode: "LPB", destinationCity: "Copacabana", destinationCode: "COPA", fromPriceAmount: 45, fromPriceCurrency: "BOB" },
  { id: "fav-3", mode: "train", originCity: "Oruro", originCode: "ORU", destinationCity: "Uyuni", destinationCode: "UYU", fromPriceAmount: 160, fromPriceCurrency: "BOB" },
];

const NOTIFICATIONS = [
  { id: "n-1", title: "Reserva confirmada", body: "Tu reserva VL-7K2A (Santa Cruz → La Paz) está confirmada. ¡Buen viaje!", channel: "email", category: "booking", createdAt: "2026-06-27T13:55:00", read: false, href: "/perfil" },
  { id: "n-2", title: "Tu vuelo está en ruta", body: "El vuelo Santa Cruz → La Paz despegó. Sigue su recorrido en tiempo real.", channel: "push", category: "trip", createdAt: "2026-06-27T08:35:00", read: false, href: "/seguimiento/VL-7K2A" },
  { id: "n-3", title: "Recordatorio de embarque", body: "Tu bus a Copacabana (VL-8QP1) sale hoy 07:30. Llega 30 min antes.", channel: "whatsapp", category: "trip", createdAt: "2026-06-27T17:30:00", read: false, href: "/seguimiento/VL-8QP1" },
  { id: "n-4", title: "2.º pasajero al 50%", body: "Usa el código VUELA2X1 en vuelos seleccionados. Válido hasta el 30/06.", channel: "email", category: "promo", createdAt: "2026-06-26T10:00:00", read: true, href: "/buscar?mode=air" },
  { id: "n-5", title: "Check-in abierto", body: "Ya puedes hacer el check-in del tren Oruro → Uyuni.", channel: "sms", category: "trip", createdAt: "2026-06-26T14:00:00", read: true, href: "/seguimiento/VL-3M9X" },
  { id: "n-6", title: "Factura disponible", body: "La factura INV-2026-0007 ya está disponible para descargar.", channel: "email", category: "payment", createdAt: "2026-06-20T09:00:00", read: true, href: "/perfil" },
  { id: "n-7", title: "Nuevo inicio de sesión", body: "Detectamos un acceso a tu cuenta desde un nuevo dispositivo.", channel: "push", category: "account", createdAt: "2026-06-25T22:10:00", read: true, href: null },
  { id: "n-8", title: "15% en rutas de tren", body: "Con ANDES15 ahorras en tus viajes ferroviarios. Hasta el 31/07.", channel: "whatsapp", category: "promo", createdAt: "2026-06-24T11:00:00", read: true, href: "/buscar?mode=train" },
];

const PREFERENCES = {
  id: "default",
  email: "maria.gonzalez@example.com",
  phone: "+591 71234567",
  whatsapp: "+591 71234567",
  categories: [
    { category: "booking", channels: { email: true, sms: true, push: true, whatsapp: true } },
    { category: "trip", channels: { email: false, sms: true, push: true, whatsapp: true } },
    { category: "promo", channels: { email: true, sms: false, push: false, whatsapp: true } },
    { category: "payment", channels: { email: true, sms: false, push: true, whatsapp: false } },
    { category: "account", channels: { email: true, sms: true, push: true, whatsapp: false } },
  ],
};

const TRACKINGS = [
  { reference: "VL-7K2A", mode: "air", operatorName: "Boliviana de Aviación", operatorMark: "BoA", operatorColor: "#0a2d6e", vehicleName: "Boeing 737-800", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "La Paz", destinationCode: "LPB", status: "in_transit", progressPct: 42, departAt: "2026-07-03T08:30:00", etaAt: "2026-07-03T09:35:00", distanceTotalKm: 560, speedKmh: 720, path: [{ x: 5, y: 46 }, { x: 17, y: 38 }, { x: 30, y: 30 }, { x: 45, y: 24 }, { x: 60, y: 22 }, { x: 74, y: 25 }, { x: 86, y: 32 }, { x: 95, y: 41 }], waypoints: [{ id: "w1", label: "Despegue VVI", atPct: 4 }, { id: "w2", label: "Altitud de crucero", atPct: 38 }, { id: "w3", label: "Inicio de descenso", atPct: 84 }] },
  { reference: "VL-3M9X", mode: "train", operatorName: "Ferroviaria Andina", operatorMark: "FA", operatorColor: "#0f9d8f", vehicleName: "Wara Wara del Sur", originCity: "Oruro", originCode: "ORU", destinationCity: "Uyuni", destinationCode: "UYU", status: "in_transit", progressPct: 58, departAt: "2026-07-15T14:00:00", etaAt: "2026-07-15T21:10:00", distanceTotalKm: 310, speedKmh: 45, path: [{ x: 6, y: 40 }, { x: 18, y: 34 }, { x: 28, y: 42 }, { x: 40, y: 30 }, { x: 52, y: 38 }, { x: 63, y: 26 }, { x: 76, y: 34 }, { x: 93, y: 24 }], waypoints: [{ id: "w1", label: "Challapata", atPct: 28 }, { id: "w2", label: "Río Mulato", atPct: 68 }] },
  { reference: "VL-8QP1", mode: "bus", operatorName: "Trans Copacabana", operatorMark: "TC", operatorColor: "#c8102e", vehicleName: "Volvo 9800 DD", originCity: "La Paz", originCode: "LPB", destinationCity: "Copacabana", destinationCode: "COPA", status: "boarding", progressPct: 0, departAt: "2026-08-02T07:30:00", etaAt: "2026-08-02T11:00:00", distanceTotalKm: 155, speedKmh: 70, path: [{ x: 5, y: 30 }, { x: 20, y: 28 }, { x: 35, y: 33 }, { x: 50, y: 30 }, { x: 65, y: 35 }, { x: 80, y: 30 }, { x: 95, y: 33 }], waypoints: [{ id: "w1", label: "El Alto", atPct: 12 }, { id: "w2", label: "Estrecho de Tiquina", atPct: 70 }] },
];

async function main() {
  await prisma.webBookingRecord.deleteMany({});
  await prisma.webInvoice.deleteMany({});
  await prisma.webPaymentMethod.deleteMany({});
  await prisma.webFavoriteRoute.deleteMany({});
  await prisma.webNotification.deleteMany({});
  await prisma.webTripTracking.deleteMany({});

  await prisma.webAccount.upsert({
    where: { id: "me" },
    create: { id: "me", fullName: "María González", email: "maria.gonzalez@example.com", initials: "MG", memberSince: "2024-02-12", tier: "Gold", points: 12450 },
    update: { fullName: "María González", email: "maria.gonzalez@example.com", initials: "MG", memberSince: "2024-02-12", tier: "Gold", points: 12450 },
  });
  await prisma.webBookingRecord.createMany({ data: BOOKINGS.map((b, i) => ({ ...b, sort: i })) });
  await prisma.webInvoice.createMany({ data: INVOICES.map((v, i) => ({ ...v, sort: i })) });
  await prisma.webPaymentMethod.createMany({ data: PAYMENT_METHODS.map((m, i) => ({ ...m, sort: i })) });
  await prisma.webFavoriteRoute.createMany({ data: FAVORITES.map((f, i) => ({ ...f, sort: i })) });
  await prisma.webNotification.createMany({ data: NOTIFICATIONS.map((n, i) => ({ ...n, sort: i })) });
  await prisma.webNotificationPreference.upsert({ where: { id: "default" }, create: PREFERENCES, update: PREFERENCES });
  for (const t of TRACKINGS) {
    await prisma.webTripTracking.upsert({ where: { reference: t.reference }, create: t, update: t });
  }
  console.log(`Seed web-account OK → bookings=${BOOKINGS.length} invoices=${INVOICES.length} notifications=${NOTIFICATIONS.length} trackings=${TRACKINGS.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
