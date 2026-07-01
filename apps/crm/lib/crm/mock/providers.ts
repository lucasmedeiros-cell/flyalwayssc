import type { Provider } from "@vialta/types";

const bob = (amount: number) => ({ amount, currency: "BOB" as const });

export const MOCK_PROVIDERS: Provider[] = [
  { id: "pv1", name: "Boliviana de Aviación", type: "airline", contactName: "Mesa comercial", email: "ventas@boa.bo", phone: "+591 2 2900100", city: "Cochabamba", country: "Bolivia", rating: 4.2, status: "active", balance: bob(0), createdAt: "2023-01-10T10:00:00Z" },
  { id: "pv2", name: "Iberia Bolivia", type: "airline", contactName: "Gabriela Soto", email: "gabriela@iberia.com", phone: "+591 3 3445500", city: "Santa Cruz", country: "Bolivia", rating: 4.6, status: "active", balance: bob(14800), createdAt: "2023-02-15T10:00:00Z" },
  { id: "pv3", name: "Riu Hotels & Resorts", type: "hotel", contactName: "Reservas LATAM", email: "latam@riu.com", phone: "+34 971 743 030", city: "Cancún", country: "México", rating: 4.5, status: "active", balance: bob(8400), createdAt: "2023-05-01T10:00:00Z" },
  { id: "pv4", name: "Royal Caribbean", type: "wholesaler", contactName: "Trade Desk", email: "trade@rccl.com", phone: "+1 305 539 6000", city: "Miami", country: "EE.UU.", rating: 4.7, status: "active", balance: bob(19600), createdAt: "2023-03-20T10:00:00Z" },
  { id: "pv5", name: "Assist Card", type: "insurance", contactName: "Soporte agencias", email: "agencias@assistcard.com", phone: "+591 800 100200", city: "La Paz", country: "Bolivia", rating: 4.3, status: "active", balance: bob(0), createdAt: "2023-04-12T10:00:00Z" },
  { id: "pv6", name: "Trans Oriente", type: "transport", contactName: "Marco Rivero", email: "marco@transoriente.bo", phone: "+591 70099887", city: "Santa Cruz", country: "Bolivia", rating: 4.0, status: "active", balance: bob(1200), createdAt: "2024-01-08T10:00:00Z" },
  { id: "pv7", name: "Andes Expeditions", type: "operator", contactName: "Lucía Mamani", email: "info@andesexp.bo", phone: "+591 71200345", city: "Uyuni", country: "Bolivia", rating: 4.4, status: "active", balance: bob(3300), createdAt: "2023-09-14T10:00:00Z" },
  { id: "pv8", name: "Europamundo", type: "wholesaler", contactName: "Agencias Sudamérica", email: "sudamerica@europamundo.com", phone: "+34 915 246 400", city: "Madrid", country: "España", rating: 4.5, status: "active", balance: bob(24500), createdAt: "2023-06-30T10:00:00Z" },
  { id: "pv9", name: "Copa Airlines", type: "airline", contactName: "Mesa BSP", email: "ventas@copaair.com", phone: "+507 217 2672", city: "Panamá", country: "Panamá", rating: 4.4, status: "active", balance: bob(0), createdAt: "2023-02-01T10:00:00Z" },
  { id: "pv10", name: "Meliá Hotels", type: "hotel", contactName: "Reservas corporativas", email: "corp@melia.com", phone: "+34 912 762 700", city: "Buenos Aires", country: "Argentina", rating: 4.2, status: "inactive", balance: bob(0), createdAt: "2024-03-22T10:00:00Z" },
];
