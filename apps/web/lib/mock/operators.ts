import type { Operator, TransportMode } from "@vialta/types";

/**
 * Operadores que operan desde/hacia Bolivia. Los NOMBRES son reales (datos
 * públicos); las marcas visuales son monogramas generados con el color
 * aproximado de cada empresa (LogoBadge) — NO se usan logotipos oficiales.
 * Para mostrar el logo oficial, sustituir `logoMark` por el asset en su slot.
 */
export const OPERATORS: Operator[] = [
  // Aéreo
  { id: "op-air-boa", name: "Boliviana de Aviación", slug: "boa", modes: ["air"], logoMark: "BoA", brandColor: "#0a2d6e", rating: 4.5, reviewsCount: 18420, countryCode: "BO" },
  { id: "op-air-ecojet", name: "EcoJet", slug: "ecojet", modes: ["air"], logoMark: "EJ", brandColor: "#00963a", rating: 4.1, reviewsCount: 5120, countryCode: "BO" },
  { id: "op-air-latam", name: "LATAM Airlines", slug: "latam", modes: ["air"], logoMark: "LA", brandColor: "#1b0088", rating: 4.6, reviewsCount: 41230, countryCode: "CL" },
  { id: "op-air-avianca", name: "Avianca", slug: "avianca", modes: ["air"], logoMark: "AV", brandColor: "#d31145", rating: 4.4, reviewsCount: 28760, countryCode: "CO" },
  { id: "op-air-copa", name: "Copa Airlines", slug: "copa", modes: ["air"], logoMark: "CM", brandColor: "#003da5", rating: 4.7, reviewsCount: 33980, countryCode: "PA" },

  // Bus
  { id: "op-bus-copacabana", name: "Trans Copacabana", slug: "trans-copacabana", modes: ["bus"], logoMark: "TC", brandColor: "#c8102e", rating: 4.3, reviewsCount: 14044, countryCode: "BO" },
  { id: "op-bus-eldorado", name: "El Dorado", slug: "el-dorado", modes: ["bus"], logoMark: "ED", brandColor: "#d4a017", rating: 4.2, reviewsCount: 9651, countryCode: "BO" },
  { id: "op-bus-bolivar", name: "Flota Bolívar", slug: "flota-bolivar", modes: ["bus"], logoMark: "FB", brandColor: "#1f6f3f", rating: 4.0, reviewsCount: 7120, countryCode: "BO" },
  { id: "op-bus-aroma", name: "Trans Aroma", slug: "trans-aroma", modes: ["bus"], logoMark: "TA", brandColor: "#8b5cf6", rating: 4.1, reviewsCount: 4980, countryCode: "BO" },
  { id: "op-bus-cosmos", name: "Cosmos", slug: "cosmos", modes: ["bus"], logoMark: "CO", brandColor: "#0ea5e9", rating: 4.2, reviewsCount: 6210, countryCode: "BO" },

  // Tren
  { id: "op-train-fca", name: "Ferroviaria Andina (FCA)", slug: "ferroviaria-andina", modes: ["train"], logoMark: "FA", brandColor: "#0f9d8f", rating: 4.6, reviewsCount: 6890, countryCode: "BO" },
  { id: "op-train-oriental", name: "Ferroviaria Oriental", slug: "ferroviaria-oriental", modes: ["train"], logoMark: "FO", brandColor: "#1d4ed8", rating: 4.4, reviewsCount: 5230, countryCode: "BO" },
  { id: "op-train-expresosur", name: "Expreso del Sur", slug: "expreso-del-sur", modes: ["train"], logoMark: "ES", brandColor: "#b45309", rating: 4.5, reviewsCount: 4470, countryCode: "BO" },

  // Flota privada
  { id: "op-priv-andes", name: "Andes Privado", slug: "andes-privado", modes: ["private"], logoMark: "AP", brandColor: "#5847f0", rating: 4.9, reviewsCount: 1820, countryCode: "BO" },
  { id: "op-priv-uyuni", name: "Uyuni VIP Transfer", slug: "uyuni-vip", modes: ["private"], logoMark: "UV", brandColor: "#0d9488", rating: 4.8, reviewsCount: 1334, countryCode: "BO" },
];

export function operatorsForMode(mode: TransportMode): Operator[] {
  return OPERATORS.filter((o) => o.modes.includes(mode));
}

export function findOperator(id: string): Operator | undefined {
  return OPERATORS.find((o) => o.id === id);
}
