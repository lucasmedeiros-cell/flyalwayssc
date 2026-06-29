import type { Place, TransportMode } from "@vialta/types";

/**
 * Catálogo de lugares — Bolivia + destinos internacionales más demandados.
 * Códigos: IATA para aeropuertos; slug interno para terminales/estaciones.
 * Cada lugar declara para qué modos funciona como terminal.
 */
interface RawPlace extends Place {
  modes: TransportMode[];
}

export const PLACES: RawPlace[] = [
  // --- Bolivia ---
  { id: "lpb", code: "LPB", name: "El Alto Intl.", city: "La Paz", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "vvi", code: "VVI", name: "Viru Viru", city: "Santa Cruz", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "train", "private"] },
  { id: "cbb", code: "CBB", name: "Jorge Wilstermann", city: "Cochabamba", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "sre", code: "SRE", name: "Alcantarí", city: "Sucre", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "tja", code: "TJA", name: "Capitán Oriel Lea Plaza", city: "Tarija", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "uyu", code: "UYU", name: "Joya Andina", city: "Uyuni", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "train", "private"] },
  { id: "rbq", code: "RBQ", name: "Rurrenabaque", city: "Rurrenabaque", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "private"] },
  { id: "poi", code: "POI", name: "Capitán Nicolás Rojas", city: "Potosí", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "tdd", code: "TDD", name: "Tte. Jorge Henrich", city: "Trinidad", country: "Bolivia", countryCode: "BO", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "oru", code: "ORU", name: "Oruro", city: "Oruro", country: "Bolivia", countryCode: "BO", kind: "bus_terminal", modes: ["bus", "train", "private"] },
  { id: "vlm", code: "VLM", name: "Villazón", city: "Villazón", country: "Bolivia", countryCode: "BO", kind: "train_station", modes: ["train", "bus", "private"] },
  { id: "qrr", code: "QRR", name: "Puerto Quijarro", city: "Puerto Quijarro", country: "Bolivia", countryCode: "BO", kind: "train_station", modes: ["train", "bus"] },
  { id: "copa", code: "COPA", name: "Copacabana", city: "Copacabana", country: "Bolivia", countryCode: "BO", kind: "bus_terminal", modes: ["bus", "private"] },

  // --- Internacional (alta demanda desde Bolivia) ---
  { id: "lim", code: "LIM", name: "Jorge Chávez", city: "Lima", country: "Perú", countryCode: "PE", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "eze", code: "EZE", name: "Ezeiza", city: "Buenos Aires", country: "Argentina", countryCode: "AR", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "gru", code: "GRU", name: "Guarulhos", city: "São Paulo", country: "Brasil", countryCode: "BR", kind: "airport", modes: ["air", "private"] },
  { id: "scl", code: "SCL", name: "Santiago", city: "Santiago", country: "Chile", countryCode: "CL", kind: "airport", modes: ["air", "bus", "private"] },
  { id: "bog", code: "BOG", name: "El Dorado", city: "Bogotá", country: "Colombia", countryCode: "CO", kind: "airport", modes: ["air", "private"] },
  { id: "pty", code: "PTY", name: "Tocumen", city: "Panamá", country: "Panamá", countryCode: "PA", kind: "airport", modes: ["air", "private"] },
  { id: "mia", code: "MIA", name: "Miami Intl.", city: "Miami", country: "EE. UU.", countryCode: "US", kind: "airport", modes: ["air", "private"] },
  { id: "mad", code: "MAD", name: "Barajas", city: "Madrid", country: "España", countryCode: "ES", kind: "airport", modes: ["air", "private"] },
];

export function placesForMode(mode: TransportMode): Place[] {
  return PLACES.filter((p) => p.modes.includes(mode)).map(stripModes);
}

export function findPlace(id: string): Place | undefined {
  const p = PLACES.find((x) => x.id === id);
  return p ? stripModes(p) : undefined;
}

function stripModes(p: RawPlace): Place {
  const { modes: _modes, ...rest } = p;
  void _modes;
  return rest;
}
