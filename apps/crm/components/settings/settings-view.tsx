"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Smartphone, Monitor, LogOut, Settings, Users, History, Lock, Bot, Clock, UserCheck, Sparkles, MessageSquareText } from "lucide-react";
import type { CrmUser, CrmRole, CrmActiveSession, CrmAuditEntry, CrmAuditAction, Automation } from "@vialta/types";
import {
  CRM_ROLE_LABEL,
  CRM_AUDIT_ACTION_LABEL,
} from "@vialta/types";
import { Badge, type BadgeTone, Avatar, Switch, Button, DataTable, type Column, Modal, Input, Field, Select, Textarea, cn, RelativeTime } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { AutomationsView } from "@/components/automations/automations-view";
import type { CrmSettingsData } from "@/lib/crm/data-source";

const ROLE_OPTIONS: { value: CrmRole; label: string }[] = [
  { value: "agent", label: "Agente" },
  { value: "supervisor", label: "Supervisor" },
  { value: "accounting", label: "Contabilidad" },
  { value: "marketing", label: "Marketing" },
  { value: "admin", label: "Administrador" },
];

const INVITE_COLORS = ["#3a23a8", "#1ca71c", "#e0a106", "#e62020", "#8b7bf5", "#0ea5e9"];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ROLE_TONE: Record<CrmRole, BadgeTone> = {
  admin: "primary",
  supervisor: "accent",
  agent: "success",
  accounting: "warning",
  marketing: "neutral",
};

/* --------------------------- Bloques reutilizables ------------------------- */

type Tone = "primary" | "success" | "accent" | "warning" | "danger" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/14 text-success",
  accent: "bg-accent/14 text-accent-strong dark:text-accent",
  warning: "bg-warning/14 text-warning",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-surface-2 text-muted-foreground",
};

/** Tarjeta de sección con encabezado icónico, al estilo de un panel de ajustes limpio. */
function SectionCard({
  icon: Icon,
  title,
  description,
  tone = "primary",
  action,
  bodyClassName = "px-5 py-5 sm:px-6",
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: Tone;
  action?: React.ReactNode;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
        <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", TONE_CLASSES[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-base font-bold leading-tight">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** Fila con interruptor: icono + título + subtítulo + Switch, con divisores entre filas. */
function ToggleRow({
  icon: Icon,
  title,
  desc,
  checked,
  onChange,
  tone = "primary",
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  tone?: Tone;
}) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", TONE_CLASSES[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onChange={onChange} aria-label={title} />
    </div>
  );
}

/* --------------------------------- Vista ---------------------------------- */

