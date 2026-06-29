import type { CurrencyCode, Seat, SeatMapLayout, TransportMode } from "@vialta/types";

/* RNG determinista por viaje (mismo asiento ocupado en cada visita). */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ModeLayout {
  columns: string[];
  aisleAfter: number[];
  rows: number;
  deckLabel: string;
  /** Filas (1-based) consideradas premium, con recargo. */
  premiumRows: number;
  premiumSurcharge: number;
}

const LAYOUTS: Record<TransportMode, ModeLayout> = {
  air: { columns: ["A", "B", "C", "D", "E", "F"], aisleAfter: [2], rows: 26, deckLabel: "Cabina", premiumRows: 3, premiumSurcharge: 30 },
  bus: { columns: ["A", "B", "C", "D"], aisleAfter: [1], rows: 13, deckLabel: "Salón principal", premiumRows: 2, premiumSurcharge: 20 },
  train: { columns: ["A", "B", "C", "D"], aisleAfter: [1], rows: 16, deckLabel: "Vagón", premiumRows: 2, premiumSurcharge: 18 },
  private: { columns: ["A", "B", "C"], aisleAfter: [0], rows: 4, deckLabel: "Van", premiumRows: 0, premiumSurcharge: 0 },
};

export function generateSeatMap(
  tripId: string,
  mode: TransportMode,
  currency: CurrencyCode
): SeatMapLayout {
  const layout = LAYOUTS[mode];
  const rng = mulberry32(hashString(`seats|${tripId}`));
  const seats: Seat[] = [];

  for (let row = 1; row <= layout.rows; row++) {
    for (const col of layout.columns) {
      const isPremium = row <= layout.premiumRows;
      const occupied = rng() < 0.33;
      const seat: Seat = {
        id: `${tripId}-${row}${col}`,
        label: `${row}${col}`,
        row,
        col,
        status: occupied ? "occupied" : "available",
      };
      if (isPremium && layout.premiumSurcharge > 0) {
        seat.surcharge = { amount: layout.premiumSurcharge, currency };
      }
      seats.push(seat);
    }
  }

  return {
    tripId,
    columns: layout.columns,
    aisleAfter: layout.aisleAfter,
    rows: layout.rows,
    deckLabel: layout.deckLabel,
    seats,
  };
}
