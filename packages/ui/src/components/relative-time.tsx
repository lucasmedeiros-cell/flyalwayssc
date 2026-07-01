"use client";

import { useEffect, useState } from "react";
import { formatRelative, formatDate } from "../lib/format";

/**
 * Muestra tiempo relativo ("hace 5 min") sin romper la hidratación: en SSR y en
 * el primer render del cliente muestra la fecha absoluta (determinista a partir
 * del ISO); tras montar, cambia al relativo (que depende de Date.now()).
 */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const [rel, setRel] = useState<string | null>(null);
  useEffect(() => setRel(formatRelative(iso)), [iso]);
  return (
    <span className={className} suppressHydrationWarning>
      {rel ?? formatDate(iso)}
    </span>
  );
}
