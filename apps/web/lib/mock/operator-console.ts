import type { CurrencyCode, OperatorConsole } from "@vialta/types";

const CUR: CurrencyCode = "BOB";
const m = (amount: number) => ({ amount, currency: CUR });

/** Panel de demostración de una empresa multimodal boliviana (datos ficticios). */
export const OPERATOR_CONSOLE: OperatorConsole = {
  company: {
    id: "op-andino-bolivia",
    name: "Grupo Andino Bolivia",
    logoMark: "GA",
    brandColor: "#0a2d6e",
    modes: ["air", "bus", "train", "private"],
    rating: 4.7,
    countryCode: "BO",
  },

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
    {
      id: "r-1", mode: "air", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "La Paz", destinationCode: "LPB",
      frequency: "Diaria", durationMin: 65, stops: 0, active: true,
      pricing: [{ travelClass: "economy", price: m(640) }, { travelClass: "business", price: m(1400) }],
    },
    {
      id: "r-2", mode: "air", originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Cochabamba", destinationCode: "CBB",
      frequency: "Diaria", durationMin: 40, stops: 0, active: true,
      pricing: [{ travelClass: "economy", price: m(520) }, { travelClass: "business", price: m(1150) }],
    },
    {
      id: "r-3", mode: "bus", originCity: "La Paz", originCode: "LPB", destinationCity: "Cochabamba", destinationCode: "CBB",
      frequency: "Lun a Sáb", durationMin: 450, stops: 1, active: true,
      pricing: [{ travelClass: "standard", price: m(70) }, { travelClass: "executive", price: m(110) }, { travelClass: "vip", price: m(160) }],
    },
    {
      id: "r-4", mode: "train", originCity: "Oruro", originCode: "ORU", destinationCity: "Uyuni", destinationCode: "UYU",
      frequency: "4 días/semana", durationMin: 430, stops: 0, active: true,
      pricing: [{ travelClass: "standard", price: m(160) }, { travelClass: "first", price: m(320) }],
    },
    {
      id: "r-5", mode: "private", originCity: "La Paz", originCode: "LPB", destinationCity: "El Alto", destinationCode: "LPB",
      frequency: "Bajo demanda", durationMin: 45, stops: 0, active: true,
      pricing: [{ travelClass: "vip", price: m(450) }],
    },
    {
      id: "r-6", mode: "bus", originCity: "Cochabamba", originCode: "CBB", destinationCity: "Santa Cruz", destinationCode: "VVI",
      frequency: "Diaria", durationMin: 600, stops: 1, active: false,
      pricing: [{ travelClass: "executive", price: m(120) }],
    },
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
