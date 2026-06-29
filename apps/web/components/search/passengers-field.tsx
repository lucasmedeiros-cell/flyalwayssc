"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { PassengerCount } from "@vialta/types";
import { totalPassengers } from "@vialta/types";
import { cn } from "@/lib/utils";

const ROWS: { key: keyof PassengerCount; label: string; hint: string; min: number }[] = [
  { key: "adults", label: "Adultos", hint: "13+ años", min: 1 },
  { key: "children", label: "Niños", hint: "2–12 años", min: 0 },
  { key: "infants", label: "Bebés", hint: "0–2 años", min: 0 },
];

export function PassengersField({
  value,
  onChange,
  className,
}: {
  value: PassengerCount;
  onChange: (next: PassengerCount) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const total = totalPassengers(value);

  const set = (key: keyof PassengerCount, delta: number, min: number) =>
    onChange({ ...value, [key]: Math.max(min, value[key] + delta) });

  return (
    <div ref={ref} className={cn("relative flex flex-col gap-1.5", className)}>
      <span className="px-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Pasajeros
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex min-h-[52px] items-center gap-2.5 rounded-2xl border border-border bg-surface-2/40 px-4 py-3 text-left",
          "transition-colors duration-200 hover:border-muted-foreground/30",
          "focus-visible:border-primary/80 focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15",
          open && "border-primary/80 bg-surface ring-2 ring-primary/15",
        )}
      >
        <Users
          className={cn(
            "h-4 w-4 shrink-0 transition-colors duration-200",
            open ? "text-primary" : "text-muted-foreground",
          )}
        />
        <span className="text-sm font-medium text-foreground">
          {total} {total === 1 ? "pasajero" : "pasajeros"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Seleccionar pasajeros"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full z-40 mt-2 w-72 rounded-2xl border border-border bg-surface p-3 shadow-[var(--shadow-lg)]"
          >
            {ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-3 px-1 py-2.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Counter
                    aria-label={`Restar ${row.label}`}
                    onClick={() => set(row.key, -1, row.min)}
                    disabled={value[row.key] <= row.min}
                  >
                    <Minus className="h-4 w-4" />
                  </Counter>
                  <span className="w-5 text-center text-sm font-semibold tabular-nums">
                    {value[row.key]}
                  </span>
                  <Counter aria-label={`Sumar ${row.label}`} onClick={() => set(row.key, 1, row.min)}>
                    <Plus className="h-4 w-4" />
                  </Counter>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Counter({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-transparent disabled:hover:text-foreground",
        className,
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    />
  );
}
