import type { TripTracking } from "@vialta/types";

/** Seguimientos de demostración, indexados por referencia de reserva. */
export const TRACKINGS: Record<string, TripTracking> = {
  "VL-7K2A": {
    reference: "VL-7K2A",
    mode: "air",
    operatorName: "Andina Air",
    operatorMark: "AA",
    operatorColor: "#6a5cff",
    vehicleName: "Airbus A320neo",
    originCity: "Lima",
    originCode: "LIM",
    destinationCity: "Cusco",
    destinationCode: "CUZ",
    status: "in_transit",
    progressPct: 42,
    departAt: "2026-07-03T08:30:00",
    etaAt: "2026-07-03T10:05:00",
    distanceTotalKm: 1100,
    speedKmh: 720,
    path: [
      { x: 5, y: 46 }, { x: 17, y: 38 }, { x: 30, y: 30 }, { x: 45, y: 24 },
      { x: 60, y: 22 }, { x: 74, y: 25 }, { x: 86, y: 32 }, { x: 95, y: 41 },
    ],
    waypoints: [
      { id: "w1", label: "Despegue LIM", atPct: 4 },
      { id: "w2", label: "Altitud de crucero", atPct: 38 },
      { id: "w3", label: "Inicio de descenso", atPct: 84 },
    ],
  },

  "VL-3M9X": {
    reference: "VL-3M9X",
    mode: "train",
    operatorName: "AndesRail",
    operatorMark: "AR",
    operatorColor: "#0f9d8f",
    vehicleName: "AndesRail Vistadome",
    originCity: "Ollantaytambo",
    originCode: "OLL",
    destinationCity: "Machu Picchu",
    destinationCode: "MAP",
    status: "in_transit",
    progressPct: 58,
    departAt: "2026-07-15T14:00:00",
    etaAt: "2026-07-15T15:40:00",
    distanceTotalKm: 75,
    speedKmh: 45,
    path: [
      { x: 6, y: 40 }, { x: 18, y: 34 }, { x: 28, y: 42 }, { x: 40, y: 30 },
      { x: 52, y: 38 }, { x: 63, y: 26 }, { x: 76, y: 34 }, { x: 93, y: 24 },
    ],
    waypoints: [
      { id: "w1", label: "Km 82", atPct: 28 },
      { id: "w2", label: "Puente Ruinas", atPct: 68 },
    ],
  },

  "VL-8QP1": {
    reference: "VL-8QP1",
    mode: "bus",
    operatorName: "RutaSur",
    operatorMark: "RS",
    operatorColor: "#12b3a3",
    vehicleName: "Volvo 9800 DD",
    originCity: "Lima",
    originCode: "LIM",
    destinationCity: "Arequipa",
    destinationCode: "AQP",
    status: "boarding",
    progressPct: 0,
    departAt: "2026-08-02T21:30:00",
    etaAt: "2026-08-03T13:00:00",
    distanceTotalKm: 1010,
    speedKmh: 75,
    path: [
      { x: 5, y: 30 }, { x: 20, y: 28 }, { x: 35, y: 33 }, { x: 50, y: 30 },
      { x: 65, y: 35 }, { x: 80, y: 30 }, { x: 95, y: 33 },
    ],
    waypoints: [
      { id: "w1", label: "Nazca", atPct: 35 },
      { id: "w2", label: "Camaná", atPct: 75 },
    ],
  },
};

export function findTracking(reference: string): TripTracking | null {
  return TRACKINGS[reference] ?? null;
}
