/**
 * Mappers Prisma → formas del frontend (@vialta/types).
 * - Decimal → number (Money { amount, currency }).
 * - Date    → ISO string (ISODateTime) o "YYYY-MM-DD" (ISODate).
 * Las columnas Json (segmentos, ítems, abonos, archivos, actividad) ya vienen
 * en la forma correcta desde el seed, se devuelven tal cual.
 */
import type {
  CrmAgent,
  CrmCalendarEvent,
  CrmCampaign,
  CrmAutomation,
  CrmCustomer,
  CrmDocument,
  CrmNotification,
  CrmPackage,
  CrmPayment,
  CrmProvider,
  CrmQuote,
  CrmTask,
  CrmTicket,
  CrmUser,
  CrmSession,
  CrmAuditEntry,
} from "@prisma/client";

const num = (d: unknown): number => (d == null ? 0 : Number(d as never));
const iso = (dt: Date | null | undefined): string | undefined => (dt ? dt.toISOString() : undefined);
const isoReq = (dt: Date): string => dt.toISOString();
const date = (dt: Date | null | undefined): string | undefined => (dt ? dt.toISOString().slice(0, 10) : undefined);
const dateReq = (dt: Date): string => dt.toISOString().slice(0, 10);
const money = (amount: unknown, currency: string) => ({ amount: num(amount), currency });

export function mapAgent(a: CrmAgent) {
  return {
    id: a.id,
    name: a.name,
    initials: a.initials,
    email: a.email,
    role: a.role,
    sales: a.sales,
    revenue: money(a.revenueAmount, a.currency),
    commissionPct: a.commissionPct,
    commissionEarned: money(a.commissionEarned, a.currency),
    goal: money(a.goalAmount, a.currency),
    goalPct: a.goalPct,
    activeClients: a.activeClients,
    rating: a.rating,
    status: a.status,
    joinedAt: dateReq(a.joinedAt),
  };
}

export function mapCustomer(c: CrmCustomer) {
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    documentType: c.documentType,
    documentNumber: c.documentNumber,
    passportNumber: c.passportNumber ?? undefined,
    passportExpiry: date(c.passportExpiry),
    birthDate: date(c.birthDate),
    nationality: c.nationality,
    phone: c.phone ?? undefined,
    whatsapp: c.whatsapp ?? undefined,
    email: c.email,
    address: c.address ?? undefined,
    city: c.city ?? undefined,
    country: c.country,
    assignedAgentId: c.assignedAgentId,
    assignedAgentName: c.assignedAgentName,
    status: c.status,
    tags: c.tags,
    notes: c.notes ?? undefined,
    totalSpent: money(c.totalSpentAmount, c.currency),
    tripsCount: c.tripsCount,
    favoriteDestinations: c.favoriteDestinations,
    favoriteAirlines: c.favoriteAirlines,
    createdAt: isoReq(c.createdAt),
    lastActivityAt: iso(c.lastActivityAt),
  };
}

export function mapCustomerDetail(c: CrmCustomer) {
  return { ...mapCustomer(c), files: (c.files as unknown[]) ?? [], activity: (c.activity as unknown[]) ?? [] };
}

export function mapTicket(t: CrmTicket) {
  return {
    id: t.id,
    code: t.code,
    customerId: t.customerId ?? "",
    customerName: t.customerName,
    agentId: t.agentId,
    agentName: t.agentName,
    airline: t.airline,
    airlineCode: t.airlineCode,
    pnr: t.pnr ?? undefined,
    gds: t.gds ?? undefined,
    ticketNumber: t.ticketNumber ?? undefined,
    originCity: t.originCity,
    originCode: t.originCode,
    destinationCity: t.destinationCity,
    destinationCode: t.destinationCode,
    tripType: t.tripType,
    travelClass: t.travelClass,
    travelDate: dateReq(t.travelDate),
    passengerCount: t.passengerCount,
    fare: money(t.fareAmount, t.currency),
    taxes: money(t.taxesAmount, t.currency),
    total: money(t.totalAmount, t.currency),
    commission: money(t.commissionAmount, t.currency),
    profit: money(t.profitAmount, t.currency),
    providerId: t.providerId,
    providerName: t.providerName,
    status: t.status,
    createdAt: isoReq(t.createdAt),
  };
}

export function mapTicketDetail(t: CrmTicket) {
  return { ...mapTicket(t), segments: (t.segments as unknown[]) ?? [], extras: (t.extras as unknown) ?? { insurance: false, services: [] } };
}

export function mapQuote(q: CrmQuote) {
  return {
    id: q.id,
    code: q.code,
    customerId: q.customerId ?? undefined,
    customerName: q.customerName,
    customerEmail: q.customerEmail ?? undefined,
    customerPhone: q.customerPhone ?? undefined,
    agentName: q.agentName,
    items: (q.items as unknown[]) ?? [],
    currency: q.currency,
    taxPct: q.taxPct,
    validUntil: dateReq(q.validUntil),
    status: q.status,
    notes: q.notes ?? undefined,
    createdAt: isoReq(q.createdAt),
  };
}

