import type { CrmAgent } from "@vialta/types";

const bob = (amount: number) => ({ amount, currency: "BOB" as const });

export const MOCK_AGENTS: CrmAgent[] = [
  { id: "a1", name: "Ana Flores", initials: "AF", email: "ana@flyalways.bo", role: "admin", sales: 89, revenue: bob(168400), commissionPct: 6, commissionEarned: bob(10104), goal: bob(150000), goalPct: 112, activeClients: 42, rating: 4.9, status: "active", joinedAt: "2022-03-01" },
  { id: "a2", name: "Carlos Mendoza", initials: "CM", email: "carlos@flyalways.bo", role: "supervisor", sales: 76, revenue: bob(142800), commissionPct: 5, commissionEarned: bob(7140), goal: bob(150000), goalPct: 95, activeClients: 38, rating: 4.7, status: "active", joinedAt: "2022-08-15" },
  { id: "a3", name: "Lucía Pérez", initials: "LP", email: "lucia@flyalways.bo", role: "agent", sales: 64, revenue: bob(118900), commissionPct: 5, commissionEarned: bob(5945), goal: bob(135000), goalPct: 88, activeClients: 31, rating: 4.6, status: "active", joinedAt: "2023-01-20" },
  { id: "a4", name: "Diego Rojas", initials: "DR", email: "diego@flyalways.bo", role: "accounting", sales: 0, revenue: bob(0), commissionPct: 0, commissionEarned: bob(0), goal: bob(0), goalPct: 0, activeClients: 0, rating: 4.5, status: "active", joinedAt: "2023-06-10" },
  { id: "a5", name: "María Salazar", initials: "MS", email: "maria@flyalways.bo", role: "marketing", sales: 12, revenue: bob(28600), commissionPct: 3, commissionEarned: bob(858), goal: bob(40000), goalPct: 71, activeClients: 9, rating: 4.4, status: "active", joinedAt: "2024-02-01" },
];
