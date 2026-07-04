import type { CrmUser } from "@vialta/types";

/** Usuario mock con credencial (solo Fase 1 — el backend real con bcrypt llega en Fase 9). */
export interface MockCrmUser extends CrmUser {
  /** Nombre de usuario para iniciar sesión (alternativa al correo). */
  username?: string;
  password: string;
}

/* Personal de FLYALWAYS. Acceso demo: usuario "admin" / contraseña "admin". */
export const MOCK_USERS: MockCrmUser[] = [
  {
    id: "u-admin",
    name: "Ana Flores",
    initials: "AF",
    email: "ana@flyalways.bo",
    username: "admin",
    role: "admin",
    color: "#3a23a8",
    active: true,
    twoFactorEnabled: true,
    lastActiveAt: "2026-06-30T14:05:00Z",
    password: "admin",
  },
  {
    id: "u-super",
    name: "Carlos Mendoza",
    initials: "CM",
    email: "carlos@flyalways.bo",
    role: "supervisor",
    color: "#1ca71c",
    active: true,
    twoFactorEnabled: false,
    lastActiveAt: "2026-06-30T13:40:00Z",
    password: "demo1234",
  },
  {
    id: "u-agent",
    name: "Lucía Pérez",
    initials: "LP",
    email: "lucia@flyalways.bo",
    role: "agent",
    color: "#8b7bf5",
    active: true,
    twoFactorEnabled: false,
    lastActiveAt: "2026-06-30T12:10:00Z",
    password: "demo1234",
  },
  {
    id: "u-acct",
    name: "Diego Rojas",
    initials: "DR",
    email: "diego@flyalways.bo",
    role: "accounting",
    color: "#e0a106",
    active: true,
    twoFactorEnabled: false,
    lastActiveAt: "2026-06-29T18:22:00Z",
    password: "demo1234",
  },
  {
    id: "u-mkt",
    name: "María Salazar",
    initials: "MS",
    email: "maria@flyalways.bo",
    role: "marketing",
    color: "#e62020",
    active: true,
    twoFactorEnabled: false,
    lastActiveAt: "2026-06-30T09:50:00Z",
    password: "demo1234",
  },
];

/** Devuelve el usuario público (sin password) por id. */
export function findUserById(id: string): CrmUser | null {
  const u = MOCK_USERS.find((x) => x.id === id);
  if (!u) return null;
  const { password: _pw, ...pub } = u;
  return pub;
}

/**
 * Valida credenciales y devuelve el usuario público.
 * El identificador acepta el nombre de usuario (p. ej. "admin") o el correo.
 */
export function verifyCredentials(identifier: string, password: string): CrmUser | null {
  const id = identifier.toLowerCase().trim();
  const u = MOCK_USERS.find(
    (x) => x.username?.toLowerCase() === id || x.email.toLowerCase() === id,
  );
  if (!u || u.password !== password || !u.active) return null;
  const { password: _pw, ...pub } = u;
  return pub;
}
