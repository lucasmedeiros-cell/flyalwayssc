import { PrismaClient, TransportMode, TravelClass } from "@prisma/client";
import { hashSync } from "bcryptjs";
import crmData from "./crm-seed.json";

const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const d = (iso?: string | null): Date | null => (iso ? new Date(iso) : null);
const money = (m?: { amount: number } | null): number => (m ? m.amount : 0);
const cur = (m?: { currency: string } | null, fallback = "BOB"): string => m?.currency ?? fallback;

/* ------------------------------------------------------------------ */
/* Seed de transporte (dominio público existente)                      */
/* ------------------------------------------------------------------ */

async function seedTransport() {
  const lim = await prisma.place.upsert({
    where: { code: "LIM" },
    update: {},
    create: { code: "LIM", name: "Lima", city: "Lima", country: "Perú", countryCode: "PE", kind: "airport" },
  });
  const cuz = await prisma.place.upsert({
    where: { code: "CUZ" },
    update: {},
    create: { code: "CUZ", name: "Cusco", city: "Cusco", country: "Perú", countryCode: "PE", kind: "airport" },
  });
  const andina = await prisma.company.upsert({
    where: { slug: "andina-air" },
    update: {},
    create: { name: "Andina Air", slug: "andina-air", modes: [TransportMode.AIR], logoMark: "AA", brandColor: "#6a5cff", rating: 4.6, countryCode: "PE" },
  });
  const route = await prisma.route.create({
    data: { companyId: andina.id, mode: TransportMode.AIR, originId: lim.id, destinationId: cuz.id },
  });
  const vehicle = await prisma.vehicle.create({
    data: { companyId: andina.id, mode: TransportMode.AIR, name: "Airbus A320neo", capacity: 180 },
  });
  await prisma.trip.create({
    data: {
      companyId: andina.id, routeId: route.id, vehicleId: vehicle.id, mode: TransportMode.AIR, travelClass: TravelClass.ECONOMY,
      departAt: new Date("2026-07-01T08:30:00Z"), arriveAt: new Date("2026-07-01T10:05:00Z"), durationMin: 95, stops: 0,
      priceAmount: 219.9, priceCurrency: "PEN", seatsTotal: 180, seatsAvailable: 42, baggageIncluded: true, amenities: ["wifi", "power", "ac", "meal"],
    },
  });
}

/* ------------------------------------------------------------------ */
/* Seed del CRM FLYALWAYS (desde crm-seed.json — misma fuente que la UI) */
/* ------------------------------------------------------------------ */

