"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

/**
 * Modo privacidad (estándar corporativo #12): permite ocultar todos los montos
 * de dinero con ••••••. Preferencia por usuario, persistida en localStorage.
 * Los componentes que muestran dinero consumen `useMoneyMask()` y enmascaran
 * con `mask()`.
 */
interface PrivacyCtx {
  masked: boolean;
  toggle: () => void;
  /** Devuelve el texto enmascarado si el modo privacidad está activo. */
  mask: (text: string) => string;
}

const Ctx = createContext<PrivacyCtx | null>(null);
const STORAGE_KEY = "fa_crm_money_masked";
const MASK = "******";

/** Lee la preferencia desde localStorage (store externo). */
function readMasked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

// Suscripción al store externo para notificar cambios entre pestañas/consumidores.
const listeners = new Set<() => void>();
function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore hidrata con el snapshot de servidor (false) y evita el
  // mismatch SSR sin llamar a setState dentro de un effect.
  const masked = useSyncExternalStore(subscribe, readMasked, () => false);

  const toggle = useCallback(() => {
    const next = !readMasked();
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  }, []);

  const mask = useCallback((text: string) => (masked ? MASK : text), [masked]);

  return <Ctx.Provider value={{ masked, toggle, mask }}>{children}</Ctx.Provider>;
}

export function useMoneyMask(): PrivacyCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMoneyMask debe usarse dentro de PrivacyProvider");
  return ctx;
}
