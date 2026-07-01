"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, PlaneTakeoff, PlaneLanding, Luggage, Armchair, ShieldCheck, Sparkles,
  CalendarClock, UserCog, Building2, Hash, CalendarCog, UserPen,
} from "lucide-react";
import type { TicketDetail, TicketStatus, CrmPermission } from "@vialta/types";
import {
  TICKET_STATUS_LABEL, TICKET_TRIP_TYPE_LABEL, TICKET_NEXT_STATUS, TRAVEL_CLASS_LABEL,
} from "@vialta/types";
import { Avatar, Badge, Button, Modal, Input, Field, cn, formatMoney, formatDate, formatTime } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { TICKET_STATUS_TONE } from "./ticket-utils";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "glass" | "danger";

const ACTION: Record<TicketStatus, { label: string; variant: ButtonVariant; perm: CrmPermission }> = {
  quote: { label: "Cotización", variant: "ghost", perm: "tickets.sell" },
  reserved: { label: "Reservar", variant: "outline", perm: "tickets.sell" },
  confirmed: { label: "Confirmar", variant: "primary", perm: "tickets.sell" },
  issued: { label: "Emitir boleto", variant: "primary", perm: "tickets.sell" },
  reissued: { label: "Reemitir", variant: "accent", perm: "tickets.refund" },
  refunded: { label: "Reembolsar", variant: "danger", perm: "tickets.refund" },
  cancelled: { label: "Cancelar", variant: "danger", perm: "tickets.sell" },
};

