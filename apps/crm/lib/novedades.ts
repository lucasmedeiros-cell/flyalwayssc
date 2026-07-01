/**
 * Centro de novedades (estándar corporativo #18): changelog del sistema —
 * nuevas funciones, cambios, mejoras y noticias. Datos estáticos versionados
 * con la app (no requieren backend ni base de datos).
 */
export type NovedadKind = "feature" | "improvement" | "fix" | "news";

export const NOVEDAD_KIND_LABEL: Record<NovedadKind, string> = {
  feature: "Nueva función",
  improvement: "Mejora",
  fix: "Corrección",
  news: "Noticia",
};

export interface Novedad {
  version: string;
  date: string; // ISODate
  title: string;
  items: { kind: NovedadKind; text: string }[];
}

/** Más reciente primero. */
export const NOVEDADES: Novedad[] = [
  {
    version: "0.1.0",
    date: "2026-06-30",
    title: "Lanzamiento del CRM FlyAlways",
    items: [
      { kind: "feature", text: "Dashboard ejecutivo con KPIs, gráficos y actividad reciente." },
      { kind: "feature", text: "Módulos: Clientes (ficha 360°), Pasajes, Cotizador, Pagos, Documentos, Paquetes, Proveedores, Tareas, Agentes y Calendario." },
      { kind: "feature", text: "Marketing, Automatizaciones y Notificaciones." },
      { kind: "feature", text: "Reportes con exportación a Excel, PDF y CSV." },
      { kind: "feature", text: "Autenticación real (JWT + bcrypt) y permisos por rol (RBAC)." },
      { kind: "feature", text: "Backend NestJS sobre PostgreSQL; datos compartidos con la web." },
      { kind: "feature", text: "Modo privacidad: oculta los montos con un clic." },
      { kind: "improvement", text: "Modo claro y oscuro, diseño responsive y animaciones suaves." },
    ],
  },
];
