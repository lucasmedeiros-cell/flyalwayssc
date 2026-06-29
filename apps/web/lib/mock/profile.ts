import type { Account, BookingRecord, CurrencyCode } from "@vialta/types";

const CUR: CurrencyCode = "BOB";
const money = (amount: number) => ({ amount, currency: CUR });

const rec = (r: Omit<BookingRecord, "total"> & { total: number }): BookingRecord => ({
  ...r,
  total: money(r.total),
});

/** Cuenta de demostración (datos ficticios) para el perfil. */
export const ACCOUNT: Account = {
  user: {
    id: "user-maria",
    fullName: "María González",
    email: "maria.gonzalez@example.com",
    initials: "MG",
    memberSince: "2024-02-12",
    tier: "Gold",
    points: 12450,
  },

  bookings: [
    // Próximos
    rec({
      id: "bk-1", reference: "VL-7K2A", status: "upcoming", mode: "air",
      operatorName: "Boliviana de Aviación", operatorMark: "BoA", operatorColor: "#0a2d6e",
      originCity: "Santa Cruz", originCode: "VVI", destinationCity: "La Paz", destinationCode: "LPB",
      departAt: "2026-07-03T08:30:00", arriveAt: "2026-07-03T09:35:00",
      travelClass: "economy", passengers: 2, seats: ["12A", "12B"], total: 1340, favorite: true,
    }),
    rec({
      id: "bk-2", reference: "VL-3M9X", status: "upcoming", mode: "train",
      operatorName: "Ferroviaria Andina", operatorMark: "FA", operatorColor: "#0f9d8f",
      originCity: "Oruro", originCode: "ORU", destinationCity: "Uyuni", destinationCode: "UYU",
      departAt: "2026-07-15T14:00:00", arriveAt: "2026-07-15T21:10:00",
      travelClass: "first", passengers: 2, seats: ["4A", "4B"], total: 640, favorite: false,
    }),
    rec({
      id: "bk-3", reference: "VL-8QP1", status: "upcoming", mode: "bus",
      operatorName: "Trans Copacabana", operatorMark: "TC", operatorColor: "#c8102e",
      originCity: "La Paz", originCode: "LPB", destinationCity: "Copacabana", destinationCode: "COPA",
      departAt: "2026-08-02T07:30:00", arriveAt: "2026-08-02T11:00:00",
      travelClass: "executive", passengers: 1, seats: ["3A"], total: 95, favorite: false,
    }),

    // Completados
    rec({
      id: "bk-4", reference: "VL-1A4D", status: "completed", mode: "air",
      operatorName: "Boliviana de Aviación", operatorMark: "BoA", operatorColor: "#0a2d6e",
      originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Cochabamba", destinationCode: "CBB",
      departAt: "2026-05-10T06:15:00", arriveAt: "2026-05-10T06:55:00",
      travelClass: "economy", passengers: 1, seats: ["18C"], total: 520, favorite: false,
    }),
    rec({
      id: "bk-5", reference: "VL-5T2K", status: "completed", mode: "bus",
      operatorName: "El Dorado", operatorMark: "ED", operatorColor: "#d4a017",
      originCity: "Cochabamba", originCode: "CBB", destinationCity: "La Paz", destinationCode: "LPB",
      departAt: "2026-03-22T22:00:00", arriveAt: "2026-03-23T05:30:00",
      travelClass: "vip", passengers: 2, seats: ["1A", "1B"], total: 340, favorite: true,
    }),
    rec({
      id: "bk-6", reference: "VL-9R0M", status: "completed", mode: "air",
      operatorName: "Boliviana de Aviación", operatorMark: "BoA", operatorColor: "#0a2d6e",
      originCity: "La Paz", originCode: "LPB", destinationCity: "Rurrenabaque", destinationCode: "RBQ",
      departAt: "2026-01-18T09:30:00", arriveAt: "2026-01-18T10:15:00",
      travelClass: "economy", passengers: 2, seats: ["6C", "6D"], total: 980, favorite: false,
    }),

    // Cancelado
    rec({
      id: "bk-7", reference: "VL-2C7H", status: "cancelled", mode: "private",
      operatorName: "Andes Privado", operatorMark: "AP", operatorColor: "#5847f0",
      originCity: "La Paz", originCode: "LPB", destinationCity: "El Alto", destinationCode: "LPB",
      departAt: "2026-04-05T05:00:00", arriveAt: "2026-04-05T05:45:00",
      travelClass: "vip", passengers: 3, seats: ["A", "B", "C"], total: 450, favorite: false,
    }),
  ],

  invoices: [
    { id: "inv-7", number: "INV-2026-0007", bookingReference: "VL-7K2A", date: "2026-06-20", amount: money(1340), status: "paid" },
    { id: "inv-6", number: "INV-2026-0006", bookingReference: "VL-3M9X", date: "2026-06-18", amount: money(640), status: "paid" },
    { id: "inv-5", number: "INV-2026-0005", bookingReference: "VL-8QP1", date: "2026-06-25", amount: money(95), status: "paid" },
    { id: "inv-4", number: "INV-2026-0004", bookingReference: "VL-1A4D", date: "2026-05-08", amount: money(520), status: "paid" },
    { id: "inv-3", number: "INV-2026-0003", bookingReference: "VL-5T2K", date: "2026-03-20", amount: money(340), status: "paid" },
    { id: "inv-2", number: "INV-2026-0002", bookingReference: "VL-9R0M", date: "2026-01-15", amount: money(980), status: "paid" },
    { id: "inv-1", number: "INV-2026-0001", bookingReference: "VL-2C7H", date: "2026-04-01", amount: money(450), status: "refunded" },
  ],

  paymentMethods: [
    { id: "pm-1", kind: "card", label: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
    { id: "pm-2", kind: "card", label: "Mastercard", last4: "5318", expiry: "11/26", isDefault: false },
    { id: "pm-3", kind: "paypal", label: "PayPal", isDefault: false },
    { id: "pm-4", kind: "wallet", label: "Wallet FlyAlways", balance: money(420), isDefault: false },
  ],

  favorites: [
    { id: "fav-1", mode: "air", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "La Paz", destinationCode: "LPB", fromPrice: money(640) },
    { id: "fav-2", mode: "bus", originCity: "La Paz", originCode: "LPB", destinationCity: "Copacabana", destinationCode: "COPA", fromPrice: money(45) },
    { id: "fav-3", mode: "train", originCity: "Oruro", originCode: "ORU", destinationCity: "Uyuni", destinationCode: "UYU", fromPrice: money(160) },
  ],
};
