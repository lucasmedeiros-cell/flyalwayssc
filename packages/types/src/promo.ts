import { Money } from "./common";

/** Métrica destacada de la landing promocional (p. ej. "4.9 ★ · 2.300 reseñas"). */
export interface PromoStat {
  label: string;
  value: string;
}

/** Beneficio/argumento de venta con título y descripción corta. */
export interface PromoHighlight {
  /** Nombre de icono lucide (opcional) — p. ej. "ShieldCheck", "Zap". */
  icon?: string;
  title: string;
  text?: string;
}

/**
 * Configuración de la landing de un ÚNICO producto destacado. Se administra y
 * activa desde el panel de administración y se publica al cliente en `/promo`.
 * Persistida en Postgres (bilbo), fila única.
 */
export interface PromoProduct {
  /** Si está publicada (visible para el cliente). */
  active: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  productName: string;
  description: string;
  /** Etiqueta corta destacada (p. ej. "Edición limitada", "Oferta"). */
  badge?: string;
  price: Money;
  /** Precio anterior tachado (para mostrar descuento). */
  originalPrice?: Money;
  ctaLabel: string;
  ctaHref: string;
  /** URL o ruta pública de la imagen principal. */
  imageUrl?: string;
  /** Color de acento (hex) para teñir la landing. */
  accentColor?: string;
  highlights: PromoHighlight[];
  stats: PromoStat[];
  /** Fecha límite ISO para el contador de urgencia (opcional). */
  validUntil?: string;
  updatedAt?: string;
}
