import {
  Activity,
  BedDouble,
  BookOpen,
  Building2,
  Car,
  ClipboardCheck,
  Compass,
  CreditCard,
  FileText,
  Flame,
  Gift,
  Headphones,
  HelpCircle,
  LifeBuoy,
  Mail,
  Map,
  MapPin,
  MousePointerClick,
  Pencil,
  Phone,
  Plane,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/** Navegación pública — modular y data-driven. IA simplificada: solo lo que ayuda
 *  a descubrir, buscar, reservar o registrarse como operador. Todo lo administrativo
 *  (paneles, métricas, API, gestión) vive en el Dashboard privado, no aquí. */

export type NavBadge = "nuevo" | "popular" | "recomendado" | "oferta";

export const BADGE_META: Record<NavBadge, { label: string; className: string }> = {
  nuevo: { label: "Nuevo", className: "bg-primary/12 text-primary" },
  popular: { label: "Popular", className: "bg-accent/14 text-accent-strong dark:text-accent" },
  recomendado: { label: "Para ti", className: "bg-success/14 text-success" },
  oferta: { label: "Oferta", className: "bg-danger/12 text-danger" },
};

export type MegaLink = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: NavBadge;
};

export type NavItem = {
  label: string;
  href: string;
  mega?: {
    links: MegaLink[];
    cta: { label: string; href: string };
  };
};

export const NAV: NavItem[] = [
  {
    label: "Explorar",
    href: "/#buscador",
    mega: {
      links: [
        { label: "Buscar vuelos", description: "Nacionales e internacionales", href: "/buscar?mode=air", icon: Plane },
        { label: "Destinos populares", description: "Uyuni, La Paz, Madidi y más", href: "/#destinos", icon: MapPin, badge: "popular" },
        { label: "Ofertas Flash", description: "Hasta 70% OFF, solo hoy", href: "/#ofertas", icon: Flame, badge: "oferta" },
        { label: "Recomendados para ti", description: "Vuelos a tu medida", href: "/buscar?mode=air", icon: Sparkles, badge: "recomendado" },
        { label: "Explorar por mapa", description: "Encuentra tu próximo destino", href: "/#destinos", icon: Map, badge: "nuevo" },
        { label: "Guías de viaje", description: "Inspiración para tu ruta", href: "/#inspiracion", icon: BookOpen },
      ],
      cta: { label: "Buscar vuelos", href: "/buscar?mode=air" },
    },
  },
  {
    label: "Servicios",
    href: "/servicios",
    mega: {
      links: [
        { label: "Hoteles", description: "Estadías con cancelación gratuita", href: "/servicios", icon: BedDouble, badge: "popular" },
        { label: "Tours guiados", description: "Guías certificados por todo el país", href: "/servicios", icon: Compass },
        { label: "Alquiler de autos", description: "Recoge al llegar y muévete a tu ritmo", href: "/servicios", icon: Car },
        { label: "Seguro de viaje", description: "Cobertura médica y de equipaje", href: "/servicios", icon: ShieldCheck, badge: "recomendado" },
        { label: "Actividades", description: "Entradas a museos y espectáculos", href: "/servicios", icon: Ticket, badge: "nuevo" },
        { label: "Excursiones", description: "Aventuras de un día a paisajes únicos", href: "/servicios", icon: MapPin },
      ],
      cta: { label: "Ver todos los servicios", href: "/servicios" },
    },
  },
  {
    label: "Cómo funciona",
    href: "/#como-funciona",
    mega: {
      links: [
        { label: "Cómo reservar", description: "De la búsqueda al ticket", href: "/#como-funciona", icon: MousePointerClick },
        { label: "Cómo pagar", description: "Seguro y en bolivianos", href: "/#como-funciona", icon: CreditCard },
        { label: "Cancelar reservas", description: "Sin letra chica", href: "/#como-funciona", icon: RotateCcw },
        { label: "Modificar reservas", description: "Cambia fecha o pasajeros", href: "/#como-funciona", icon: Pencil },
        { label: "Programa de fidelidad", description: "Gana puntos en cada viaje", href: "/perfil", icon: Gift, badge: "nuevo" },
        { label: "Preguntas frecuentes", description: "Resolvemos tus dudas", href: "/#ayuda", icon: HelpCircle },
      ],
      cta: { label: "Empezar a reservar", href: "/#buscador" },
    },
  },
  {
    label: "Empresas",
    href: "/empresas",
    mega: {
      links: [
        { label: "Registrar empresa", description: "Publica y vende tus vuelos", href: "/empresas", icon: Building2, badge: "nuevo" },
        { label: "Beneficios de unirse", description: "Llega a más viajeros", href: "/empresas", icon: Sparkles },
        { label: "Comisiones", description: "Claras, sin sorpresas", href: "/empresas", icon: Tag },
        { label: "Requisitos", description: "Lo que necesitas para empezar", href: "/empresas", icon: ClipboardCheck },
        { label: "Proceso de integración", description: "En pocos pasos", href: "/empresas", icon: Workflow },
        { label: "Hablar con un asesor", description: "Te acompañamos", href: "/empresas", icon: Headphones },
      ],
      cta: { label: "Registrar empresa", href: "/empresas" },
    },
  },
  {
    label: "Ayuda",
    href: "/#ayuda",
    mega: {
      links: [
        { label: "Centro de ayuda", description: "Guías y respuestas", href: "/#ayuda", icon: LifeBuoy },
        { label: "Contacto", description: "Habla con nuestro equipo", href: "/#ayuda", icon: Mail },
        { label: "WhatsApp", description: "Escríbenos cuando quieras", href: "/#ayuda", icon: Phone },
        { label: "Reembolsos", description: "Cómo y cuándo", href: "/#ayuda", icon: RotateCcw },
        { label: "Políticas y términos", description: "Transparencia total", href: "/legal/terminos", icon: FileText },
        { label: "Estado del servicio", description: "Todo operativo", href: "/#ayuda", icon: Activity },
      ],
      cta: { label: "Contactar soporte", href: "/#ayuda" },
    },
  },
];
