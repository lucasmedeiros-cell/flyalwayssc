"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

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
const MASK = "••••••";

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [masked, setMasked] = useState(false);

  // Hidratar desde localStorage tras montar (evita mismatch SSR).
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setMasked(true);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setMasked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const mask = useCallback((text: string) => (masked ? MASK : text), [masked]);

  return <Ctx.Provider value={{ masked, toggle, mask }}>{children}</Ctx.Provider>;
}

export function useMoneyMask(): PrivacyCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMoneyMask debe usarse dentro de PrivacyProvider");
  return ctx;
}
