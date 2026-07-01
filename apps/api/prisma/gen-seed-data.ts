/**
 * Generador del dataset de seed del CRM.
 *
 * Importa los MISMOS arreglos mock que consume el frontend (apps/crm) y los
 * vuelca a `crm-seed.json`. Así la base sembrada y la UI mock comparten una
 * única fuente de verdad — cero divergencia. Se ejecuta con ts-node:
 *   npx ts-node prisma/gen-seed-data.ts
 * y se regenera cuando cambian los mocks.
 *
 * NOTA: sólo importa archivos cuyos imports son `import type` (se borran en
 * runtime) — evita los que usan el alias `@/` (settings/mock-users del shell).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { MOCK_USERS } from "../../crm/lib/auth/mock-users";
import { MOCK_CUSTOMERS, findCustomer } from "../../crm/lib/crm/mock/customers";
import { MOCK_TICKETS, findTicket } from "../../crm/lib/crm/mock/tickets";
import { MOCK_QUOTES } from "../../crm/lib/crm/mock/quotes";
import { MOCK_PAYMENTS } from "../../crm/lib/crm/mock/payments";
import { MOCK_DOCUMENTS } from "../../crm/lib/crm/mock/documents";
import { MOCK_PACKAGES } from "../../crm/lib/crm/mock/packages";
import { MOCK_PROVIDERS } from "../../crm/lib/crm/mock/providers";
import { MOCK_TASKS } from "../../crm/lib/crm/mock/tasks";
import { MOCK_AGENTS } from "../../crm/lib/crm/mock/agents";
import { MOCK_CALENDAR_EVENTS } from "../../crm/lib/crm/mock/calendar";
import { MOCK_MARKETING } from "../../crm/lib/crm/mock/marketing";
import { MOCK_AUTOMATIONS } from "../../crm/lib/crm/mock/automations";
import { MOCK_NOTIFICATIONS } from "../../crm/lib/crm/mock/notifications";
import { MOCK_DASHBOARD } from "../../crm/lib/crm/mock/dashboard";
import { MOCK_REPORTS } from "../../crm/lib/crm/mock/reports";

const data = {
  // contraseña demo para todos los usuarios sembrados (se hashea en el seed)
  defaultPassword: "demo1234",
  users: MOCK_USERS,
  agents: MOCK_AGENTS,
  customers: MOCK_CUSTOMERS.map((c) => findCustomer(c.id) ?? c),
  tickets: MOCK_TICKETS.map((t) => findTicket(t.id) ?? t),
  quotes: MOCK_QUOTES,
  payments: MOCK_PAYMENTS,
  documents: MOCK_DOCUMENTS,
  packages: MOCK_PACKAGES,
  providers: MOCK_PROVIDERS,
  tasks: MOCK_TASKS,
  calendar: MOCK_CALENDAR_EVENTS,
  campaigns: MOCK_MARKETING.campaigns,
  funnel: MOCK_MARKETING.funnel,
  automations: MOCK_AUTOMATIONS,
  notifications: MOCK_NOTIFICATIONS,
  dashboard: MOCK_DASHBOARD,
  reports: MOCK_REPORTS,
};

const out = join(__dirname, "crm-seed.json");
writeFileSync(out, JSON.stringify(data, null, 2), "utf8");
console.log(
  `crm-seed.json generado: ${data.users.length} usuarios, ${data.agents.length} agentes, ${data.customers.length} clientes, ${data.tickets.length} pasajes, ${data.quotes.length} cotizaciones, ${data.payments.length} pagos, ${data.documents.length} documentos, ${data.packages.length} paquetes, ${data.providers.length} proveedores, ${data.tasks.length} tareas, ${data.calendar.length} eventos, ${data.campaigns.length} campañas, ${data.automations.length} automatizaciones, ${data.notifications.length} notificaciones.`,
);
