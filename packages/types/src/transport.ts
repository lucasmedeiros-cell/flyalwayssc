/** Modos de transporte soportados por la plataforma. */

export type TransportMode = "air" | "bus" | "train" | "private";

/**
 * Modos disponibles para el usuario. La plataforma opera SOLO vuelos: aquí se
 * deja únicamente "air". (El tipo conserva los demás para datos/futuro; para
 * reactivar otro modo, basta con agregarlo a este array.)
 */
export const TRANSPORT_MODES: TransportMode[] = ["air"];

export interface TransportModeMeta {
  mode: TransportMode;
  /** Etiqueta legible (es). */
  label: string;
  /** Emoji/icono representativo. */
  icon: string;
  /** Descripción corta para UI. */
  tagline: string;
}

export const TRANSPORT_MODE_META: Record<TransportMode, TransportModeMeta> = {
  air: {
    mode: "air",
    label: "Avión",
    icon: "✈",
    tagline: "Vuela más lejos, más rápido",
  },
  bus: {
    mode: "bus",
    label: "Bus",
    icon: "🚌",
    tagline: "Conecta cada ciudad",
  },
  train: {
    mode: "train",
    label: "Tren",
    icon: "🚆",
    tagline: "Viaja sobre rieles con estilo",
  },
  private: {
    mode: "private",
    label: "Flota privada",
    icon: "🚐",
    tagline: "Tu trayecto, a tu medida",
  },
};

/** Clases/servicios de cabina. El conjunto válido depende del modo. */
export type TravelClass =
  | "economy"
  | "premium_economy"
  | "business"
  | "first"
  | "standard"
  | "executive"
  | "vip"
  | "sleeper";

export const CLASSES_BY_MODE: Record<TransportMode, TravelClass[]> = {
  air: ["economy", "premium_economy", "business", "first"],
  bus: ["standard", "executive", "vip"],
  train: ["standard", "business", "first", "sleeper"],
  private: ["standard", "executive", "vip"],
};

export const TRAVEL_CLASS_LABEL: Record<TravelClass, string> = {
  economy: "Económica",
  premium_economy: "Económica Premium",
  business: "Business",
  first: "Primera",
  standard: "Estándar",
  executive: "Ejecutiva",
  vip: "VIP",
  sleeper: "Camarote",
};

/** Servicios a bordo (amenities) — el set disponible varía por modo. */
export type Amenity =
  | "wifi"
  | "power"
  | "ac"
  | "meal"
  | "snack"
  | "entertainment"
  | "restroom"
  | "reclining_seats"
  | "luggage_included"
  | "pets_allowed"
  | "wheelchair"
  | "usb";

export const AMENITY_LABEL: Record<Amenity, string> = {
  wifi: "Wi-Fi",
  power: "Tomacorriente",
  usb: "Puerto USB",
  ac: "Aire acondicionado",
  meal: "Comida",
  snack: "Snack",
  entertainment: "Entretenimiento",
  restroom: "Baño",
  reclining_seats: "Asientos reclinables",
  luggage_included: "Equipaje incluido",
  pets_allowed: "Admite mascotas",
  wheelchair: "Accesible silla de ruedas",
};
