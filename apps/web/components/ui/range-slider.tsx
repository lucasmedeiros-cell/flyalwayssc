"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * Slider de rango con doble pulgar. Implementado con dos <input type="range">
 * superpuestos para máxima robustez y accesibilidad por teclado.
 */
export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  minGap = 0,
  className,
}: {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minGap?: number;
  className?: string;
}) {
  const [lo, hi] = value;
  const span = Math.max(1, max - min);
  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;

  const setLo = useCallback(
    (v: number) => onChange([Math.min(v, hi - minGap), hi]),
    [hi, minGap, onChange]
  );
  const setHi = useCallback(
    (v: number) => onChange([lo, Math.max(v, lo + minGap)]),
    [lo, minGap, onChange]
  );

  return (
    <div className={cn("dual-range relative h-6 select-none", className)}>
      {/* Riel base */}
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-2" />
      {/* Riel activo */}
      <div
        className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => setLo(Number(e.target.value))}
        aria-label="Mínimo"
        className="dual-range__input"
        style={{ zIndex: lo > max - (max - min) * 0.05 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => setHi(Number(e.target.value))}
        aria-label="Máximo"
        className="dual-range__input"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}