export function mapPayment(p: CrmPayment) {
  return {
    id: p.id,
    code: p.code,
    customerId: p.customerId ?? undefined,
    customerName: p.customerName,
    concept: p.concept,
    relatedCode: p.relatedCode ?? undefined,
    method: p.method,
    total: money(p.totalAmount, p.currency),
    paid: money(p.paidAmount, p.currency),
    status: p.status,
    dueDate: date(p.dueDate),
    agentName: p.agentName,
    createdAt: isoReq(p.createdAt),
    transactions: (p.transactions as unknown[]) ?? [],
  };
}

export function mapDocument(doc: CrmDocument) {
  return {
    id: doc.id,
    code: doc.code,
    kind: doc.kind,
    customerName: doc.customerName,
    customerEmail: doc.customerEmail ?? undefined,
    customerPhone: doc.customerPhone ?? undefined,
    relatedCode: doc.relatedCode ?? undefined,
    concept: doc.concept,
    amount: doc.amountValue != null ? money(doc.amountValue, doc.currency ?? "BOB") : undefined,
    issuedAt: dateReq(doc.issuedAt),
    status: doc.status,
    agentName: doc.agentName,
    createdAt: isoReq(doc.createdAt),
  };
}

export function mapPackage(pk: CrmPackage) {
  return {
    id: pk.id,
    code: pk.code,
    name: pk.name,
    type: pk.type,
    destination: pk.destination,
    durationDays: pk.durationDays,
    price: money(pk.priceAmount, pk.currency),
    providerName: pk.providerName,
    includes: pk.includes,
    status: pk.status,
    soldCount: pk.soldCount,
    description: pk.description ?? undefined,
    createdAt: isoReq(pk.createdAt),
  };
}

export function mapProvider(pv: CrmProvider) {
  return {
    id: pv.id,
    name: pv.name,
    type: pv.type,
    contactName: pv.contactName ?? undefined,
    email: pv.email ?? undefined,
    phone: pv.phone ?? undefined,
    city: pv.city ?? undefined,
    country: pv.country,
    rating: pv.rating,
    status: pv.status,
    balance: pv.balanceAmount != null ? money(pv.balanceAmount, pv.currency ?? "BOB") : undefined,
    notes: pv.notes ?? undefined,
    createdAt: isoReq(pv.createdAt),
  };
}

export function mapTask(tk: CrmTask) {
  return {
    id: tk.id,
    title: tk.title,
    description: tk.description ?? undefined,
    priority: tk.priority,
    status: tk.status,
    dueDate: date(tk.dueDate),
    assigneeId: tk.assigneeId,
    assignee: tk.assignee,
    assigneeInitials: tk.assigneeInitials,
    relatedTo: tk.relatedTo ?? undefined,
    createdAt: isoReq(tk.createdAt),
  };
}

export function mapCalendarEvent(ev: CrmCalendarEvent) {
  return {
    id: ev.id,
    kind: ev.kind,
    title: ev.title,
    date: dateReq(ev.date),
    time: ev.time ?? undefined,
    customerName: ev.customerName ?? undefined,
  };
}

export function mapCampaign(cm: CrmCampaign) {
  return {
    id: cm.id,
    name: cm.name,
    channel: cm.channel,
    status: cm.status,
    audience: cm.audience,
    subject: cm.subject ?? undefined,
    owner: cm.owner,
    scheduledAt: iso(cm.scheduledAt),
    sentAt: iso(cm.sentAt),
    metrics: {
      audience: cm.metricsAudience,
      sent: cm.sent,
      opened: cm.opened,
      clicked: cm.clicked,
      converted: cm.converted,
      revenue: cm.revenueAmount != null ? money(cm.revenueAmount, cm.currency ?? "BOB") : undefined,
    },
    createdAt: isoReq(cm.createdAt),
  };
}

export function mapAutomation(au: CrmAutomation) {
  return {
    id: au.id,
    name: au.name,
    trigger: au.trigger,
    channel: au.channel,
    status: au.status,
    timing: au.timing,
    runs: au.runs,
    lastRunAt: iso(au.lastRunAt),
    createdAt: isoReq(au.createdAt),
  };
}

export function mapNotification(nt: CrmNotification) {
  return {
    id: nt.id,
    kind: nt.kind,
    channel: nt.channel,
    status: nt.status,
    title: nt.title,
    body: nt.body,
    recipient: nt.recipient ?? undefined,
    at: isoReq(nt.at),
  };
}

export function mapUser(u: CrmUser) {
  return {
    id: u.id,
    name: u.name,
    initials: u.initials,
    email: u.email,
    role: u.role,
    color: u.color ?? undefined,
    active: u.active,
    twoFactorEnabled: u.twoFactorEnabled,
    lastActiveAt: iso(u.lastActiveAt),
  };
}

export function mapSession(s: CrmSession) {
  return {
    id: s.id,
    device: s.device,
    browser: s.browser,
    ip: s.ip,
    location: s.location,
    lastActiveAt: isoReq(s.lastActiveAt),
    current: s.current,
  };
}

export function mapAudit(a: CrmAuditEntry) {
  return {
    id: a.id,
    actor: a.actor,
    actorInitials: a.actorInitials,
    action: a.action,
    entity: a.entity,
    detail: a.detail ?? undefined,
    at: isoReq(a.at),
    ip: a.ip ?? undefined,
  };
}
