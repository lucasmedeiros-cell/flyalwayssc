import type { Ticket, TicketDetail, TicketSegment, TicketExtras } from "@vialta/types";

const bob = (amount: number) => ({ amount, currency: "BOB" as const });

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "t1", code: "FA-20418", customerId: "c8", customerName: "Familia Gutiérrez", agentId: "a1", agentName: "Ana Flores",
    airline: "Iberia", airlineCode: "IB", pnr: "AB12CD", gds: "Amadeus", ticketNumber: "075-2401887766",
    originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Madrid", destinationCode: "MAD",
    tripType: "round_trip", travelClass: "economy", travelDate: "2026-07-02", passengerCount: 4,
    fare: bob(14800), taxes: bob(3650), total: bob(18450), commission: bob(1480), profit: bob(2100),
    providerId: "p1", providerName: "Iberia Bolivia", status: "issued", createdAt: "2026-06-12T15:30:00Z",
  },
  {
    id: "t2", code: "FA-20419", customerId: "c1", customerName: "Roberto Áñez", agentId: "a1", agentName: "Ana Flores",
    airline: "American Airlines", airlineCode: "AA", pnr: "XK90PL", gds: "Sabre", ticketNumber: "001-7788990011",
    originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Miami", destinationCode: "MIA",
    tripType: "round_trip", travelClass: "business", travelDate: "2026-07-10", passengerCount: 1,
    fare: bob(22400), taxes: bob(4100), total: bob(26500), commission: bob(2240), profit: bob(3200),
    providerId: "p2", providerName: "American Airlines", status: "confirmed", createdAt: "2026-06-20T11:00:00Z",
  },
  {
    id: "t3", code: "FA-20420", customerId: "c3", customerName: "Pedro Quispe", agentId: "a2", agentName: "Carlos Mendoza",
    airline: "Gol", airlineCode: "G3", pnr: "RT55MN", gds: "Amadeus", ticketNumber: "127-3344556677",
    originCity: "Cochabamba", originCode: "CBB", destinationCity: "São Paulo", destinationCode: "GRU",
    tripType: "round_trip", travelClass: "economy", travelDate: "2026-07-05", passengerCount: 1,
    fare: bob(5200), taxes: bob(1400), total: bob(6600), commission: bob(520), profit: bob(680),
    providerId: "p3", providerName: "Gol Linhas Aéreas", status: "reserved", createdAt: "2026-06-28T09:00:00Z",
  },
  {
    id: "t4", code: "FA-20421", customerId: "c11", customerName: "Luis Fernández", agentId: "a1", agentName: "Ana Flores",
    airline: "LATAM", airlineCode: "LA", pnr: "QW33ZX", gds: "Sabre", ticketNumber: "045-9900112233",
    originCity: "La Paz", originCode: "LPB", destinationCity: "Lima", destinationCode: "LIM",
    tripType: "one_way", travelClass: "economy", travelDate: "2026-07-08", passengerCount: 1,
    fare: bob(3100), taxes: bob(720), total: bob(3820), commission: bob(310), profit: bob(410),
    providerId: "p4", providerName: "LATAM Airlines", status: "issued", createdAt: "2026-06-24T14:00:00Z",
  },
  {
    id: "t5", code: "FA-20422", customerId: "c7", customerName: "Daniela Rocha", agentId: "a1", agentName: "Ana Flores",
    airline: "Gol", airlineCode: "G3", pnr: "LP77VB", gds: "Amadeus", ticketNumber: "127-1122334455",
    originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Río de Janeiro", destinationCode: "GIG",
    tripType: "round_trip", travelClass: "premium_economy", travelDate: "2026-06-18", passengerCount: 2,
    fare: bob(11200), taxes: bob(2600), total: bob(13800), commission: bob(1120), profit: bob(1450),
    providerId: "p3", providerName: "Gol Linhas Aéreas", status: "issued", createdAt: "2026-06-02T10:00:00Z",
  },
  {
    id: "t6", code: "FA-20423", customerId: "c10", customerName: "Patricia Vaca", agentId: "a2", agentName: "Carlos Mendoza",
    airline: "Copa", airlineCode: "CM", pnr: "MN22KL", gds: "Amadeus", ticketNumber: "230-5566778899",
    originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Nueva York", destinationCode: "JFK",
    tripType: "round_trip", travelClass: "economy", travelDate: "2026-08-01", passengerCount: 2,
    fare: bob(15600), taxes: bob(3400), total: bob(19000), commission: bob(1560), profit: bob(1900),
    providerId: "p5", providerName: "Copa Airlines", status: "quote", createdAt: "2026-06-29T16:00:00Z",
  },
  {
    id: "t7", code: "FA-20410", customerId: "c5", customerName: "Carmen Justiniano", agentId: "a1", agentName: "Ana Flores",
    airline: "American Airlines", airlineCode: "AA", pnr: "BV88GH", gds: "Sabre", ticketNumber: "001-2233445566",
    originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Orlando", destinationCode: "MCO",
    tripType: "round_trip", travelClass: "economy", travelDate: "2026-05-20", passengerCount: 3,
    fare: bob(18900), taxes: bob(4200), total: bob(23100), commission: bob(1890), profit: bob(2300),
    providerId: "p2", providerName: "American Airlines", status: "refunded", createdAt: "2026-04-15T10:00:00Z",
  },
  {
    id: "t8", code: "FA-20411", customerId: "c12", customerName: "Sofía Antelo", agentId: "a3", agentName: "Lucía Pérez",
    airline: "Copa", airlineCode: "CM", pnr: "TY11RS", gds: "Amadeus", ticketNumber: "230-9988776655",
    originCity: "Santa Cruz", originCode: "VVI", destinationCity: "Cartagena", destinationCode: "CTG",
    tripType: "round_trip", travelClass: "economy", travelDate: "2026-06-25", passengerCount: 1,
    fare: bob(7100), taxes: bob(1700), total: bob(8800), commission: bob(710), profit: bob(760),
    providerId: "p5", providerName: "Copa Airlines", status: "issued", createdAt: "2026-06-05T12:00:00Z",
  },
  {
    id: "t9", code: "FA-20424", customerId: "c2", customerName: "María Salazar", agentId: "a3", agentName: "Lucía Pérez",
    airline: "Avianca", airlineCode: "AV", pnr: "ZZ44WW", gds: "Sabre", ticketNumber: "134-6677889900",
    originCity: "La Paz", originCode: "LPB", destinationCity: "Punta Cana", destinationCode: "PUJ",
    tripType: "round_trip", travelClass: "economy", travelDate: "2026-12-12", passengerCount: 2,
    fare: bob(16800), taxes: bob(3700), total: bob(20500), commission: bob(1680), profit: bob(2050),
    providerId: "p6", providerName: "Avianca", status: "reserved", createdAt: "2026-06-30T11:30:00Z",
  },
  {
    id: "t10", code: "FA-20425", customerId: "c6", customerName: "Jorge Mamani", agentId: "a2", agentName: "Carlos Mendoza",
    airline: "BoA", airlineCode: "OB", pnr: "HH99QP", gds: "Amadeus", ticketNumber: "930-1212343456",
    originCity: "La Paz", originCode: "LPB", destinationCity: "Cusco", destinationCode: "CUZ",
    tripType: "one_way", travelClass: "economy", travelDate: "2026-07-15", passengerCount: 1,
    fare: bob(1900), taxes: bob(420), total: bob(2320), commission: bob(190), profit: bob(210),
    providerId: "p7", providerName: "Boliviana de Aviación", status: "cancelled", createdAt: "2026-06-10T08:00:00Z",
  },
];

