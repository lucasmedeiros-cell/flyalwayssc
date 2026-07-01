import type { DataSource } from "./data-source";
import { MockDataSource } from "./mock-data-source";
import { HttpDataSource } from "./http-data-source";

/**
 * Punto único de acceso a datos. Controlado por env:
 *   NEXT_PUBLIC_DATA_SOURCE = "mock" (default) | "api"
 * En "api" usa el backend NestJS (Postgres en bilbo) donde ya hay respaldo
 * (catálogo); el resto lo hereda del mock mientras se completa su backend.
 */
let instance: DataSource | null = null;

export function getDataSource(): DataSource {
  if (instance) return instance;
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
  instance = source === "api" ? new HttpDataSource() : new MockDataSource();
  return instance;
}

export type { DataSource };
