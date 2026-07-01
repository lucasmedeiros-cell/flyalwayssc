/**
 * Conmutador de origen de datos del CRM.
 *
 *   NEXT_PUBLIC_DATA_SOURCE = "mock" (default) | "api"
 *   NEXT_PUBLIC_API_URL     = base del API NestJS (default http://localhost:4000/api)
 *
 * En "mock" todo corre en memoria (Fases 0–8). En "api" el mismo contrato
 * `CrmDataSource` se sirve desde Postgres vía NestJS (Fase 9). Cambiar de uno
 * a otro NO requiere tocar componentes.
 */
export type CrmDataSourceMode = "mock" | "api";

export const CRM_DATA_SOURCE: CrmDataSourceMode =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "api" ? "api" : "mock";

export const CRM_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
