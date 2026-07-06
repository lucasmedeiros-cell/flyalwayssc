import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/cn";

/** Tonos de acento reutilizables para íconos de encabezado / sección. */
export type SectionTone = "primary" | "success" | "accent" | "warning" | "danger" | "neutral";

export const SECTION_TONE_CLASSES: Record<SectionTone, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/14 text-success",
  accent: "bg-accent/14 text-accent-strong dark:text-accent",
  warning: "bg-warning/16 text-warning",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-surface-2 text-muted-foreground",
};

/** Encabezado de página estándar: ícono + título + subtítulo, con acción opcional a la derecha. */
export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  tone = "primary",
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  tone?: SectionTone;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-center gap-3">
        <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", SECTION_TONE_CLASSES[tone])}>
          <Icon className="h-5.5 w-5.5" />
        </span>
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Tarjeta de sección: encabezado icónico (título + descripción + acción) y cuerpo enmarcado. */
export function SectionCard({
  icon: Icon,
  title,
  description,
  tone = "primary",
  action,
  bodyClassName = "px-5 py-5 sm:px-6",
  className,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  tone?: SectionTone;
  action?: React.ReactNode;
  bodyClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]", className)}>
      <header className="flex items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
        {Icon && (
          <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", SECTION_TONE_CLASSES[tone])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
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
