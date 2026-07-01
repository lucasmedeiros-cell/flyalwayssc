import type { TripTracking } from "@vialta/types";

/** Seguimientos de demostración, indexados por referencia de reserva.
 *  Alineados con las reservas del perfil (lib/mock/profile.ts) — rutas de Bolivia. */
export const TRACKINGS: Record<string, TripTracking> = {
  "VL-7K2A": {
    reference: "VL-7K2A",
    mode: "air",
    operatorName: "Boliviana de Aviación",
    operatorMark: "BoA",
    operatorColor: "#0a2d6e",
    vehicleName: "Boeing 737-800",
    originCity: "Santa Cruz",
    originCode: "VVI",
    destinationCity: "La Paz",
    destinationCode: "LPB",
    status: "in_transit",
    progressPct: 42,
    departAt: "2026-07-03T08:30:00",
    etaAt: "2026-07-03T09:35:00",
    distanceTotalKm: 560,
    speedKmh: 720,
    path: [
      { x: 5, y: 46 }, { x: 17, y: 38 }, { x: 30, y: 30 }, { x: 45, y: 24 },
      { x: 60, y: 22 }, { x: 74, y: 25 }, { x: 86, y: 32 }, { x: 95, y: 41 },
    ],
    waypoints: [
      { id: "w1", label: "Despegue VVI", atPct: 4 },
      { id: "w2", label: "Altitud de crucero", atPct: 38 },
      { id: "w3", label: "Inicio de descenso", atPct: 84 },
    ],
  },

  "VL-3M9X": {
    reference: "VL-3M9X",
    mode: "train",
    operatorName: "Ferroviaria Andina",
    operatorMark: "FA",
    operatorColor: "#0f9d8f",
    vehicleName: "Wara Wara del Sur",
    originCity: "Oruro",
    originCode: "ORU",
    destinationCity: "Uyuni",
    destinationCode: "UYU",
    status: "in_transit",
    progressPct: 58,
    departAt: "2026-07-15T14:00:00",
    etaAt: "2026-07-15T21:10:00",
    distanceTotalKm: 310,
    speedKmh: 45,
    path: [
      { x: 6, y: 40 }, { x: 18, y: 34 }, { x: 28, y: 42 }, { x: 40, y: 30 },
      { x: 52, y: 38 }, { x: 63, y: 26 }, { x: 76, y: 34 }, { x: 93, y: 24 },
    ],
    waypoints: [
      { id: "w1", label: "Challapata", atPct: 28 },
      { id: "w2", label: "Río Mulato", atPct: 68 },
    ],
  },

  "VL-8QP1": {
    reference: "VL-8QP1",
    mode: "bus",
    operatorName: "Trans Copacabana",
    operatorMark: "TC",
    operatorColor: "#c8102e",
    vehicleName: "Volvo 9800 DD",
    originCity: "La Paz",
    originCode: "LPB",
    destinationCity: "Copacabana",
    destinationCode: "COPA",
    status: "boarding",
    progressPct: 0,
    departAt: "2026-08-02T07:30:00",
    etaAt: "2026-08-02T11:00:00",
    distanceTotalKm: 155,
    speedKmh: 70,
    path: [
      { x: 5, y: 30 }, { x: 20, y: 28 }, { x: 35, y: 33 }, { x: 50, y: 30 },
      { x: 65, y: 35 }, { x: 80, y: 30 }, { x: 95, y: 33 },
    ],
    waypoints: [
      { id: "w1", label: "El Alto", atPct: 12 },
      { id: "w2", label: "Estrecho de Tiquina", atPct: 70 },
    ],
  },
};

export function findTracking(reference: string): TripTracking | null {
  return TRACKINGS[reference] ?? null;
}
