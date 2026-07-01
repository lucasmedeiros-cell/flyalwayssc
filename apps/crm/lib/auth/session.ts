import { cookies } from "next/headers";
import type { CrmUser } from "@vialta/types";
import { findUserById } from "./mock-users";
import { CRM_DATA_SOURCE, CRM_API_URL } from "@/lib/crm/config";

/**
 * Sesión mock basada en cookie. El token codifica el id de usuario en base64
 * (NO es seguro — solo Fase 1). En la Fase 9 se reemplaza por un JWT firmado
 * emitido por el AuthModule de NestJS, manteniendo este mismo API de lectura.
 */
export const SESSION_COOKIE = "fa_crm_session";
/** Cookie del refresh JWT (sólo modo API, Fase 9). */
export const REFRESH_COOKIE = "fa_crm_refresh";

export function encodeToken(userId: string): string {
  return Buffer.from(`${userId}:${userId.length}`).toString("base64url");
}

export function decodeToken(token: string): string | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const [userId, len] = raw.split(":");
    if (!userId || Number(len) !== userId.length) return null;
    return userId;
  } catch {
    return null;
  }
}

/** Lee la sesión actual desde la cookie (uso en Server Components / layouts). */
export async function getServerUser(): Promise<CrmUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Modo API (Fase 9): la cookie guarda el access JWT; el usuario se obtiene de /me.
  if (CRM_DATA_SOURCE === "api") {
    try {
      const res = await fetch(`${CRM_API_URL}/crm/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return null;
      return (await res.json()) as CrmUser;
    } catch {
      return null;
    }
  }

  // Modo mock (Fases 0–8): la cookie codifica el id en base64.
  const userId = decodeToken(token);
  if (!userId) return null;
  return findUserById(userId);
}
