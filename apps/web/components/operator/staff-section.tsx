"use client";

import { Star } from "lucide-react";
import type { StaffMember } from "@vialta/types";
import { STAFF_ROLE_LABEL, TRANSPORT_MODE_META } from "@vialta/types";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { LogoBadge } from "@/components/ui/logo-badge";
import { SectionHeader } from "./section-header";

const STATUS: Record<StaffMember["status"], { label: string; tone: "success" | "primary" | "neutral" }> = {
  available: { label: "Disponible", tone: "success" },
  on_trip: { label: "En viaje", tone: "primary" },
  off: { label: "Descanso", tone: "neutral" },
};

const ROLE_COLOR: Record<string, string> = {
  pilot: "#6a5cff",
  driver: "#12b3a3",
  crew: "#8b5cf6",
  host: "#0f9d8f",
};

export function StaffSection({ staff }: { staff: StaffMember[] }) {
  return (
    <div>
      <SectionHeader
        title="Personal"
        subtitle="Pilotos, conductores y tripulación de la operación."
        actionLabel="Añadir personal"
      />
      <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((p) => {
          const meta = TRANSPORT_MODE_META[p.mode];
          const status = STATUS[p.status];
          return (
            <RevealItem key={p.id}>
              <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-3">
                  <LogoBadge mark={p.initials} color={ROLE_COLOR[p.role] ?? "#6a5cff"} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {STAFF_ROLE_LABEL[p.role]} · {meta.label}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="text-xs text-muted-foreground">{p.license}</span>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    {p.rating.toFixed(1)}
                  </span>
                </div>
                <div className="mt-3">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </Reveal>
    </div>
  );
}
