"use client";

import type { Operator } from "@vialta/types";
import { DynamicLogo } from "@/components/ui/dynamic-logo";

/**
 * Logo del operador para resultados/reservas. Usa el logotipo oficial si existe
 * en `/public/logos/operators/{slug}.{svg|png}`; si no, monograma de marca.
 * (Ver documentación en esas carpetas.)
 */
export function OperatorLogo({
  operator,
  size = 44,
  className,
}: {
  operator: Operator;
  size?: number;
  className?: string;
}) {
  return (
    <DynamicLogo
      kind="operators"
      slug={operator.slug}
      name={operator.name}
      mark={operator.logoMark}
      color={operator.brandColor}
      size={size}
      className={className}
    />
  );
}
