import type { ID, ISODate, Money } from "./common";
import type { CrmRole } from "./crm";

/* ------------------------------------------------------------------ */
/* Agente (personal de ventas) con métricas de rendimiento.            */
/* ------------------------------------------------------------------ */

export type AgentStatus = "active" | "inactive";

export interface CrmAgent {
  id: ID;
  name: string;
  initials: string;
  email: string;
  role: CrmRole;
  sales: number;
  revenue: Money;
  commissionPct: number;
  commissionEarned: Money;
  goal: Money;
  goalPct: number;
  activeClients: number;
  rating: number;
  status: AgentStatus;
  joinedAt: ISODate;
}
