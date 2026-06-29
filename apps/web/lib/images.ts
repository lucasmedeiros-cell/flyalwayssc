/**
 * Catálogo curado de fotografía aspiracional (FlyAlways — Hito 9).
 *
 * Decisión: fotografía real vía next/image. Centralizamos aquí los IDs de Unsplash
 * para mantener consistencia visual y poder migrar a assets propios o a un CDN sin
 * tocar componentes. Si una URL fallara, <SmartImage> degrada con elegancia al
 * gradiente duotono de la identidad — nada se rompe nunca.
 *
 * Las imágenes se sirven optimizadas por next/image (AVIF/WebP + sizes responsivos);
 * los parámetros de Unsplash solo acotan el origen para no descargar el master.
 */

/** Construye una URL de Unsplash acotada (next/image hace el resto del trabajo). */
export function unsplash(id: string, w = 1200, q = 70): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

/**
 * Placeholder borroso compartido (degradado violeta→teal de marca, 8×5).
 * Evita layout shift y da una entrada premium mientras carga la foto real.
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjUiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIxIiB4Mj0iMSIgeTI9IjAiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzZhNWNmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzEyYjNhMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=";

/** Tipo de una entrada del catálogo: foto + gradiente de respaldo coherente. */
export type CuratedImage = {
  src: string;
  alt: string;
  /** Clases del gradiente duotono usado como fallback/placeholder de marca. */
  gradient: string;
};

/**
 * Hero principal: paisaje altiplánico boliviano (lago/cordillera) — deseo de
 * viajar + identidad local. NOTA: IDs representativos; validar/sustituir por
 * fotografía licenciada de Bolivia en este único archivo. SmartImage degrada al
 * gradiente de marca si una foto no carga.
 */
export const HERO_IMAGE: CuratedImage = {
  src: "/images/destinations/hero-uyuni.jpg",
  alt: "Reflejo del cielo en el Salar de Uyuni, Bolivia",
  gradient: "from-primary/40 via-accent/20 to-primary/55",
};

/** Por modo de transporte (selector y tarjetas de modo). */
export const MODE_IMAGES: Record<"air" | "bus" | "train" | "private", CuratedImage> = {
  air: {
    src: unsplash("1436491865332-7a61a109cc05", 1000),
    alt: "Ala de avión sobre las nubes",
    gradient: "from-primary/40 via-accent/20 to-primary/45",
  },
  bus: {
    src: unsplash("1544620347-c4fd4a3d5957", 1000),
    alt: "Carretera de montaña al amanecer",
    gradient: "from-accent/40 via-primary/15 to-accent/45",
  },
  train: {
    src: unsplash("1474487548417-781cb71495f3", 1000),
    alt: "Vías de tren que se pierden en el horizonte",
    gradient: "from-primary/35 via-accent/20 to-primary/40",
  },
  private: {
    src: unsplash("1503376780353-7e6692767b70", 1000),
    alt: "Interior de un vehículo premium",
    gradient: "from-primary/45 via-accent/15 to-primary/35",
  },
};

/**
 * Destinos bolivianos — FOTOGRAFÍA REAL del lugar, descargada de Wikimedia Commons
 * (CC) y optimizada a /public/images/destinations vía `scripts/fetch-destination-photos.mjs`.
 * Atribución: las fotos son CC de Wikimedia Commons; revisar créditos por imagen para
 * uso comercial. SmartImage degrada al gradiente de marca si una foto no carga.
 */
export const DESTINATION_IMAGES: Record<string, CuratedImage> = {
  Uyuni: {
    src: "/images/destinations/uyuni.jpg",
    alt: "Salar de Uyuni con reflejo del cielo",
    gradient: "from-primary/40 via-accent/20 to-primary/50",
  },
  "La Paz": {
    src: "/images/destinations/la-paz.jpg",
    alt: "Ciudad de La Paz entre montañas",
    gradient: "from-primary/40 via-warning/15 to-primary/45",
  },
  "Santa Cruz": {
    src: "/images/destinations/santa-cruz.jpg",
    alt: "Plaza 24 de Septiembre, Santa Cruz de la Sierra",
    gradient: "from-accent/35 via-accent/15 to-primary/35",
  },
  Sucre: {
    src: "/images/destinations/sucre.jpg",
    alt: "Vista panorámica de la ciudad de Sucre",
    gradient: "from-warning/20 via-primary/20 to-accent/30",
  },
  Copacabana: {
    src: "/images/destinations/copacabana.jpg",
    alt: "Lago Titicaca desde Copacabana al atardecer",
    gradient: "from-accent/40 via-primary/15 to-accent/45",
  },
  Rurrenabaque: {
    src: "/images/destinations/rurrenabaque.jpg",
    alt: "Río Beni en Rurrenabaque, puerta del Madidi",
    gradient: "from-success/30 via-accent/15 to-primary/35",
  },
  Cochabamba: {
    src: "/images/destinations/cochabamba.jpg",
    alt: "Cristo de la Concordia en Cochabamba",
    gradient: "from-primary/35 via-accent/15 to-primary/40",
  },
  Tarija: {
    src: "/images/destinations/tarija.jpg",
    alt: "Viñedos del valle de Tarija",
    gradient: "from-success/25 via-warning/15 to-accent/30",
  },
};

/**
 * Categorías de "Completa tu viaje" — fotografía real por servicio (Wikimedia CC,
 * optimizada en /public/images/experiences vía scripts/fetch-experience-photos.mjs).
 */
export const EXPERIENCE_IMAGES: Record<string, CuratedImage> = {
  hoteles: { src: "/images/experiences/hoteles.jpg", alt: "Habitación de hotel premium", gradient: "from-primary/40 via-accent/15 to-primary/45" },
  tours: { src: "/images/experiences/tours.jpg", alt: "Paisaje del Salar de Uyuni", gradient: "from-accent/35 via-primary/15 to-accent/40" },
  autos: { src: "/images/experiences/autos.jpg", alt: "Auto premium para tu viaje", gradient: "from-primary/35 via-accent/15 to-primary/40" },
  seguro: { src: "/images/experiences/seguro.jpg", alt: "Vuelo tranquilo entre nubes", gradient: "from-success/30 via-accent/15 to-primary/35" },
  actividades: { src: "/images/experiences/actividades.jpg", alt: "Experiencias y espectáculos", gradient: "from-accent/40 via-primary/15 to-accent/35" },
  excursiones: { src: "/images/experiences/excursiones.jpg", alt: "Senderismo en la naturaleza", gradient: "from-success/35 via-accent/15 to-primary/30" },
  restaurantes: { src: "/images/experiences/restaurantes.jpg", alt: "Gastronomía para descubrir", gradient: "from-warning/25 via-primary/15 to-accent/30" },
};