function buildSegments(t: Ticket): TicketSegment[] {
  const out: TicketSegment[] = [
    {
      id: `${t.id}-s1`, airline: t.airline, airlineCode: t.airlineCode, flightNumber: `${t.airlineCode}${700 + parseInt(t.id.replace(/\D/g, "") || "0", 10)}`,
      originCity: t.originCity, originCode: t.originCode, destinationCity: t.destinationCity, destinationCode: t.destinationCode,
      departAt: `${t.travelDate}T08:40:00Z`, arriveAt: `${t.travelDate}T19:25:00Z`, travelClass: t.travelClass,
    },
  ];
  if (t.tripType === "round_trip") {
    out.push({
      id: `${t.id}-s2`, airline: t.airline, airlineCode: t.airlineCode, flightNumber: `${t.airlineCode}${701 + parseInt(t.id.replace(/\D/g, "") || "0", 10)}`,
      originCity: t.destinationCity, originCode: t.destinationCode, destinationCity: t.originCity, destinationCode: t.originCode,
      departAt: `${t.travelDate}T21:10:00Z`, arriveAt: `${t.travelDate}T23:55:00Z`, travelClass: t.travelClass,
    });
  }
  return out;
}

function buildExtras(t: Ticket): TicketExtras {
  return {
    baggage: t.travelClass === "business" ? "2 × 32 kg" : "1 × 23 kg",
    seat: t.travelClass === "business" ? "2A" : "18C",
    insurance: t.passengerCount > 1 || t.travelClass !== "economy",
    services: t.travelClass === "business" ? ["Sala VIP", "Comida especial"] : t.passengerCount > 2 ? ["Asientos juntos"] : [],
  };
}

export function findTicket(id: string): TicketDetail | null {
  const t = MOCK_TICKETS.find((x) => x.id === id);
  if (!t) return null;
  return { ...t, segments: buildSegments(t), extras: buildExtras(t) };
}
