import type { DESTINATION_IMAGES } from "@/lib/images";

/**
 * Catálogo de destinos (fuente de verdad, sin "use client") — lo consumen el
 * carrusel de destinos, el detalle de paquetes y las ofertas. Cada destino es
 * también un "paquete" (vuelo + experiencia); el `slug` lo enlaza con
 * /paquetes/[slug].
 */
export type Destination = {
  /** Slug estable para la ruta /paquetes/[slug]. */
  slug: string;
  /** Clave del catálogo DESTINATION_IMAGES (garantiza foto real existente). */
  imageKey: keyof typeof DESTINATION_IMAGES | string;
  name: string;
  region: string;
  category: string;
  badge: string;
  rating: number;
  duration: string;
  priceUSD: number;
  /** Frase emocional, máximo 2 líneas. */
  tagline: string;
  mode: "air" | "bus" | "train" | "private";
};

/** Destinos curados de Bolivia — aventura, naturaleza, cultura y patrimonio. */
export const NATIONAL: Destination[] = [
  {
    slug: "salar-de-uyuni",
    imageKey: "Uyuni",
    name: "Salar de Uyuni",
    region: "Potosí, Bolivia",
    category: "Naturaleza",
    badge: "Maravilla Natural",
    rating: 5,
    duration: "3 días • Todo incluido",
    priceUSD: 799,
    tagline: "El espejo más grande del mundo te espera: camina sobre el cielo al amanecer.",
    mode: "air",
  },
  {
    slug: "madidi-rurrenabaque",
    imageKey: "Rurrenabaque",
    name: "Madidi & Rurrenabaque",
    region: "Amazonía, Beni",
    category: "Aventura",
    badge: "Reserva de la Biósfera",
    rating: 5,
    duration: "4 días • Guía experto",
    priceUSD: 890,
    tagline: "Adéntrate en la selva más biodiversa del planeta y despierta con el rugido del Madidi.",
    mode: "air",
  },
  {
    slug: "misiones-chiquitania",
    imageKey: "Santa Cruz",
    name: "Misiones de Chiquitania",
    region: "Santa Cruz, Bolivia",
    category: "Cultura",
    badge: "Patrimonio Mundial UNESCO",
    rating: 5,
    duration: "5 días • Todo incluido",
    priceUSD: 799,
    tagline: "Recorre las iglesias jesuíticas vivas de la Chiquitania, joyas talladas en la selva.",
    mode: "air",
  },
  {
    slug: "lago-titicaca",
    imageKey: "Copacabana",
    name: "Lago Titicaca",
    region: "La Paz, Bolivia",
    category: "Naturaleza",
    badge: "Lago Sagrado de los Andes",
    rating: 5,
    duration: "2 días • Media pensión",
    priceUSD: 349,
    tagline: "Navega el lago navegable más alto del mundo hacia la mítica Isla del Sol.",
    mode: "bus",
  },
  {
    slug: "sucre-colonial",
    imageKey: "Sucre",
    name: "Sucre Colonial",
    region: "Chuquisaca, Bolivia",
    category: "Cultura",
    badge: "Patrimonio Mundial UNESCO",
    rating: 5,
    duration: "3 días • Todo incluido",
    priceUSD: 620,
    tagline: "Pierde el aliento entre iglesias blancas y calles empedradas de otro siglo.",
    mode: "air",
  },
  {
    slug: "la-paz-cordillera-real",
    imageKey: "La Paz",
    name: "La Paz & Cordillera Real",
    region: "La Paz, Bolivia",
    category: "Aventura",
    badge: "Techo de los Andes",
    rating: 5,
    duration: "3 días • Teleférico + city",
    priceUSD: 460,
    tagline: "Sube en teleférico sobre la ciudad más alta y roza los nevados de la Cordillera Real.",
    mode: "air",
  },
  {
    slug: "valles-de-tarija",
    imageKey: "Tarija",
    name: "Valles de Tarija",
    region: "Tarija, Bolivia",
    category: "Gastronomía",
    badge: "Ruta del Vino de Altura",
    rating: 5,
    duration: "3 días • Cata incluida",
    priceUSD: 540,
    tagline: "Brinda al sol con los vinos de mayor altitud del mundo entre viñedos infinitos.",
    mode: "air",
  },
  {
    slug: "cochabamba-valle-alto",
    imageKey: "Cochabamba",
    name: "Cochabamba & Valle Alto",
    region: "Cochabamba, Bolivia",
    category: "Gastronomía",
    badge: "Capital Gastronómica",
    rating: 5,
    duration: "2 días • Tour de sabores",
    priceUSD: 390,
    tagline: "Deléitate en el corazón culinario de Bolivia, bajo la mirada del Cristo de la Concordia.",
    mode: "air",
  },
];

