import { ID } from "./common";
import { TransportMode } from "./transport";

/** Empresa operadora afiliada (aerolínea, línea de bus, ferroviaria, flota). */
export interface Operator {
  id: ID;
  name: string;
  /** Slug para URLs y assets. */
  slug: string;
  /** Modos que opera (la mayoría uno, pero el modelo permite varios). */
  modes: TransportMode[];
  /** Iniciales o glifo para el logo generado (sin assets de terceros). */
  logoMark: string;
  /** Color de marca del operador (hex) — usado en el logo placeholder. */
  brandColor: string;
  rating: number; // 0..5
  reviewsCount: number;
  countryCode: string;
}
