"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Contador regresivo para ofertas ("Termina en 01:20:45").
 * SSR-safe: el primer render (servidor y cliente) usa exactamente el valor
 * inicial recibido por props; el tic-tac solo arranca tras montar en cliente.
 * Al llegar a cero reinicia para mantener la sensación de oferta siempre activa.
 */
export function Countdown({
  hours = 1,
  minutes = 20,
  seconds = 45,
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
    const id = setInterval(() => {
      setRemaining((r) => (r <= 1 ? initial : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [initial]);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <span
      className={cn("inline-flex items-center gap-1 tabular-nums font-semibold", className)}
      aria-label={`Termina en ${h} horas ${m} minutos ${s} segundos`}
    >
      {[h, m, s].map((unit, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <span className="opacity-50">:</span>}
          <span className="rounded-md bg-foreground/10 px-1.5 py-0.5">{pad(unit)}</span>
        </span>
      ))}
    </span>
  );
}
