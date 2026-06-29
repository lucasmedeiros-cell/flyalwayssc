"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Gráfico de área (tendencia) — SVG propio, sin librerías.            */
/* ------------------------------------------------------------------ */

export function AreaChart({
  data,
  height = 200,
  formatValue,
  className,
}: {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (n: number) => string;
  className?: string;
}) {
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const n = data.length;

  const padTop = 12;
  const padBottom = 12;
  const innerH = 100 - padTop - padBottom;

  const xy = data.map((d, i) => {
    const x = n === 1 ? 50 : (i / (n - 1)) * 100;
    const norm = (d.value - min) / span;
    const y = padTop + (1 - norm) * innerH;
    return { x, y };
  });

  const linePath = xy.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  return (
    <div className={cn("relative w-full text-primary", className)} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[padTop, 50, 100 - padBottom].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={areaPath} fill="url(#area-grad)" />
        <motion.path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Puntos con tooltip (capa HTML) */}
      {xy.map((p, i) => (
        <span
          key={i}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="block h-2.5 w-2.5 rounded-full border-2 border-primary bg-surface" />
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow transition-opacity group-hover:opacity-100">
            {formatValue ? formatValue(data[i].value) : data[i].value}
          </span>
        </span>
      ))}

      {/* Etiquetas eje X */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[11px] text-muted-foreground">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donut (distribución).                                               */
/* ------------------------------------------------------------------ */

export function DonutChart({
  segments,
  size = 168,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let offset = 25; // empieza arriba (12 en punto)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--surface-2)" strokeWidth="3.4" />
        {segments.map((s, i) => {
          const share = (s.value / total) * 100;
          const dash = `${share} ${100 - share}`;
          const circle = (
            <circle
              key={i}
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke={s.color}
              strokeWidth="3.4"
              strokeDasharray={dash}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
          offset -= share;
          return circle;
        })}
      </svg>
      {(centerValue || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="font-[family-name:var(--font-display)] text-xl font-bold">
              {centerValue}
            </span>
          )}
          {centerLabel && <span className="text-[11px] text-muted-foreground">{centerLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
