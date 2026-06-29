import { Amenity, TravelClass } from "./transport";

/**
 * Resumen del conjunto de resultados (sin filtrar) que alimenta el panel de
 * filtros: rangos disponibles, operadores presentes, servicios y clases, etc.
 * Permite que el sidebar se adapte dinámicamente a cada búsqueda.
 */
export interface OperatorFacet {
  operatorId: string;
  count: number;
  /** Precio mínimo ofrecido por ese operador en la búsqueda. */
  fromPrice: number;
}

export interface SearchFacets {
  total: number;
  priceMin: number;
  priceMax: number;
  durationMin: number;
  durationMax: number;
  /** Máximo de escalas presente en los resultados. */
  maxStops: number;
  operators: OperatorFacet[];
  amenities: Amenity[];
  classes: TravelClass[];
  baggageAvailable: boolean;
  petsAvailable: boolean;
  accessibleAvailable: boolean;
}
