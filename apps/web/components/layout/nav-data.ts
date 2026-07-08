import {
  BedDouble,
  BookOpen,
  Car,
  Compass,
  CreditCard,
  FileText,
  Flame,
  HelpCircle,
  LifeBuoy,
  Mail,
  MapPin,
  MousePointerClick,
  Phone,
  Plane,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/** Navegación pública — modular y data-driven. IA simplificada: solo lo que ayuda
 *  a descubrir, buscar, reservar o pedir ayuda. Todo lo administrativo
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
      ],
      cta: { label: "Ver todos los servicios", href: "/servicios" },
    },
  },
  {
    label: "Cómo funciona",
    href: "/como-funciona",
    mega: {
      links: [
        { label: "Cómo reservar", description: "De la búsqueda al ticket", href: "/como-funciona", icon: MousePointerClick },
        { label: "Cómo pagar", description: "Seguro y en bolivianos", href: "/como-funciona", icon: CreditCard },
        { label: "Cancelar reservas", description: "Sin letra chica", href: "/como-funciona", icon: RotateCcw },
        { label: "Preguntas frecuentes", description: "Resolvemos tus dudas", href: "/#ayuda", icon: HelpCircle },
      ],
      cta: { label: "Empezar a reservar", href: "/#buscador" },
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
        { label: "Políticas y términos", description: "Transparencia total", href: "/legal/terminos", icon: FileText },
      ],
      cta: { label: "Contactar soporte", href: "/#ayuda" },
    },
  },
];
