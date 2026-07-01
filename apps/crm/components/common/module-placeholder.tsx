import type { LucideIcon } from "lucide-react";

/** Placeholder para módulos aún no implementados (próximas fases del roadmap). */
export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  phase,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-20 text-center shadow-[var(--shadow-sm)]">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/12 text-primary">
          <Icon className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold">Módulo en construcción</h2>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          Este módulo se entregará en la <span className="font-semibold text-foreground">{phase}</span> del plan de
          implementación. La fundación (diseño, navegación, capa de datos) ya está lista.
        </p>
      </div>
    </div>
  );
}
