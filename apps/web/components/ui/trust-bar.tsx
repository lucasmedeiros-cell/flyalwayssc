import { BadgeCheck, CalendarHeart, Headphones, ShieldCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Barra de confianza reutilizable (pago seguro · cancelación · verificadas · 24/7).
 * Curada a 4 señales esenciales. Pensada para colocar bajo el buscador, sobre los
 * resultados o junto a un CTA — refuerza seguridad sin saturar.
 */
export type TrustItem = { icon: LucideIcon; label: string };

const DEFAULT_ITEMS: TrustItem[] = [
  { icon: ShieldCheck, label: "Pago 100% seguro" },
  { icon: CalendarHeart, label: "Cancelación flexible" },
  { icon: BadgeCheck, label: "Empresas verificadas" },
  { icon: Headphones, label: "Soporte 24/7" },
];

export function TrustBar({
  items = DEFAULT_ITEMS,
  className,
}: {
  items?: TrustItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {items.map((it) => (
        <li
          key={it.label}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        >
          <it.icon className="h-4 w-4 shrink-0 text-success" />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
