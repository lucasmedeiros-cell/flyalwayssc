import { cn } from "@/lib/utils";

/**
 * Sección con fondo premium reutilizable: aurora + glow de marca + ruido fino +
 * profundidad. Decoración estática (sin animación continua) para no costar frames.
 * El contenedor interno mantiene el ancho y padding del design system.
 */
export function AnimatedSection({
  id,
  className,
  innerClassName,
  decorated = true,
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  decorated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        id && "scroll-mt-24",
        "relative isolate overflow-hidden py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      {decorated && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-72 w-[130%] -translate-x-1/2 rounded-[50%] bg-aurora opacity-40 blur-2xl" />
          <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay" />
        </div>
      )}
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
