import type { CrmReports, ReportAirlineRow, ReportDestinationRow } from "@vialta/types";
import { MOCK_TICKETS } from "./tickets";
import { MOCK_AGENTS } from "./agents";
import { MOCK_PROVIDERS } from "./providers";
import { MOCK_CUSTOMERS } from "./customers";

/* Reportes derivados de los demás mocks (en Fase 9 los calcula la API). */

const SOLD = ["confirmed", "issued", "reissued"];
const sold = MOCK_TICKETS.filter((t) => SOLD.includes(t.status));

const revenue = sold.reduce((a, t) => a + t.total.amount, 0);
const profit = sold.reduce((a, t) => a + t.profit.amount, 0);
const commissions = MOCK_AGENTS.reduce((a, x) => a + x.commissionEarned.amount, 0);
const payable = MOCK_PROVIDERS.reduce((a, p) => a + (p.balance?.amount ?? 0), 0);

function groupAirlines(): ReportAirlineRow[] {
  const map = new Map<string, ReportAirlineRow>();
  for (const t of sold) {
    const r = map.get(t.airline) ?? { airline: t.airline, tickets: 0, revenue: 0 };
    r.tickets += t.passengerCount;
    r.revenue += t.total.amount;
    map.set(t.airline, r);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

function groupDestinations(): ReportDestinationRow[] {
  const map = new Map<string, ReportDestinationRow>();
  for (const t of sold) {
    const r = map.get(t.destinationCity) ?? { destination: t.destinationCity, bookings: 0, revenue: 0 };
    r.bookings += 1;
    r.revenue += t.total.amount;
    map.set(t.destinationCity, r);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export const MOCK_REPORTS: CrmReports = {
  currency: "BOB",
  kpis: [
    { id: "income", label: "Ingresos", value: revenue, unit: "money", deltaPct: 15 },
    { id: "profit", label: "Utilidad", value: profit, unit: "money", deltaPct: 12 },
    { id: "commissions", label: "Comisiones", value: commissions, unit: "money", deltaPct: 8 },
    { id: "expense", label: "Egresos (por pagar)", value: payable, unit: "money", deltaPct: -5, invert: true },
  ],
  monthly: [
    { label: "Feb", income: 312000, expense: 248000, profit: 41000, sales: 198 },
    { label: "Mar", income: 384200, expense: 301000, profit: 52400, sales: 248 },
    { label: "Abr", income: 421700, expense: 332000, profit: 58900, sales: 276 },
    { label: "May", income: 468900, expense: 366000, profit: 64200, sales: 312 },
    { label: "Jun", income: 431100, expense: 338000, profit: 61800, sales: 282 },
  ],
  byAgent: MOCK_AGENTS.filter((a) => a.sales > 0).map((a) => ({
    name: a.name,
    sales: a.sales,
    revenue: a.revenue.amount,
    commission: a.commissionEarned.amount,
  })),
  byDestination: groupDestinations(),
  byAirline: groupAirlines(),
  byProvider: MOCK_PROVIDERS.map((p) => ({
    provider: p.name,
    bookings: sold.filter((t) => t.providerName === p.name).length,
    payable: p.balance?.amount ?? 0,
  })).sort((a, b) => b.payable - a.payable),
  topCustomers: [...MOCK_CUSTOMERS]
    .sort((a, b) => b.totalSpent.amount - a.totalSpent.amount)
    .slice(0, 8)
    .map((c) => ({ name: `${c.firstName} ${c.lastName}`, trips: c.tripsCount, spent: c.totalSpent.amount })),
};
