/**
 * Seed del catálogo WEB (lugares + operadores) en Postgres (bilbo).
 * Idempotente (upsert por id). No toca el dominio CRM. Datos de Bolivia +
 * destinos internacionales de alta demanda. Ejecuta:
 *   DATABASE_URL=...  npx ts-node prisma/seed-web.ts
 */
import { PrismaClient, TransportMode } from "@prisma/client";

const prisma = new PrismaClient();

type RawPlace = {
  id: string; code: string; name: string; city: string; country: string;
  countryCode: string; kind: string; modes: TransportMode[]; lat?: number; lng?: number;
};

const PLACES: RawPlace[] = [
  { id: "lpb", code: "LPB", name: "El Alto Intl.", city: "La Paz", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -16.5133, lng: -68.1925 },
  { id: "vvi", code: "VVI", name: "Viru Viru", city: "Santa Cruz", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "TRAIN", "PRIVATE"], lat: -17.6448, lng: -63.1353 },
  { id: "cbb", code: "CBB", name: "Jorge Wilstermann", city: "Cochabamba", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -17.4211, lng: -66.1771 },
  { id: "sre", code: "SRE", name: "Alcantarí", city: "Sucre", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -19.2470, lng: -65.1517 },
  { id: "tja", code: "TJA", name: "Capitán Oriel Lea Plaza", city: "Tarija", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -21.5557, lng: -64.7013 },
  { id: "uyu", code: "UYU", name: "Joya Andina", city: "Uyuni", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "TRAIN", "PRIVATE"], lat: -20.4463, lng: -66.8483 },
  { id: "rbq", code: "RBQ", name: "Rurrenabaque", city: "Rurrenabaque", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "PRIVATE"], lat: -14.4279, lng: -67.4981 },
  { id: "poi", code: "POI", name: "Capitán Nicolás Rojas", city: "Potosí", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -19.5431, lng: -65.7237 },
  { id: "tdd", code: "TDD", name: "Tte. Jorge Henrich", city: "Trinidad", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -14.8186, lng: -64.9181 },
  { id: "oru", code: "ORU", name: "Oruro", city: "Oruro", country: "Bolivia", countryCode: "BO", kind: "bus_terminal", modes: ["BUS", "TRAIN", "PRIVATE"], lat: -17.9647, lng: -67.0744 },
  { id: "vlm", code: "VLM", name: "Villazón", city: "Villazón", country: "Bolivia", countryCode: "BO", kind: "train_station", modes: ["TRAIN", "BUS", "PRIVATE"], lat: -22.0866, lng: -65.5942 },
  { id: "qrr", code: "QRR", name: "Puerto Quijarro", city: "Puerto Quijarro", country: "Bolivia", countryCode: "BO", kind: "train_station", modes: ["TRAIN", "BUS"], lat: -17.7836, lng: -57.7672 },
  { id: "copa", code: "COPA", name: "Copacabana", city: "Copacabana", country: "Bolivia", countryCode: "BO", kind: "bus_terminal", modes: ["BUS", "PRIVATE"], lat: -16.1667, lng: -69.0864 },
  { id: "lim", code: "LIM", name: "Jorge Chávez", city: "Lima", country: "Perú", countryCode: "PE", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -12.0219, lng: -77.1143 },
  { id: "eze", code: "EZE", name: "Ezeiza", city: "Buenos Aires", country: "Argentina", countryCode: "AR", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -34.8222, lng: -58.5358 },
  { id: "gru", code: "GRU", name: "Guarulhos", city: "São Paulo", country: "Brasil", countryCode: "BR", kind: "airport", modes: ["AIR", "PRIVATE"], lat: -23.4356, lng: -46.4731 },
  { id: "scl", code: "SCL", name: "Santiago", city: "Santiago", country: "Chile", countryCode: "CL", kind: "airport", modes: ["AIR", "BUS", "PRIVATE"], lat: -33.3930, lng: -70.7858 },
  { id: "bog", code: "BOG", name: "El Dorado", city: "Bogotá", country: "Colombia", countryCode: "CO", kind: "airport", modes: ["AIR", "PRIVATE"], lat: 4.7016, lng: -74.1469 },
  { id: "pty", code: "PTY", name: "Tocumen", city: "Panamá", country: "Panamá", countryCode: "PA", kind: "airport", modes: ["AIR", "PRIVATE"], lat: 9.0714, lng: -79.3835 },
  { id: "mia", code: "MIA", name: "Miami Intl.", city: "Miami", country: "EE. UU.", countryCode: "US", kind: "airport", modes: ["AIR", "PRIVATE"], lat: 25.7959, lng: -80.2870 },
  { id: "mad", code: "MAD", name: "Barajas", city: "Madrid", country: "España", countryCode: "ES", kind: "airport", modes: ["AIR", "PRIVATE"], lat: 40.4719, lng: -3.5626 },
];

