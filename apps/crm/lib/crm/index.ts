import type { CrmDataSource } from "./data-source";
import { MockCrmDataSource } from "./mock-data-source";
import { HttpCrmDataSource } from "./http-data-source";
import { CRM_DATA_SOURCE } from "./config";

/**
 * Punto único de acceso a datos del CRM. Devuelve el adaptador según
 * `NEXT_PUBLIC_DATA_SOURCE`: mock en memoria (Fases 0–8) o HTTP contra el API
 * NestJS/Postgres (Fase 9). La UI sólo depende del contrato `CrmDataSource`.
 */
let mock: CrmDataSource | null = null;
let http: CrmDataSource | null = null;

export function getCrmDataSource(): CrmDataSource {
  if (CRM_DATA_SOURCE === "api") {
    if (!http) http = new HttpCrmDataSource();
    return http;
  }
  if (!mock) mock = new MockCrmDataSource();
  return mock;
}

export type { CrmDataSource };