/** Destinos internacionales — mismo tratamiento premium, fotografía real por ciudad. */
export const INTERNATIONAL: Destination[] = [
  {
    slug: "buenos-aires",
    imageKey: "Buenos Aires",
    name: "Buenos Aires",
    region: "Argentina",
    category: "Ciudad",
    badge: "La París de Sudamérica",
    rating: 5,
    duration: "5 días • Hotel + vuelos",
    priceUSD: 1290,
    tagline: "Tango, cafés centenarios y noches sin final en la capital más europea de Sudamérica.",
    mode: "air",
  },
  {
    slug: "rio-de-janeiro",
    imageKey: "Río de Janeiro",
    name: "Río de Janeiro",
    region: "Brasil",
    category: "Playa",
    badge: "Ciudad Maravillosa",
    rating: 5,
    duration: "6 días • Todo incluido",
    priceUSD: 1490,
    tagline: "Del Cristo Redentor a Copacabana: samba, playa y postales imposibles.",
    mode: "air",
  },
  {
    slug: "cancun",
    imageKey: "Cancún",
    name: "Cancún",
    region: "México",
    category: "Playa",
    badge: "Caribe Mexicano",
    rating: 5,
    duration: "7 días • All inclusive",
    priceUSD: 1690,
    tagline: "Arena blanca, cenotes turquesa y ruinas mayas frente a un mar imposiblemente azul.",
    mode: "air",
  },
  {
    slug: "lima",
    imageKey: "Lima",
    name: "Lima",
    region: "Perú",
    category: "Gastronomía",
    badge: "Capital Gastronómica",
    rating: 5,
    duration: "4 días • Media pensión",
    priceUSD: 890,
    tagline: "La mejor cocina del mundo frente al Pacífico, entre historia colonial y barrios de moda.",
    mode: "air",
  },
  {
    slug: "madrid",
    imageKey: "Madrid",
    name: "Madrid",
    region: "España",
    category: "Cultura",
    badge: "Corazón de Europa",
    rating: 5,
    duration: "7 días • Vuelos + hotel",
    priceUSD: 2190,
    tagline: "Arte, tapas y noches infinitas en la capital que nunca duerme.",
    mode: "air",
  },
  {
    slug: "punta-cana",
    imageKey: "Punta Cana",
    name: "Punta Cana",
    region: "Rep. Dominicana",
    category: "Playa",
    badge: "Paraíso Caribeño",
    rating: 5,
    duration: "7 días • All inclusive",
    priceUSD: 1790,
    tagline: "Palmeras, resorts de ensueño y el mar turquesa que solo verás en postales.",
    mode: "air",
  },
  {
    slug: "santiago",
    imageKey: "Santiago",
    name: "Santiago",
    region: "Chile",
    category: "Aventura",
    badge: "Andes & Viñas",
    rating: 5,
    duration: "5 días • Hotel + tours",
    priceUSD: 1090,
    tagline: "Rascacielos a los pies de los Andes y valles de vino a una hora de la ciudad.",
    mode: "air",
  },
  {
    slug: "sao-paulo",
    imageKey: "São Paulo",
    name: "São Paulo",
    region: "Brasil",
    category: "Ciudad",
    badge: "Metrópoli Vibrante",
    rating: 5,
    duration: "5 días • Hotel + vuelos",
    priceUSD: 1190,
    tagline: "La megaciudad que late 24/7: arte, gastronomía y una energía que no se apaga.",
    mode: "air",
  },
  {
    slug: "bogota",
    imageKey: "Bogotá",
    name: "Bogotá",
    region: "Colombia",
    category: "Cultura",
    badge: "Andes Colombianos",
    rating: 5,
    duration: "4 días • Media pensión",
    priceUSD: 950,
    tagline: "Barrios coloridos, café de altura y montañas que abrazan la ciudad.",
    mode: "air",
  },
  {
    slug: "miami",
    imageKey: "Miami",
    name: "Miami",
    region: "Estados Unidos",
    category: "Playa",
    badge: "Sol & Glamour",
    rating: 5,
    duration: "6 días • Hotel + vuelos",
    priceUSD: 2290,
    tagline: "Art déco, playas de neón y noches de lujo en la puerta de las Américas.",
    mode: "air",
  },
];

/** Todos los destinos en una sola lista (para lookups por slug). */
export const ALL_DESTINATIONS: Destination[] = [...NATIONAL, ...INTERNATIONAL];

/** Ámbito (nacional/internacional) de un slug dado. */
export function scopeOfSlug(slug: string): "national" | "international" {
  return NATIONAL.some((d) => d.slug === slug) ? "national" : "international";
}

/**
 * Datos de vuelo por destino (aerolínea + duración estimada) — el sistema es
 * para AVIÓN: los detalles se adaptan a cómo se llega volando.
 */
export const FLIGHT_INFO: Record<string, { airline: string; time: string }> = {
  "Salar de Uyuni": { airline: "Boliviana de Aviación", time: "0h 50m" },
  "Madidi & Rurrenabaque": { airline: "Boliviana de Aviación", time: "0h 45m" },
  "Misiones de Chiquitania": { airline: "Boliviana de Aviación", time: "0h 55m" },
  "Lago Titicaca": { airline: "Boliviana de Aviación", time: "0h 55m" },
  "Sucre Colonial": { airline: "Boliviana de Aviación", time: "0h 50m" },
  "La Paz & Cordillera Real": { airline: "Boliviana de Aviación", time: "0h 45m" },
  "Valles de Tarija": { airline: "Boliviana de Aviación", time: "1h 05m" },
  "Cochabamba & Valle Alto": { airline: "Boliviana de Aviación", time: "0h 40m" },
  "Buenos Aires": { airline: "LATAM Airlines", time: "2h 30m" },
  "Río de Janeiro": { airline: "GOL Linhas Aéreas", time: "3h 40m" },
  "Cancún": { airline: "LATAM Airlines", time: "≈ 8h" },
  "Lima": { airline: "LATAM Airlines", time: "2h 20m" },
  "Madrid": { airline: "Air Europa", time: "≈ 13h" },
  "Punta Cana": { airline: "Copa Airlines", time: "≈ 7h" },
  "Santiago": { airline: "LATAM Airlines", time: "2h 40m" },
  "São Paulo": { airline: "GOL Linhas Aéreas", time: "3h 00m" },
  "Bogotá": { airline: "Avianca", time: "3h 30m" },
  "Miami": { airline: "American Airlines", time: "≈ 8h" },
};