async function seedCrm() {
  const data = crmData as any;

  // Limpieza idempotente (orden inverso a las FKs)
  await prisma.crmNotification.deleteMany();
  await prisma.crmAutomation.deleteMany();
  await prisma.crmFunnelStage.deleteMany();
  await prisma.crmCampaign.deleteMany();
  await prisma.crmCalendarEvent.deleteMany();
  await prisma.crmTask.deleteMany();
  await prisma.crmProvider.deleteMany();
  await prisma.crmPackage.deleteMany();
  await prisma.crmDocument.deleteMany();
  await prisma.crmPayment.deleteMany();
  await prisma.crmQuote.deleteMany();
  await prisma.crmTicket.deleteMany();
  await prisma.crmCustomer.deleteMany();
  await prisma.crmAgent.deleteMany();
  await prisma.crmSession.deleteMany();
  await prisma.crmAuditEntry.deleteMany();
  await prisma.crmUser.deleteMany();

  // Usuarios (bcrypt sobre la contraseña demo)
  const passwordHash = hashSync(data.defaultPassword ?? "demo1234", 10);
  for (const u of data.users) {
    await prisma.crmUser.create({
      data: {
        id: u.id, name: u.name, initials: u.initials, email: u.email, passwordHash, role: u.role,
        color: u.color ?? null, active: u.active ?? true, twoFactorEnabled: u.twoFactorEnabled ?? false,
        lastActiveAt: d(u.lastActiveAt),
      },
    });
  }

  // Sesión activa + auditoría de login por usuario (panel de Ajustes)
  for (const u of data.users) {
    await prisma.crmSession.create({
      data: { userId: u.id, device: "Escritorio", browser: "Chrome 138", ip: "190.129.0.10", location: "La Paz, BO", current: u.role === "admin", lastActiveAt: d(u.lastActiveAt) ?? new Date() },
    });
    await prisma.crmAuditEntry.create({
      data: { actor: u.name, actorInitials: u.initials, action: "login", entity: "Sesión", detail: `Inicio de sesión de ${u.email}`, ip: "190.129.0.10", at: d(u.lastActiveAt) ?? new Date() },
    });
  }

  // Agentes
  for (const a of data.agents) {
    await prisma.crmAgent.create({
      data: {
        id: a.id, name: a.name, initials: a.initials, email: a.email, role: a.role, sales: a.sales ?? 0,
        revenueAmount: money(a.revenue), commissionPct: a.commissionPct ?? 0, commissionEarned: money(a.commissionEarned),
        goalAmount: money(a.goal), goalPct: a.goalPct ?? 0, activeClients: a.activeClients ?? 0, rating: a.rating ?? 0,
        status: a.status ?? "active", currency: cur(a.revenue), joinedAt: d(a.joinedAt) ?? new Date(),
      },
    });
  }
  const agentIds = new Set(data.agents.map((a: any) => a.id));

  // Clientes (con archivos + actividad como Json). FK al agente asignado.
  for (const c of data.customers) {
    await prisma.crmCustomer.create({
      data: {
        id: c.id, firstName: c.firstName, lastName: c.lastName, documentType: c.documentType, documentNumber: c.documentNumber,
        passportNumber: c.passportNumber ?? null, passportExpiry: d(c.passportExpiry), birthDate: d(c.birthDate),
        nationality: c.nationality, phone: c.phone ?? null, whatsapp: c.whatsapp ?? null, email: c.email,
        address: c.address ?? null, city: c.city ?? null, country: c.country,
        assignedAgentId: agentIds.has(c.assignedAgentId) ? c.assignedAgentId : data.agents[0].id,
        assignedAgentName: c.assignedAgentName, status: c.status, tags: c.tags ?? [], notes: c.notes ?? null,
        totalSpentAmount: money(c.totalSpent), currency: cur(c.totalSpent), tripsCount: c.tripsCount ?? 0,
        favoriteDestinations: c.favoriteDestinations ?? [], favoriteAirlines: c.favoriteAirlines ?? [],
        files: c.files ?? [], activity: c.activity ?? [], createdAt: d(c.createdAt) ?? new Date(), lastActivityAt: d(c.lastActivityAt),
      },
    });
  }
  const customerIds = new Set(data.customers.map((c: any) => c.id));

  // Pasajes (segmentos + extras Json). customerId sólo si el cliente existe.
  for (const t of data.tickets) {
    await prisma.crmTicket.create({
      data: {
        id: t.id, code: t.code, customerId: customerIds.has(t.customerId) ? t.customerId : null, customerName: t.customerName,
        agentId: t.agentId, agentName: t.agentName, airline: t.airline, airlineCode: t.airlineCode, pnr: t.pnr ?? null,
        gds: t.gds ?? null, ticketNumber: t.ticketNumber ?? null, originCity: t.originCity, originCode: t.originCode,
        destinationCity: t.destinationCity, destinationCode: t.destinationCode, tripType: t.tripType, travelClass: t.travelClass,
        travelDate: d(t.travelDate) ?? new Date(), passengerCount: t.passengerCount ?? 1, fareAmount: money(t.fare),
        taxesAmount: money(t.taxes), totalAmount: money(t.total), commissionAmount: money(t.commission), profitAmount: money(t.profit),
        currency: cur(t.total), providerId: t.providerId, providerName: t.providerName, status: t.status,
        segments: t.segments ?? [], extras: t.extras ?? {}, createdAt: d(t.createdAt) ?? new Date(),
      },
    });
  }

  // Cotizaciones
  for (const q of data.quotes) {
    await prisma.crmQuote.create({
      data: {
        id: q.id, code: q.code, customerId: customerIds.has(q.customerId) ? q.customerId : null, customerName: q.customerName,
        customerEmail: q.customerEmail ?? null, customerPhone: q.customerPhone ?? null, agentName: q.agentName,
        items: q.items ?? [], currency: q.currency ?? "BOB", taxPct: q.taxPct ?? 0, validUntil: d(q.validUntil) ?? new Date(),
        status: q.status, notes: q.notes ?? null, createdAt: d(q.createdAt) ?? new Date(),
      },
    });
  }

  // Pagos (abonos Json)
  for (const p of data.payments) {
    await prisma.crmPayment.create({
      data: {
        id: p.id, code: p.code, customerId: customerIds.has(p.customerId) ? p.customerId : null, customerName: p.customerName,
        concept: p.concept, relatedCode: p.relatedCode ?? null, method: p.method, totalAmount: money(p.total), paidAmount: money(p.paid),
        currency: cur(p.total), status: p.status, dueDate: d(p.dueDate), agentName: p.agentName, transactions: p.transactions ?? [],
        createdAt: d(p.createdAt) ?? new Date(),
      },
    });
  }

  // Documentos
  for (const doc of data.documents) {
    await prisma.crmDocument.create({
      data: {
        id: doc.id, code: doc.code, kind: doc.kind, customerName: doc.customerName, customerEmail: doc.customerEmail ?? null,
        customerPhone: doc.customerPhone ?? null, relatedCode: doc.relatedCode ?? null, concept: doc.concept,
        amountValue: doc.amount ? money(doc.amount) : null, currency: cur(doc.amount), issuedAt: d(doc.issuedAt) ?? new Date(),
        status: doc.status, agentName: doc.agentName, createdAt: d(doc.createdAt) ?? new Date(),
      },
    });
  }

  // Paquetes
  for (const pk of data.packages) {
    await prisma.crmPackage.create({
      data: {
        id: pk.id, code: pk.code, name: pk.name, type: pk.type, destination: pk.destination, durationDays: pk.durationDays ?? 1,
        priceAmount: money(pk.price), currency: cur(pk.price), providerName: pk.providerName, includes: pk.includes ?? [],
        status: pk.status, soldCount: pk.soldCount ?? 0, description: pk.description ?? null, createdAt: d(pk.createdAt) ?? new Date(),
      },
    });
  }

  // Proveedores
  for (const pv of data.providers) {
    await prisma.crmProvider.create({
      data: {
        id: pv.id, name: pv.name, type: pv.type, contactName: pv.contactName ?? null, email: pv.email ?? null, phone: pv.phone ?? null,
        city: pv.city ?? null, country: pv.country, rating: pv.rating ?? 0, status: pv.status,
        balanceAmount: pv.balance ? money(pv.balance) : null, currency: cur(pv.balance), notes: pv.notes ?? null,
        createdAt: d(pv.createdAt) ?? new Date(),
      },
    });
  }

  // Tareas
  for (const tk of data.tasks) {
    await prisma.crmTask.create({
      data: {
        id: tk.id, title: tk.title, description: tk.description ?? null, priority: tk.priority, status: tk.status,
        dueDate: d(tk.dueDate), assigneeId: tk.assigneeId, assignee: tk.assignee, assigneeInitials: tk.assigneeInitials,
        relatedTo: tk.relatedTo ?? null, createdAt: d(tk.createdAt) ?? new Date(),
      },
    });
  }

  // Calendario
  for (const ev of data.calendar) {
    await prisma.crmCalendarEvent.create({
      data: { id: ev.id, kind: ev.kind, title: ev.title, date: new Date(ev.date), time: ev.time ?? null, customerName: ev.customerName ?? null },
    });
  }

  // Campañas
  for (const cm of data.campaigns) {
    await prisma.crmCampaign.create({
      data: {
        id: cm.id, name: cm.name, channel: cm.channel, status: cm.status, audience: cm.audience, subject: cm.subject ?? null,
        owner: cm.owner, scheduledAt: d(cm.scheduledAt), sentAt: d(cm.sentAt), metricsAudience: cm.metrics?.audience ?? 0,
        sent: cm.metrics?.sent ?? 0, opened: cm.metrics?.opened ?? 0, clicked: cm.metrics?.clicked ?? 0, converted: cm.metrics?.converted ?? 0,
        revenueAmount: cm.metrics?.revenue ? money(cm.metrics.revenue) : null, currency: cur(cm.metrics?.revenue), createdAt: d(cm.createdAt) ?? new Date(),
      },
    });
  }

  // Embudo
  let order = 0;
  for (const f of data.funnel) {
    await prisma.crmFunnelStage.create({ data: { label: f.label, value: f.value, sortOrder: order++ } });
  }

  // Automatizaciones
  for (const au of data.automations) {
    await prisma.crmAutomation.create({
      data: { id: au.id, name: au.name, trigger: au.trigger, channel: au.channel, status: au.status, timing: au.timing, runs: au.runs ?? 0, lastRunAt: d(au.lastRunAt), createdAt: d(au.createdAt) ?? new Date() },
    });
  }

  // Notificaciones
  for (const nt of data.notifications) {
    await prisma.crmNotification.create({
      data: { id: nt.id, kind: nt.kind, channel: nt.channel, status: nt.status, title: nt.title, body: nt.body, recipient: nt.recipient ?? null, at: d(nt.at) ?? new Date() },
    });
  }

  // Snapshots de agregados (dashboard + reportes)
  await prisma.crmSnapshot.upsert({ where: { key: "dashboard" }, update: { data: data.dashboard }, create: { key: "dashboard", data: data.dashboard } });
  await prisma.crmSnapshot.upsert({ where: { key: "reports" }, update: { data: data.reports }, create: { key: "reports", data: data.reports } });
}

async function main() {
  await seedTransport();
  await seedCrm();
  const data = crmData as any;
  console.log(
    `Seed completado. Transporte: 2 lugares, 1 empresa, 1 viaje. ` +
      `CRM: ${data.users.length} usuarios, ${data.agents.length} agentes, ${data.customers.length} clientes, ${data.tickets.length} pasajes, ${data.payments.length} pagos, ${data.providers.length} proveedores y más.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
