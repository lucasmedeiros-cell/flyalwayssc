import type { CrmUser, CrmActiveSession, CrmAuditEntry } from "@vialta/types";
import { MOCK_USERS } from "@/lib/auth/mock-users";

/** Lista pública de usuarios del CRM (sin credenciales). */
export const MOCK_SETTINGS_USERS: CrmUser[] = MOCK_USERS.map(({ password: _pw, ...u }) => u);

export const MOCK_ACTIVE_SESSIONS: CrmActiveSession[] = [
  {
    id: "s1",
    device: "MacBook Pro",
    browser: "Chrome 138",
    ip: "186.121.x.x",
    location: "Santa Cruz, BO",
    lastActiveAt: "2026-06-30T14:05:00Z",
    current: true,
  },
  {
    id: "s2",
    device: "iPhone 16",
    browser: "Safari móvil",
    ip: "190.129.x.x",
    location: "La Paz, BO",
    lastActiveAt: "2026-06-30T08:42:00Z",
    current: false,
  },
  {
    id: "s3",
    device: "Windows 11",
    browser: "Edge 138",
    ip: "181.114.x.x",
    location: "Cochabamba, BO",
    lastActiveAt: "2026-06-28T19:10:00Z",
    current: false,
  },
];

export const MOCK_AUDIT: CrmAuditEntry[] = [
  { id: "al1", actor: "Ana Flores", actorInitials: "AF", action: "login", entity: "Sesión", at: "2026-06-30T14:05:00Z", ip: "186.121.x.x" },
  { id: "al2", actor: "Lucía Pérez", actorInitials: "LP", action: "create", entity: "Cliente · María Salazar", at: "2026-06-30T11:20:00Z", ip: "190.129.x.x" },
  { id: "al3", actor: "Diego Rojas", actorInitials: "DR", action: "update", entity: "Pago #FA-20418", detail: "Estado: pendiente → pagado", at: "2026-06-30T13:32:00Z", ip: "181.114.x.x" },
  { id: "al4", actor: "Ana Flores", actorInitials: "AF", action: "permission_change", entity: "Rol · Agente", detail: "Añadido: quotes.manage", at: "2026-06-29T16:48:00Z", ip: "186.121.x.x" },
  { id: "al5", actor: "Carlos Mendoza", actorInitials: "CM", action: "export", entity: "Reporte de ventas (PDF)", at: "2026-06-29T10:05:00Z", ip: "190.129.x.x" },
  { id: "al6", actor: "Lucía Pérez", actorInitials: "LP", action: "delete", entity: "Cotización #FA-Q812", at: "2026-06-28T17:30:00Z", ip: "190.129.x.x" },
];
