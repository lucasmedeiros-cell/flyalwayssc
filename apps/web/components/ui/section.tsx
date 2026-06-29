import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/ui/reveal";

/**
 * Ritmo vertical y contenedor consistentes para todas las secciones del sitio.
 * Sustituye al `<section class="mx-auto max-w-7xl px-4 py-16 ...">` repetido en
 * cada componente, garantizando el mismo espaciado y ancho en todo el producto.
 */
export function Section({
  children,
  className,
  innerClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn(id && "scroll-mt-24", "py-16 sm:py-20 lg:py-24", className)}>
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

/**
 * Encabezado de sección estandarizado: eyebrow (kicker) → título → subtítulo,
 * con jerarquía y animación de entrada uniformes. El título admite `<span
 * className="text-gradient">` para resaltar la palabra clave.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal className={cn(centered && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <RevealItem variant="fade">
          <span className={cn("eyebrow", centered && "justify-center")}>{eyebrow}</span>
        </RevealItem>
      )}
      <RevealItem variant="blur">
        <h2 className="mt-3 text-balance font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
          {title}
        </h2>
      </RevealItem>
      {subtitle && (
        <RevealItem variant="fade">
          <p
            className={cn(
              "mt-3 text-balance text-base leading-relaxed text-muted-foreground sm:text-lg",
              centered ? "mx-auto max-w-2xl" : "max-w-2xl",
            )}
          >
            {subtitle}
          </p>
        </RevealItem>
      )}
    </Reveal>
  );
}