export function TicketDetailView({ ticket }: { ticket: TicketDetail }) {
  const { can } = useAuth();
  const [t, setT] = useState<TicketDetail>(ticket);
  const [dateOpen, setDateOpen] = useState(false);
  const [paxOpen, setPaxOpen] = useState(false);
  const [newDate, setNewDate] = useState(ticket.travelDate);
  const [newPax, setNewPax] = useState(ticket.customerName);

  const nextStates = TICKET_NEXT_STATUS[t.status];

  const facts = [
    { icon: Hash, label: "PNR / GDS", value: `${t.pnr ?? "—"} · ${t.gds ?? "—"}` },
    { icon: Hash, label: "N° de boleto", value: t.ticketNumber ?? "—" },
    { icon: CalendarClock, label: "Fecha de viaje", value: formatDate(t.travelDate) },
    { icon: UserCog, label: "Agente", value: t.agentName },
    { icon: Building2, label: "Proveedor", value: t.providerName },
    { icon: Sparkles, label: "Tipo / clase", value: `${TICKET_TRIP_TYPE_LABEL[t.tripType]} · ${TRAVEL_CLASS_LABEL[t.travelClass]}` },
  ];

  const fin = [
    { label: "Tarifa", value: t.fare },
    { label: "Impuestos", value: t.taxes },
    { label: "Total", value: t.total, strong: true },
    { label: "Comisión", value: t.commission },
    { label: "Utilidad", value: t.profit, good: true },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/pasajes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Pasajes
      </Link>

      {/* Cabecera */}
      <div className="mt-4 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar initials={t.airlineCode} size={56} color="#3a23a8" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums tracking-tight">{t.code}</h1>
                <Badge tone={TICKET_STATUS_TONE[t.status]}>{TICKET_STATUS_LABEL[t.status]}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.customerName} · {t.originCity} ({t.originCode}) → {t.destinationCity} ({t.destinationCode}) · {t.passengerCount} pax
              </p>
            </div>
          </div>
          <span className="text-right">
            <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">Total</span>
            <span className="block font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums">{formatMoney(t.total.amount, t.total.currency)}</span>
          </span>
        </div>

        {/* Acciones de estado */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
          {nextStates.length === 0 && (
            <span className="text-sm text-muted-foreground">Sin acciones disponibles para el estado actual.</span>
          )}
          {nextStates.map((ns) => {
            const a = ACTION[ns];
            if (!can(a.perm)) return null;
            return (
              <Button key={ns} variant={a.variant} size="sm" onClick={() => setT((p) => ({ ...p, status: ns }))}>
                {a.label}
              </Button>
            );
          })}
          {can("tickets.sell") && t.status !== "cancelled" && t.status !== "refunded" && (
            <>
              <Button variant="outline" size="sm" onClick={() => setDateOpen(true)}>
                <CalendarCog className="h-4 w-4" /> Cambiar fecha
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPaxOpen(true)}>
                <UserPen className="h-4 w-4" /> Cambiar pasajero
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Itinerario */}
        <div className="lg:col-span-2">
          <Panel title="Itinerario">
            <ul className="space-y-4">
              {t.segments.map((s) => (
                <li key={s.id} className="rounded-2xl border border-border bg-background/40 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{s.airline} · {s.flightNumber}</span>
                    <span>{TRAVEL_CLASS_LABEL[s.travelClass]}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-center">
                      <p className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">{s.originCode}</p>
                      <p className="text-[11px] text-muted-foreground">{formatTime(s.departAt)}</p>
                    </div>
                    <div className="flex flex-1 items-center gap-2 text-muted-foreground">
                      <PlaneTakeoff className="h-4 w-4" />
                      <span className="h-px flex-1 bg-border" />
                      <PlaneLanding className="h-4 w-4" />
                    </div>
                    <div className="text-center">
                      <p className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">{s.destinationCode}</p>
                      <p className="text-[11px] text-muted-foreground">{formatTime(s.arriveAt)}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {s.originCity} → {s.destinationCity} · {formatDate(s.departAt)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Extras */}
          <div className="mt-6">
            <Panel title="Extras y servicios">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Extra icon={Luggage} label="Equipaje" value={t.extras.baggage ?? "—"} on={!!t.extras.baggage} />
                <Extra icon={Armchair} label="Asiento" value={t.extras.seat ?? "—"} on={!!t.extras.seat} />
                <Extra icon={ShieldCheck} label="Seguro" value={t.extras.insurance ? "Incluido" : "No"} on={t.extras.insurance} />
                <Extra icon={Sparkles} label="Servicios" value={t.extras.services.length ? `${t.extras.services.length}` : "—"} on={t.extras.services.length > 0} />
              </div>
              {t.extras.services.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.extras.services.map((sv) => (
                    <span key={sv} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground">{sv}</span>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </div>

        {/* Finanzas + datos */}
        <div className="space-y-6">
          <Panel title="Finanzas">
            <ul className="space-y-2.5 text-sm">
              {fin.map((f) => (
                <li key={f.label} className={cn("flex items-center justify-between", f.strong && "border-t border-border pt-2.5 font-semibold")}>
                  <span className={cn("text-muted-foreground", f.strong && "text-foreground")}>{f.label}</span>
                  <span className={cn("tabular-nums", f.good && "text-success font-semibold", f.strong && "text-base")}>
                    {formatMoney(f.value.amount, f.value.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Detalles">
            <ul className="space-y-3 text-sm">
              {facts.map((f) => (
                <li key={f.label} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground">
                    <f.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">{f.label}</span>
                    <span className="block font-medium">{f.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* Modales cambiar fecha / pasajero */}
      <Modal
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        title="Cambiar fecha de viaje"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDateOpen(false)}>Cancelar</Button>
            <Button onClick={() => { setT((p) => ({ ...p, travelDate: newDate })); setDateOpen(false); }}>Guardar</Button>
          </>
        }
      >
        <Field label="Nueva fecha de viaje" htmlFor="nd">
          <Input id="nd" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        </Field>
      </Modal>

      <Modal
        open={paxOpen}
        onClose={() => setPaxOpen(false)}
        title="Cambiar pasajero titular"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPaxOpen(false)}>Cancelar</Button>
            <Button onClick={() => { setT((p) => ({ ...p, customerName: newPax })); setPaxOpen(false); }}>Guardar</Button>
          </>
        }
      >
        <Field label="Nombre del pasajero" htmlFor="np">
          <Input id="np" value={newPax} onChange={(e) => setNewPax(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Extra({ icon: Icon, label, value, on }: { icon: typeof Luggage; label: string; value: string; on: boolean }) {
  return (
    <div className={cn("rounded-2xl border p-3 text-center", on ? "border-primary/30 bg-primary/5" : "border-border bg-background/40")}>
      <Icon className={cn("mx-auto h-5 w-5", on ? "text-primary" : "text-muted-foreground")} />
      <p className="mt-1.5 text-sm font-medium">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
