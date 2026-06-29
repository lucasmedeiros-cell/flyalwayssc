import { PrismaClient, TransportMode, TravelClass } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Lugares
  const lim = await prisma.place.upsert({
    where: { code: "LIM" },
    update: {},
    create: { code: "LIM", name: "Lima", city: "Lima", country: "Perú", countryCode: "PE", kind: "airport" },
  });
  const cuz = await prisma.place.upsert({
    where: { code: "CUZ" },
    update: {},
    create: { code: "CUZ", name: "Cusco", city: "Cusco", country: "Perú", countryCode: "PE", kind: "airport" },
  });

  // Empresa operadora
  const andina = await prisma.company.upsert({
    where: { slug: "andina-air" },
    update: {},
    create: {
      name: "Andina Air",
      slug: "andina-air",
      modes: [TransportMode.AIR],
      logoMark: "AA",
      brandColor: "#6a5cff",
      rating: 4.6,
      countryCode: "PE",
    },
  });

  // Ruta + vehículo + viaje
  const route = await prisma.route.create({
    data: {
      companyId: andina.id,
      mode: TransportMode.AIR,
      originId: lim.id,
      destinationId: cuz.id,
    },
  });

  const vehicle = await prisma.vehicle.create({
    data: { companyId: andina.id, mode: TransportMode.AIR, name: "Airbus A320neo", capacity: 180 },
  });

  await prisma.trip.create({
    data: {
      companyId: andina.id,
      routeId: route.id,
      vehicleId: vehicle.id,
      mode: TransportMode.AIR,
      travelClass: TravelClass.ECONOMY,
      departAt: new Date("2026-07-01T08:30:00Z"),
      arriveAt: new Date("2026-07-01T10:05:00Z"),
      durationMin: 95,
      stops: 0,
      priceAmount: 219.9,
      priceCurrency: "PEN",
      seatsTotal: 180,
      seatsAvailable: 42,
      baggageIncluded: true,
      amenities: ["wifi", "power", "ac", "meal"],
    },
  });

  console.log("Seed completado: 2 lugares, 1 empresa, 1 ruta, 1 viaje.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
