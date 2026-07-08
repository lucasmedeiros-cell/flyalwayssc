import { PlaneTakeoff } from "lucide-react";

/**
 * Separador sobrio entre las dos secciones de imagen a pantalla completa del
 * inicio (hero y destinos): una línea que se desvanece con un avión al centro.
 * Da un respiro visual entre ambos bloques inmersivos, siempre presente.
 */
export function SectionSeparator() {
  return (
    <div className="bg-background py-12 sm:py-16">
      <div className="mx-auto flex max-w-3xl items-center gap-5 px-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-[var(--shadow-sm)]">
          <PlaneTakeoff className="h-5 w-5" />
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>
    </div>
  );
}