type RawOp = {
  id: string; name: string; slug: string; modes: TransportMode[]; logoMark: string;
  brandColor: string; rating: number; reviewsCount: number; countryCode: string;
};

const OPERATORS: RawOp[] = [
  { id: "op-air-boa", name: "Boliviana de Aviación", slug: "boa", modes: ["AIR"], logoMark: "BoA", brandColor: "#0a2d6e", rating: 4.5, reviewsCount: 18420, countryCode: "BO" },
  { id: "op-air-ecojet", name: "EcoJet", slug: "ecojet", modes: ["AIR"], logoMark: "EJ", brandColor: "#00963a", rating: 4.1, reviewsCount: 5120, countryCode: "BO" },
  { id: "op-air-latam", name: "LATAM Airlines", slug: "latam", modes: ["AIR"], logoMark: "LA", brandColor: "#1b0088", rating: 4.6, reviewsCount: 41230, countryCode: "CL" },
  { id: "op-air-avianca", name: "Avianca", slug: "avianca", modes: ["AIR"], logoMark: "AV", brandColor: "#d31145", rating: 4.4, reviewsCount: 28760, countryCode: "CO" },
  { id: "op-air-copa", name: "Copa Airlines", slug: "copa", modes: ["AIR"], logoMark: "CM", brandColor: "#003da5", rating: 4.7, reviewsCount: 33980, countryCode: "PA" },
  { id: "op-bus-copacabana", name: "Trans Copacabana", slug: "trans-copacabana", modes: ["BUS"], logoMark: "TC", brandColor: "#c8102e", rating: 4.3, reviewsCount: 14044, countryCode: "BO" },
  { id: "op-bus-eldorado", name: "El Dorado", slug: "el-dorado", modes: ["BUS"], logoMark: "ED", brandColor: "#d4a017", rating: 4.2, reviewsCount: 9651, countryCode: "BO" },
  { id: "op-bus-bolivar", name: "Flota Bolívar", slug: "flota-bolivar", modes: ["BUS"], logoMark: "FB", brandColor: "#1f6f3f", rating: 4.0, reviewsCount: 7120, countryCode: "BO" },
  { id: "op-bus-aroma", name: "Trans Aroma", slug: "trans-aroma", modes: ["BUS"], logoMark: "TA", brandColor: "#8b5cf6", rating: 4.1, reviewsCount: 4980, countryCode: "BO" },
  { id: "op-bus-cosmos", name: "Cosmos", slug: "cosmos", modes: ["BUS"], logoMark: "CO", brandColor: "#0ea5e9", rating: 4.2, reviewsCount: 6210, countryCode: "BO" },
  { id: "op-train-fca", name: "Ferroviaria Andina (FCA)", slug: "ferroviaria-andina", modes: ["TRAIN"], logoMark: "FA", brandColor: "#0f9d8f", rating: 4.6, reviewsCount: 6890, countryCode: "BO" },
  { id: "op-train-oriental", name: "Ferroviaria Oriental", slug: "ferroviaria-oriental", modes: ["TRAIN"], logoMark: "FO", brandColor: "#1d4ed8", rating: 4.4, reviewsCount: 5230, countryCode: "BO" },
  { id: "op-train-expresosur", name: "Expreso del Sur", slug: "expreso-del-sur", modes: ["TRAIN"], logoMark: "ES", brandColor: "#b45309", rating: 4.5, reviewsCount: 4470, countryCode: "BO" },
  { id: "op-priv-andes", name: "Andes Privado", slug: "andes-privado", modes: ["PRIVATE"], logoMark: "AP", brandColor: "#5847f0", rating: 4.9, reviewsCount: 1820, countryCode: "BO" },
  { id: "op-priv-uyuni", name: "Uyuni VIP Transfer", slug: "uyuni-vip", modes: ["PRIVATE"], logoMark: "UV", brandColor: "#0d9488", rating: 4.8, reviewsCount: 1334, countryCode: "BO" },
];

async function main() {
  // Reset del catálogo web (placeholders previos). NO toca el dominio CRM.
  await prisma.seat.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.passenger.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.company.deleteMany({});

  for (const p of PLACES) {
    const { modes: _modes, ...data } = p;
    await prisma.place.upsert({ where: { id: p.id }, create: data, update: data });
  }
  for (const o of OPERATORS) {
    const data = {
      id: o.id, name: o.name, slug: o.slug, modes: o.modes, logoMark: o.logoMark,
      brandColor: o.brandColor, rating: o.rating, countryCode: o.countryCode,
    };
    await prisma.company.upsert({ where: { id: o.id }, create: data, update: data });
  }
  const places = await prisma.place.count();
  const companies = await prisma.company.count();
  console.log(`Seed web OK → places=${places} companies=${companies}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
