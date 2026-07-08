import {
  LayoutDashboard,
  Users,
  Ticket,
  Package,
  CreditCard,
  FileText,
  CalendarDays,
  CheckSquare,
  UserCog,
  Building2,
  BarChart3,
  FileBadge,
  Megaphone,
  Bell,
  Bot,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { CrmPermission } from "@vialta/types";

export interface CrmNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Permiso requerido para ver el ítem (RBAC). */
  permission: CrmPermission;
  /** Conteo opcional (badge). */
  badge?: number;
}

export interface CrmNavGroup {
  title: string;
  items: CrmNavItem[];
}

/** Navegación principal del CRM, agrupada por área funcional. */
export const CRM_NAV: CrmNavGroup[] = [
  {
    title: "Principal",
    items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard.view" }],
  },
  {
    title: "Comercial",
    items: [
      { href: "/vendedor", label: "Vendedor 24/7", icon: Bot, permission: "tickets.view" },
      { href: "/clientes", label: "Clientes", icon: Users, permission: "clients.view" },
      { href: "/pasajes", label: "Pasajes", icon: Ticket, permission: "tickets.view" },
      { href: "/paquetes", label: "Paquetes", icon: Package, permission: "packages.view" },
      { href: "/cotizador", label: "Cotizador", icon: FileText, permission: "quotes.view" },
      { href: "/pagos", label: "Pagos", icon: CreditCard, permission: "payments.view" },
    ],
  },
  {
    title: "Operación",
    items: [
      { href: "/calendario", label: "Calendario", icon: CalendarDays, permission: "calendar.view" },
      { href: "/tareas", label: "Tareas", icon: CheckSquare, permission: "tasks.view" },
      { href: "/agentes", label: "Agentes", icon: UserCog, permission: "agents.view" },
      { href: "/proveedores", label: "Proveedores", icon: Building2, permission: "providers.view" },
    ],
  },
  {
    title: "Inteligencia",
    items: [
      { href: "/reportes", label: "Reportes", icon: BarChart3, permission: "reports.view" },
      { href: "/documentos", label: "Documentos", icon: FileBadge, permission: "documents.view" },
      { href: "/marketing", label: "Marketing", icon: Megaphone, permission: "marketing.view" },
      { href: "/notificaciones", label: "Notificaciones", icon: Bell, permission: "notifications.view" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/ajustes", label: "Ajustes", icon: Settings, permission: "settings.view" },
    ],
  },
];
