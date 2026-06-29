"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Selector de idioma y moneda (multilenguaje/multimoneda — requisito de FlyAlways).
 * Presentacional + persistente en localStorage: la preferencia queda guardada y
 * lista para enchufar a i18n/FX reales sin rediseñar la UI.
 */
const LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
] as const;

const CURRENCIES = [
  { code: "BOB", label: "Boliviano", sym: "Bs" },
  { code: "USD", label: "Dólar EE. UU.", sym: "$" },
  { code: "EUR", label: "Euro", sym: "€" },
  { code: "ARS", label: "Peso argentino", sym: "$" },
  { code: "BRL", label: "Real brasileño", sym: "R$" },
  { code: "CLP", label: "Peso chileno", sym: "$" },
  { code: "PEN", label: "Sol peruano", sym: "S/" },
] as const;

export function LocaleCurrency({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<string>("es");
  const [currency, setCurrency] = useState<string>("BOB");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(localStorage.getItem("vialta:lang") ?? "es");
    setCurrency(localStorage.getItem("vialta:currency") ?? "BOB");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (kind: "lang" | "currency", value: string) => {
    if (kind === "lang") {
      setLang(value);
      localStorage.setItem("vialta:lang", value);
    } else {
      setCurrency(value);
      localStorage.setItem("vialta:currency", value);
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="uppercase">{lang}</span>
        <span className="text-muted-foreground">·</span>
        <span>{currency}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-lg)]"
          >
            <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Idioma
            </p>
            {LANGS.map((l) => (
              <Option
                key={l.code}
                label={l.label}
                hint={l.code.toUpperCase()}
                active={lang === l.code}
                onClick={() => pick("lang", l.code)}
              />
            ))}
            <div className="my-1.5 h-px bg-border" />
            <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Moneda
            </p>
            {CURRENCIES.map((c) => (
              <Option
                key={c.code}
                label={c.label}
                hint={`${c.sym} ${c.code}`}
                active={currency === c.code}
                onClick={() => pick("currency", c.code)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Option({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors",
        active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {hint}
        {active && <Check className="h-3.5 w-3.5 text-primary" />}
      </span>
    </button>
  );
}