export function SettingsView({ data, automations }: { data: CrmSettingsData; automations: Automation[] }) {
  const { can } = useAuth();
  // Todas las secciones en UNA sola página (sin pestañas): así se ve y edita
  // todo de un vistazo. Seguridad y Sesiones van a dos columnas; las tablas
  // (Usuarios, Auditoría) y las automatizaciones ocupan el ancho completo.
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Settings className="h-5.5 w-5.5" />
        </span>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Ajustes</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Usuarios, seguridad, Vendedor 24/7 y automatizaciones.</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <UsersTab users={data.users} />

        <VendedorConfigCard />

        {can("automations.view") && (
          <SectionCard icon={Sparkles} title="Automatizaciones" description="Flujos disparados por eventos: pagos, viajes, cumpleaños y seguimiento." tone="primary" bodyClassName="px-5 py-5 sm:px-6">
            <AutomationsView initial={automations} embedded />
          </SectionCard>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <SecurityTab />
          <SessionsTab sessions={data.sessions} />
        </div>

        <AuditTab audit={data.audit} />
      </div>
    </div>
  );
}

/* ------------------------------ Vendedor 24/7 ----------------------------- */

const TONO_OPTIONS = [
  { value: "cercano", label: "Cercano y amable" },
  { value: "formal", label: "Formal y profesional" },
  { value: "neutral", label: "Neutral y directo" },
];

/** Encabezado de sub-bloque dentro de una tarjeta de ajustes. */
function SubHeading({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc?: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-success/14 text-success">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-semibold leading-tight">{title}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
    </div>
  );
}

/**
 * Parámetros del Vendedor 24/7 (bot de WhatsApp con IA). Estado local (mock),
 * igual que el resto de Ajustes; al conectar el backend estos valores se
 * persistirán vía el data-source. Cuatro grupos: activación/horario, traspaso
 * a humano, tono/auto-cotización y mensaje de bienvenida.
 */
function VendedorConfigCard() {
  const { can } = useAuth();
  const editable = can("settings.manage") || can("automations.manage");

  // 1 · Activación y horario
  const [active, setActive] = useState(true);
  const [always, setAlways] = useState(true);
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("22:00");

  // 2 · Traspaso a humano
  const [keywords, setKeywords] = useState("humano, asesor, reclamo, urgente");
  const [handoffAfter, setHandoffAfter] = useState("6");
  const [handoffHot, setHandoffHot] = useState(true);

  // 3 · Tono y auto-cotización
  const [tono, setTono] = useState("cercano");
  const [autoQuote, setAutoQuote] = useState(true);
  const [autoClose, setAutoClose] = useState(false);

  // 4 · Mensaje de bienvenida
  const [welcome, setWelcome] = useState(
    "¡Hola! 👋 Soy el asistente de FlyAlways. Cuéntame a dónde quieres viajar y con gusto te ayudo a cotizar y reservar tu pasaje.",
  );
  const [signature, setSignature] = useState("Vendedor 24/7 · FlyAlways");

  const dim = editable ? "" : "pointer-events-none opacity-60";

  return (
    <SectionCard
      icon={Bot}
      title="Vendedor 24/7"
      description="Asistente de WhatsApp con IA: parámetros de atención automática."
      tone="success"
      action={<Badge tone={active ? "success" : "neutral"}>{active ? "Activo" : "En pausa"}</Badge>}
    >
      <div className={cn("space-y-6", dim)}>
        {/* 1 · Activación y horario */}
        <div>
          <SubHeading icon={Clock} title="Activación y horario" desc="Cuándo atiende el bot automáticamente." />
          <div className="divide-y divide-border">
            <ToggleRow
              icon={Bot}
              tone="success"
              title="Vendedor 24/7 activo"
              desc="El bot responde y gestiona chats de WhatsApp por su cuenta."
              checked={active}
              onChange={setActive}
            />
            <ToggleRow
              icon={Clock}
              title="Atención las 24 horas"
              desc="Si lo desactivas, el bot solo responde dentro de la franja horaria."
              checked={always}
              onChange={setAlways}
            />
          </div>
          {!always && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Desde" htmlFor="v-from">
                <Input id="v-from" type="time" value={from} onChange={(e) => setFrom(e.target.value)} />
              </Field>
              <Field label="Hasta" htmlFor="v-to">
                <Input id="v-to" type="time" value={to} onChange={(e) => setTo(e.target.value)} />
              </Field>
            </div>
          )}
        </div>

        {/* 2 · Traspaso a humano */}
        <div className="border-t border-border pt-5">
          <SubHeading icon={UserCheck} title="Traspaso a humano" desc="Cuándo pasar la conversación a un agente." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Palabras clave que activan el traspaso" htmlFor="v-keywords" className="sm:col-span-2">
              <Input
                id="v-keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="humano, asesor, reclamo"
              />
            </Field>
            <Field label="Traspasar tras N mensajes sin cierre" htmlFor="v-after">
              <Input id="v-after" type="number" min={1} max={50} value={handoffAfter} onChange={(e) => setHandoffAfter(e.target.value)} />
            </Field>
          </div>
          <div className="mt-1 divide-y divide-border">
            <ToggleRow
              icon={UserCheck}
              tone="accent"
              title="Traspasar leads calientes automáticamente"
              desc="Cuando el lead muestra alta intención de compra, avisa a un agente."
              checked={handoffHot}
              onChange={setHandoffHot}
            />
          </div>
        </div>

        {/* 3 · Tono y auto-cotización */}
        <div className="border-t border-border pt-5">
          <SubHeading icon={Sparkles} title="Tono y auto-cotización" desc="Cómo habla y qué puede resolver solo." />
          <Field label="Tono de las respuestas" htmlFor="v-tono">
            <Select id="v-tono" options={TONO_OPTIONS} value={tono} onChange={(e) => setTono(e.target.value)} />
          </Field>
          <div className="mt-1 divide-y divide-border">
            <ToggleRow
              icon={Sparkles}
              title="Cotiza automáticamente"
              desc="El bot arma y envía cotizaciones de pasajes sin intervención."
              checked={autoQuote}
              onChange={setAutoQuote}
            />
            <ToggleRow
              icon={Sparkles}
              tone="warning"
              title="Cierra y emite pasajes sin intervención"
              desc="Permite que el bot confirme la venta y emita el pasaje automáticamente."
              checked={autoClose}
              onChange={setAutoClose}
            />
          </div>
        </div>

        {/* 4 · Mensaje de bienvenida */}
        <div className="border-t border-border pt-5">
          <SubHeading icon={MessageSquareText} title="Mensaje de bienvenida" desc="Primer mensaje automático y firma del bot." />
          <Field label="Texto de bienvenida" htmlFor="v-welcome">
            <Textarea id="v-welcome" value={welcome} onChange={(e) => setWelcome(e.target.value)} rows={3} />
          </Field>
          <Field label="Firma" htmlFor="v-sign" className="mt-4">
            <Input id="v-sign" value={signature} onChange={(e) => setSignature(e.target.value)} />
          </Field>
        </div>

        {editable && (
          <div className="flex justify-end border-t border-border pt-4">
            <Button size="sm">Guardar cambios</Button>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* --------------------------------- Usuarios -------------------------------- */

function UsersTab({ users: initialUsers }: { users: CrmUser[] }) {
  const [users, setUsers] = useState<CrmUser[]>(initialUsers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CrmRole>("agent");

  function resetInvite() {
    setName("");
    setEmail("");
    setRole("agent");
  }

  function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    const newUser: CrmUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      initials: initialsFromName(name),
      email: email.trim(),
      role,
      color: INVITE_COLORS[users.length % INVITE_COLORS.length],
      active: true,
      twoFactorEnabled: false,
      lastActiveAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    resetInvite();
    setInviteOpen(false);
  }

  const columns: Column<CrmUser>[] = [
    {
      key: "name",
      header: "Usuario",
      width: "2fr",
      cell: (u) => (
        <span className="flex items-center gap-3">
          <Avatar initials={u.initials} color={u.color} size={36} />
          <span className="min-w-0">
            <span className="block truncate font-medium">{u.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
          </span>
        </span>
      ),
    },
    { key: "role", header: "Rol", width: "1fr", cell: (u) => <Badge tone={ROLE_TONE[u.role]}>{CRM_ROLE_LABEL[u.role]}</Badge> },
    {
      key: "2fa",
      header: "2FA",
      width: "auto",
      hideOnMobile: true,
      cell: (u) =>
        u.twoFactorEnabled ? (
          <Badge tone="success">Activo</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Inactivo</span>
        ),
    },
    {
      key: "status",
      header: "Estado",
      width: "auto",
      align: "right",
      cell: (u) => (u.active ? <Badge tone="success">Activo</Badge> : <Badge tone="neutral">Inactivo</Badge>),
    },
  ];

  return (
    <>
      <SectionCard
        icon={Users}
        title="Usuarios y roles"
        description={`${users.length} usuarios con acceso al CRM`}
        bodyClassName="p-0"
        action={
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            Invitar usuario
          </Button>
        }
      >
        <DataTable columns={columns} rows={users} keyOf={(u) => u.id} className="rounded-none border-0 bg-transparent shadow-none" />
      </SectionCard>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invitar usuario"
        description="Se enviará una invitación con un enlace para activar la cuenta."
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setInviteOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="invite-form" disabled={!name.trim() || !email.trim()}>
              Enviar invitación
            </Button>
          </>
        }
      >
        <form id="invite-form" onSubmit={submitInvite} className="grid grid-cols-1 gap-4">
          <Field label="Nombre completo" htmlFor="inv-name">
            <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="María Salazar" />
          </Field>
          <Field label="Correo" htmlFor="inv-email">
            <Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="maria@flyalways.bo" />
          </Field>
          <Field label="Rol" htmlFor="inv-role">
            <Select id="inv-role" options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value as CrmRole)} />
          </Field>
        </form>
      </Modal>
    </>
  );
}

/* -------------------------------- Seguridad -------------------------------- */

function SecurityTab() {
  const [twoFa, setTwoFa] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [forceStrong, setForceStrong] = useState(false);

  return (
    <SectionCard icon={Lock} title="Seguridad de la cuenta" description="Protege el acceso de tu equipo al CRM." tone="success">
      <div className="divide-y divide-border">
        <ToggleRow
          icon={ShieldCheck}
          tone="success"
          title="Autenticación en dos pasos (2FA)"
          desc="Exige un código adicional al iniciar sesión."
          checked={twoFa}
          onChange={setTwoFa}
        />
        <ToggleRow
          icon={Monitor}
          title="Alertas de inicio de sesión"
          desc="Notifica cuando se accede desde un dispositivo nuevo."
          checked={loginAlerts}
          onChange={setLoginAlerts}
        />
        <ToggleRow
          icon={ShieldCheck}
          tone="warning"
          title="Forzar contraseñas robustas"
          desc="Mínimo 12 caracteres con números y símbolos."
          checked={forceStrong}
          onChange={setForceStrong}
        />
      </div>
    </SectionCard>
  );
}

/* -------------------------------- Sesiones --------------------------------- */

function SessionsTab({ sessions: initialSessions }: { sessions: CrmActiveSession[] }) {
  const [sessions, setSessions] = useState<CrmActiveSession[]>(initialSessions);

  function revoke(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <SectionCard icon={Monitor} title="Sesiones activas" description="Dispositivos con acceso a tu cuenta ahora mismo." tone="neutral">
      <div className="divide-y divide-border">
        {sessions.map((s) => {
          const Icon = s.device.toLowerCase().includes("iphone") || s.device.toLowerCase().includes("android") ? Smartphone : Monitor;
          return (
            <div key={s.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", s.current ? "bg-success/14 text-success" : "bg-surface-2 text-muted-foreground")}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  {s.device} · {s.browser}
                  {s.current && <Badge tone="success">Esta sesión</Badge>}
                </p>
                <p className="text-sm text-muted-foreground">
                  {s.location} · {s.ip} · <RelativeTime iso={s.lastActiveAt} />
                </p>
              </div>
              {!s.current && (
                <Button variant="outline" size="sm" onClick={() => revoke(s.id)}>
                  <LogOut className="h-4 w-4" /> Revocar
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* -------------------------------- Auditoría -------------------------------- */

const ACTION_TONE: Record<CrmAuditAction, BadgeTone> = {
  create: "success",
  update: "primary",
  delete: "danger",
  login: "neutral",
  logout: "neutral",
  export: "warning",
  permission_change: "accent",
};

function AuditTab({ audit }: { audit: CrmAuditEntry[] }) {
  const columns: Column<CrmAuditEntry>[] = [
    {
      key: "actor",
      header: "Usuario",
      width: "1.2fr",
      cell: (a) => (
        <span className="flex items-center gap-2.5">
          <Avatar initials={a.actorInitials} size={30} />
          <span className="truncate font-medium">{a.actor}</span>
        </span>
      ),
    },
    { key: "action", header: "Acción", width: "auto", cell: (a) => <Badge tone={ACTION_TONE[a.action]}>{CRM_AUDIT_ACTION_LABEL[a.action]}</Badge> },
    {
      key: "entity",
      header: "Detalle",
      width: "2fr",
      cell: (a) => (
        <span className="min-w-0">
          <span className="block truncate">{a.entity}</span>
          {a.detail && <span className="block truncate text-xs text-muted-foreground">{a.detail}</span>}
        </span>
      ),
    },
    { key: "at", header: "Cuándo", width: "auto", align: "right", hideOnMobile: true, cell: (a) => <RelativeTime iso={a.at} className="text-xs text-muted-foreground" /> },
  ];
  return (
    <SectionCard icon={History} title="Registro de auditoría" description="Acciones recientes del equipo sobre datos sensibles." tone="warning" bodyClassName="p-0">
      <DataTable columns={columns} rows={audit} keyOf={(a) => a.id} className="rounded-none border-0 bg-transparent shadow-none" />
    </SectionCard>
  );
}
