/**
 * Catálogo estático del dominio. Definido localmente para mantener el API
 * autocontenido (sin acoplarse al paquete del frontend en runtime).
 */
export const TRANSPORT_MODES = [
  { mode: "AIR", label: "Avión", icon: "✈", classes: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"] },
  { mode: "BUS", label: "Bus", icon: "🚌", classes: ["STANDARD", "EXECUTIVE", "VIP"] },
  { mode: "TRAIN", label: "Tren", icon: "🚆", classes: ["STANDARD", "BUSINESS", "FIRST", "SLEEPER"] },
  { mode: "PRIVATE", label: "Flota privada", icon: "🚐", classes: ["STANDARD", "EXECUTIVE", "VIP"] },
] as const;
