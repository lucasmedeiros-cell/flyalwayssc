"use client";

import type { LucideIcon } from "lucide-react";
import { DynamicLogo } from "@/components/ui/dynamic-logo";

/**
 * Logotipo de aerolínea. Usa el logo oficial si existe en
 * `/public/logos/airlines/{slug}.{svg|png}`; si no, placeholder de marca.
 *
 * Ejemplo: <AirlineLogo slug="boa" name="Boliviana de Aviación" mark="BoA" color="#0a2d6e" />
 */
export function AirlineLogo({
  slug,
  name,
  mark,
  color,
  size = 44,
  icon,
  className,
}: {
  slug: string;
  name: string;
  mark: string;
  color?: string;
  size?: number;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <DynamicLogo
      kind="airlines"
      slug={slug}
      name={name}
      mark={mark}
      color={color}
      size={size}
      icon={icon}
      className={className}
    />
  );
}
