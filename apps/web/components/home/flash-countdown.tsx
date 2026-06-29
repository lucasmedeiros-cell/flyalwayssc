"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Countdown premium para Flash Sale: cajas glass con glow, dígitos que cambian
 * con animación (flip + blur) e icono de reloj. SSR-safe (el tic-tac arranca al
 * montar). Al llegar a cero reinicia para mantener la sensación de oferta viva.
 */
export function FlashCountdown({
  hours = 1,
  minutes = 19,
  seconds = 58,
  className,
}: {
  hours?: number;
  minutes?: number;
  seconds?: number;
  className?: string;
}) {
  const initial = hours * 3600 + minutes * 60 + seconds;
  const [remaining, setRemaining] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => (r <= 1 ? initial : r - 1)), 1000);
    return () => clearInterval(id);
  }, [initial]);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <div
      className={cn("inline-flex items-center gap-3", className)}
      aria-label={`Termina en ${h} horas ${m} minutos ${s} segundos`}
      role="timer"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-danger/12 text-danger">
        <Clock className="h-4 w-4" />
      </span>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Termina en
        </span>
        <div className="mt-0.5 flex items-center gap-1.5">
          <DigitBox value={h} label="hrs" />
          <Separator />
          <DigitBox value={m} label="min" />
          <Separator />
          <DigitBox value={s} label="seg" highlight />
        </div>
      </div>
    </div>
  );
}

function Separator() {
  return <span className="pb-3 text-lg font-bold text-muted-foreground/50">:</span>;
}

function DigitBox({ value, label, highlight }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "glass relative flex h-12 w-11 items-center justify-center overflow-hidden rounded-xl border border-border",
          highlight ? "shadow-[var(--shadow-glow)]" : "shadow-[var(--shadow-sm)]",
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: -14, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 14, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-foreground"
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
