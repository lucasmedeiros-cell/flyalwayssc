import type { TravelPackage } from "@vialta/types";

const bob = (amount: number) => ({ amount, currency: "BOB" as const });

export const MOCK_PACKAGES: TravelPackage[] = [
  { id: "pk1", code: "PKG-501", name: "Crucero Caribe 7 noches", type: "cruise", destination: "Caribe", durationDays: 8, price: bob(9800), providerName: "Royal Caribbean", includes: ["Cabina balcón", "Pensión completa", "Espectáculos"], status: "active", soldCount: 24, description: "Crucero por el Caribe con escalas en Cozumel y Roatán.", createdAt: "2026-03-01T10:00:00Z" },
  { id: "pk2", code: "PKG-502", name: "Cancún Todo Incluido 5★", type: "hotel", destination: "Cancún", durationDays: 6, price: bob(8400), providerName: "Riu Hotels", includes: ["All inclusive", "Vista al mar", "Spa"], status: "active", soldCount: 41, createdAt: "2026-02-15T10:00:00Z" },
  { id: "pk3", code: "PKG-503", name: "Tour Salar de Uyuni 3D/2N", type: "tour", destination: "Uyuni", durationDays: 3, price: bob(2200), providerName: "Andes Expeditions", includes: ["Guía", "Hospedaje", "Comidas"], status: "active", soldCount: 67, createdAt: "2026-01-10T10:00:00Z" },
  { id: "pk4", code: "PKG-504", name: "Excursión Isla del Sol", type: "excursion", destination: "Lago Titicaca", durationDays: 1, price: bob(450), providerName: "Titicaca Tours", includes: ["Transporte", "Almuerzo", "Guía"], status: "active", soldCount: 88, createdAt: "2026-01-20T10:00:00Z" },
  { id: "pk5", code: "PKG-505", name: "Traslado VIP aeropuerto VVI", type: "transfer", destination: "Santa Cruz", durationDays: 1, price: bob(180), providerName: "Trans Oriente", includes: ["Vehículo privado", "Chofer bilingüe"], status: "active", soldCount: 132, createdAt: "2026-02-01T10:00:00Z" },
  { id: "pk6", code: "PKG-506", name: "Seguro de viaje internacional", type: "insurance", destination: "Internacional", durationDays: 30, price: bob(420), providerName: "Assist Card", includes: ["Cobertura médica USD 60k", "Equipaje", "Cancelación"], status: "active", soldCount: 210, createdAt: "2026-01-05T10:00:00Z" },
  { id: "pk7", code: "PKG-507", name: "Alquiler de auto Miami", type: "vehicle", destination: "Miami", durationDays: 7, price: bob(2900), providerName: "Hertz", includes: ["SUV", "Seguro", "GPS"], status: "draft", soldCount: 0, createdAt: "2026-06-20T10:00:00Z" },
  { id: "pk8", code: "PKG-508", name: "Europa Clásica 12 días", type: "tour", destination: "Europa", durationDays: 12, price: bob(24500), providerName: "Europamundo", includes: ["8 ciudades", "Hoteles 4★", "Bus turístico"], status: "active", soldCount: 19, createdAt: "2026-02-28T10:00:00Z" },
  { id: "pk9", code: "PKG-509", name: "Buenos Aires City Break", type: "hotel", destination: "Buenos Aires", durationDays: 4, price: bob(4600), providerName: "Meliá", includes: ["Hotel céntrico", "Desayuno", "City tour"], status: "inactive", soldCount: 12, createdAt: "2025-11-10T10:00:00Z" },
];
