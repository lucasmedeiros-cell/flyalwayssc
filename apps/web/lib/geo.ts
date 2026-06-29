/** Utilidades de geometría sobre polilíneas (para el mapa de seguimiento). */

export interface Pt {
  x: number;
  y: number;
}

function dist(a: Pt, b: Pt): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Longitudes acumuladas en cada vértice. */
export function cumulativeLengths(pts: Pt[]): number[] {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum[i] = cum[i - 1] + dist(pts[i - 1], pts[i]);
  return cum;
}

export function totalLength(pts: Pt[]): number {
  const cum = cumulativeLengths(pts);
  return cum[cum.length - 1] || 0;
}

/** Punto sobre la polilínea a la fracción t (0..1). */
export function pointAtFraction(pts: Pt[], t: number): Pt {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1 || t <= 0) return pts[0];
  if (t >= 1) return pts[pts.length - 1];

  const cum = cumulativeLengths(pts);
  const total = cum[cum.length - 1];
  const target = t * total;

  for (let i = 1; i < pts.length; i++) {
    if (cum[i] >= target) {
      const segLen = cum[i] - cum[i - 1] || 1;
      const r = (target - cum[i - 1]) / segLen;
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * r,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * r,
      };
    }
  }
  return pts[pts.length - 1];
}

/** Sub-polilínea desde el inicio hasta la fracción t (incluye el punto interpolado). */
export function subPolyline(pts: Pt[], t: number): Pt[] {
  if (t <= 0) return [pts[0]];
  if (t >= 1) return [...pts];
  const cum = cumulativeLengths(pts);
  const total = cum[cum.length - 1];
  const target = t * total;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (cum[i] < target) {
      out.push(pts[i]);
    } else {
      out.push(pointAtFraction(pts, t));
      break;
    }
  }
  return out;
}

/** Convierte una lista de puntos en un atributo `points` para <polyline>. */
export function toPolylineAttr(pts: Pt[]): string {
  return pts.map((p) => `${p.x},${p.y}`).join(" ");
}
