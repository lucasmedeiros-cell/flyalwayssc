"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Currency = "BOB" | "USD";

interface CurrencyContextValue {
  /** Moneda de visualización elegida por el usuario. */
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
  /** Bs por 1 USD (cotización oficial BCB). */
  rate: number;
  /**
   * Formatea un monto —dado en su moneda nativa `from`— convertido a la moneda
   * de visualización seleccionada. Ej: price(799, "USD") con BOB → "Bs 5.561".
   */
  price: (amount: number, from: Currency) => string;
}

const DEFAULT_RATE = 6.96; // Bs/USD oficial (BCB, peg vigente); se refresca desde /api.
const STORAGE_KEY = "fa_currency";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function fmt(amount: number, currency: Currency): string {
  const n = Math.round(amount);
  if (currency === "USD") {
    return `$${n.toLocaleString("en-US")}`;
  }
  return `Bs ${n.toLocaleString("es-BO")}`;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("BOB");
  const [rate, setRate] = useState<number>(DEFAULT_RATE);

  // Preferencia guardada.
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "USD" || saved === "BOB") setCurrencyState(saved);
  }, []);

  // Cotización oficial (BCB) desde el backend.
  useEffect(() => {
    let active = true;
    fetch("/api/exchange-rate")
      .then((r) => r.json())
      .then((d: { bobPerUsd?: number }) => {
        if (active && typeof d.bobPerUsd === "number" && d.bobPerUsd > 0) setRate(d.bobPerUsd);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const toggle = useCallback(() => setCurrency(currency === "BOB" ? "USD" : "BOB"), [currency, setCurrency]);

  const price = useCallback(
    (amount: number, from: Currency) => {
      let value = amount;
      if (from !== currency) {
        value = from === "USD" ? amount * rate : amount / rate;
      }
      return fmt(value, currency);
    },
    [currency, rate],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, toggle, rate, price }),
    [currency, setCurrency, toggle, rate, price],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency debe usarse dentro de <CurrencyProvider>");
  return ctx;
}
