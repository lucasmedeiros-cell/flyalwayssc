import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** Tipos de verificación reutilizables para testimonios y operadores. */
export type VerifiedKind = "verified" | "confirmed" | "frequent" | "operator";

const META: Record<VerifiedKind, { label: string; tone: "success" | "primary" | "accent" }> = {
  verified: { label: "Compra verificada", tone: "success" },
  confirmed: { label: "Reserva confirmada", tone: "primary" },
  frequent: { label: "Cliente frecuente", tone: "accent" },
  operator: { label: "Operador verificado", tone: "success" },
};

export function VerifiedBadge({
  kind = "verified",
  className,
}: {
  kind?: VerifiedKind;
  className?: string;
}) {
  const m = META[kind];
  return (
    <Badge tone={m.tone} className={className}>
      <BadgeCheck className="h-3.5 w-3.5" />
      {m.label}
    </Badge>
  );
}
