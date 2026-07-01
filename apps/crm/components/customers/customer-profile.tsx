"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Plane,
  Wallet,
  CalendarClock,
  MapPin,
  IdCard,
  BookUser,
  Cake,
  Globe,
  Home,
  UserCog,
  FileText,
  Image as ImageIcon,
  Download,
  PhoneCall,
  StickyNote,
  CreditCard,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import type { CustomerDetail, CustomerActivityKind, CustomerFile } from "@vialta/types";
import {
  CUSTOMER_STATUS_LABEL,
  CUSTOMER_ACTIVITY_LABEL,
  CUSTOMER_DOCUMENT_TYPE_LABEL,
  CUSTOMER_FILE_LABEL,
  customerInitials,
} from "@vialta/types";
import { Avatar, Badge, Tabs, buttonClasses, cn, formatMoney, formatDate, RelativeTime } from "@vialta/ui";
import { STATUS_TONE } from "./customer-utils";

/** Normaliza un teléfono a dígitos para construir enlaces tel:/wa.me. */
function phoneDigits(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

const TABS = [
  { key: "summary", label: "Resumen" },
  { key: "data", label: "Datos" },
  { key: "history", label: "Historial" },
  { key: "files", label: "Documentos" },
];

const ACTIVITY_ICON: Record<CustomerActivityKind, LucideIcon> = {
  call: PhoneCall,
  message: MessageCircle,
  email: Mail,
  quote: FileText,
  booking: CalendarCheck,
  payment: CreditCard,
  note: StickyNote,
};

export function CustomerProfile({ customer }: { customer: CustomerDetail }) {
  const [tab, setTab] = useState("summary");
  const c = customer;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/clientes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>

      {/* Cabecera */}
      <div className="mt-4 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar initials={customerInitials(c)} size={72} className="text-2xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
                {c.firstName} {c.lastName}
              </h1>
              <Badge tone={STATUS_TONE[c.status]}>{CUSTOMER_STATUS_LABEL[c.status]}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.email} · {c.city ? `${c.city}, ` : ""}{c.country} · Agente: {c.assignedAgentName}
            </p>
            {c.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {c.phone && (
              <a
                href={`tel:${phoneDigits(c.phone)}`}
                aria-label={`Llamar a ${c.firstName}`}
                className={buttonClasses({ variant: "outline", size: "icon" })}
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
            {c.whatsapp && (
              <a
                href={`https://wa.me/${phoneDigits(c.whatsapp).replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escribir a ${c.firstName} por WhatsApp`}
                className={buttonClasses({ variant: "outline", size: "icon" })}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            <a
              href={`mailto:${c.email}`}
              aria-label={`Enviar correo a ${c.firstName}`}
              className={buttonClasses({ variant: "outline", size: "icon" })}
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiBox icon={Wallet} label="Gasto total" value={formatMoney(c.totalSpent.amount, c.totalSpent.currency)} tone="bg-success/14 text-success" />
          <KpiBox icon={Plane} label="Viajes" value={String(c.tripsCount)} tone="bg-primary/12 text-primary" />
          <KpiBox icon={CalendarClock} label="Cliente desde" value={formatDate(c.createdAt)} tone="bg-accent/14 text-accent-strong dark:text-accent" />
          <KpiBox icon={CalendarCheck} label="Última actividad" value={c.lastActivityAt ? <RelativeTime iso={c.lastActivityAt} /> : "—"} tone="bg-warning/16 text-warning" />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 overflow-x-auto pb-1">
        <Tabs items={TABS} value={tab} onChange={setTab} layoutId="customer-tab" />
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mt-6">
        {tab === "summary" && <SummaryTab c={c} />}
        {tab === "data" && <DataTab c={c} />}
        {tab === "history" && <HistoryTab c={c} />}
        {tab === "files" && <FilesTab files={c.files} />}
      </motion.div>
    </div>
  );
}

function KpiBox({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: React.ReactNode; tone: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3.5">
      <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold tabular-nums leading-tight">{value}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}

/* -------------------------------- Resumen ---------------------------------- */

function SummaryTab({ c }: { c: CustomerDetail }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Panel title="Observaciones">
          <p className="text-sm text-muted-foreground">{c.notes ?? "Sin observaciones registradas."}</p>
        </Panel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Panel title="Destinos favoritos">
            <ChipList items={c.favoriteDestinations} empty="Sin destinos registrados" icon={MapPin} />
          </Panel>
          <Panel title="Aerolíneas favoritas">
            <ChipList items={c.favoriteAirlines} empty="Sin aerolíneas registradas" icon={Plane} />
          </Panel>
        </div>
      </div>
      <Panel title="Resumen comercial">
        <ul className="space-y-3 text-sm">
          <Row label="Gasto total" value={formatMoney(c.totalSpent.amount, c.totalSpent.currency)} />
          <Row label="Viajes realizados" value={String(c.tripsCount)} />
          <Row label="Ticket promedio" value={c.tripsCount > 0 ? formatMoney(Math.round(c.totalSpent.amount / c.tripsCount), c.totalSpent.currency) : "—"} />
          <Row label="Agente asignado" value={c.assignedAgentName} />
          <Row label="Estado" value={CUSTOMER_STATUS_LABEL[c.status]} />
        </ul>
      </Panel>
    </div>
  );
}

function ChipList({ items, empty, icon: Icon }: { items: string[]; empty: string; icon: LucideIcon }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span key={it} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          <Icon className="h-3.5 w-3.5" /> {it}
        </span>
      ))}
    </div>
  );
}

/* --------------------------------- Datos ----------------------------------- */

function DataTab({ c }: { c: CustomerDetail }) {
  const rows: { icon: LucideIcon; label: string; value?: string }[] = [
    { icon: IdCard, label: CUSTOMER_DOCUMENT_TYPE_LABEL[c.documentType], value: c.documentNumber },
    { icon: BookUser, label: "Pasaporte", value: c.passportNumber ? `${c.passportNumber}${c.passportExpiry ? ` · vence ${formatDate(c.passportExpiry)}` : ""}` : "—" },
    { icon: Cake, label: "Fecha de nacimiento", value: c.birthDate ? formatDate(c.birthDate) : "—" },
    { icon: Globe, label: "Nacionalidad", value: c.nationality },
    { icon: Phone, label: "Teléfono", value: c.phone ?? "—" },
    { icon: MessageCircle, label: "WhatsApp", value: c.whatsapp ?? "—" },
    { icon: Mail, label: "Email", value: c.email },
    { icon: Home, label: "Dirección", value: c.address ?? "—" },
    { icon: MapPin, label: "Ciudad / País", value: `${c.city ? `${c.city}, ` : ""}${c.country}` },
    { icon: UserCog, label: "Agente asignado", value: c.assignedAgentName },
  ];
  return (
    <Panel title="Datos personales">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground">
              <r.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">{r.label}</span>
              <span className="block text-sm font-medium">{r.value}</span>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* -------------------------------- Historial -------------------------------- */

function HistoryTab({ c }: { c: CustomerDetail }) {
  return (
    <Panel title="Historial de actividad">
      {c.activity.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin actividad registrada.</p>
      ) : (
        <ol className="relative space-y-5 pl-2">
          {c.activity.map((a, i) => {
            const Icon = ACTIVITY_ICON[a.kind];
            const last = i === c.activity.length - 1;
            return (
              <li key={a.id} className="relative flex gap-4">
                {!last && <span className="absolute left-[18px] top-10 h-[calc(100%-4px)] w-px bg-border" />}
                <span className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    {a.amount && (
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-success">
                        {formatMoney(a.amount.amount, a.amount.currency)}
                      </span>
                    )}
                  </div>
                  {a.detail && <p className="text-xs text-muted-foreground">{a.detail}</p>}
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {CUSTOMER_ACTIVITY_LABEL[a.kind]} · {a.agent} · <RelativeTime iso={a.at} />
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}

/* ------------------------------- Documentos -------------------------------- */

function FilesTab({ files }: { files: CustomerFile[] }) {
  if (files.length === 0) {
    return (
      <Panel title="Documentos">
        <p className="text-sm text-muted-foreground">Sin documentos cargados.</p>
      </Panel>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((f) => {
        const Icon = f.fileType === "image" ? ImageIcon : FileText;
        return (
          <div key={f.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)]">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{f.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {CUSTOMER_FILE_LABEL[f.kind]}
                {f.sizeKb ? ` · ${f.sizeKb} KB` : ""}
                {f.expiresAt ? ` · vence ${formatDate(f.expiresAt)}` : ""}
              </p>
            </div>
            <a
              href={f.url}
              download={f.name}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Descargar ${f.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Helpers ---------------------------------- */

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </li>
  );
}
