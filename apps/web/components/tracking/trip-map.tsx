"use client";

import type { TripTracking } from "@vialta/types";
import { TRANSPORT_MODE_META } from "@vialta/types";
import {
  pointAtFraction,
  subPolyline,
  toPolylineAttr,
  type Pt,
} from "@/lib/geo";

export function TripMap({ tracking, progress }: { tracking: TripTracking; progress: number }) {
  const pts: Pt[] = tracking.path;
  const t = Math.min(1, Math.max(0, progress / 100));
  const traveled = subPolyline(pts, t);
  const vehicle = pointAtFraction(pts, t);
  const origin = pts[0];
  const dest = pts[pts.length - 1];
  const meta = TRANSPORT_MODE_META[tracking.mode];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-2/40 shadow-[var(--shadow-sm)]">
      <svg viewBox="0 0 100 60" className="aspect-[5/3] w-full" role="img" aria-label="Mapa del viaje">
        <defs>
          <pattern id="gps-grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.4" fill="var(--muted-foreground)" opacity="0.18" />
          </pattern>
          <linearGradient id="gps-route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={tracking.operatorColor} />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        {/* Fondo */}
        <rect x="0" y="0" width="100" height="60" fill="url(#gps-grid)" />

        {/* Ruta completa (pendiente) */}
        <polyline
          points={toPolylineAttr(pts)}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.1 4"
          vectorEffect="non-scaling-stroke"
        />

        {/* Ruta recorrida */}
        <polyline
          points={toPolylineAttr(traveled)}
          fill="none"
          stroke="url(#gps-route)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Waypoints */}
        {tracking.waypoints.map((w) => {
          const p = pointAtFraction(pts, w.atPct / 100);
          const reached = t * 100 >= w.atPct;
          return (
            <circle
              key={w.id}
              cx={p.x}
              cy={p.y}
              r="1.1"
              fill={reached ? tracking.operatorColor : "var(--surface)"}
              stroke="var(--border)"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Origen */}
        <circle cx={origin.x} cy={origin.y} r="1.8" fill="var(--foreground)" />
        <text x={origin.x} y={origin.y - 3} textAnchor="middle" fontSize="3.4" fontWeight="700" fill="var(--foreground)">
          {tracking.originCode}
        </text>

        {/* Destino */}
        <circle cx={dest.x} cy={dest.y} r="2.2" fill="none" stroke={tracking.operatorColor} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle cx={dest.x} cy={dest.y} r="0.9" fill={tracking.operatorColor} />
        <text x={dest.x} y={dest.y - 3.6} textAnchor="middle" fontSize="3.4" fontWeight="700" fill="var(--foreground)">
          {tracking.destinationCode}
        </text>

        {/* Vehículo */}
        <g>
          <circle className="gps-pulse" cx={vehicle.x} cy={vehicle.y} fill={tracking.operatorColor} />
          <circle cx={vehicle.x} cy={vehicle.y} r="3" fill={tracking.operatorColor} stroke="#fff" strokeWidth="0.7" />
          <text x={vehicle.x} y={vehicle.y + 1.4} textAnchor="middle" fontSize="3.4">
            {meta.icon}
          </text>
        </g>
      </svg>

      {/* Etiqueta flotante */}
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/80 px-2.5 py-1 text-xs font-medium backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        GPS en vivo
      </div>
    </div>
  );
}
