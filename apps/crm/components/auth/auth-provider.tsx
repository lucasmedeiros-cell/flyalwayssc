"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CrmUser, CrmPermission } from "@vialta/types";
import { roleCan } from "@vialta/types";

interface AuthContextValue {
  user: CrmUser;
  /** ¿El usuario actual tiene el permiso? */
  can: (permission: CrmPermission) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ user, children }: { user: CrmUser; children: React.ReactNode }) {
  const router = useRouter();

  const can = useCallback((permission: CrmPermission) => roleCan(user.role, permission), [user.role]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }, [router]);

  const value = useMemo<AuthContextValue>(() => ({ user, can, logout }), [user, can, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
