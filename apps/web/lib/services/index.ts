import type { DataSource } from "./data-source";
import { MockDataSource } from "./mock-data-source";

/**
 * Punto único de acceso a datos. Hoy devuelve el adaptador mock; cuando exista
 * la API NestJS bastará con devolver aquí un `HttpDataSource` que implemente la
 * misma interfaz `DataSource` — sin tocar componentes.
 *
 * Controlado por env: NEXT_PUBLIC_DATA_SOURCE = "mock" | "api" (futuro).
 */
let instance: DataSource | null = null;

export function getDataSource(): DataSource {
  if (instance) return instance;
  // const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
  instance = new MockDataSource();
  return instance;
}

export type { DataSource };
