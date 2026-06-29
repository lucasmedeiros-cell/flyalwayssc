"use client";

import { MoreHorizontal, Users } from "lucide-react";
import type { OperatorVehicle, VehicleStatus } from "@vialta/types";
import { TRANSPORT_MODE_META } from "@vialta/types";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./section-header";

const STATUS: Record<VehicleStatus, { label: string; tone: "success" | "warning" | "neutral" }> = {
  active: { label: "Operativo", tone: "success" },
  maintenance: { label: "Mantenimiento", tone: "warning" },
  inactive: { label: "Inactivo", tone: "neutral" },
};

export function VehiclesSection({ vehicles }: { vehicles: OperatorVehicle[] }) {
  return (
    <div>
      <SectionHeader
        title="Flota"
        subtitle="Aviones, buses, trenes y vehículos privados de la empresa."
        actionLabel="Añadir vehículo"
      />
      <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => {
          const meta = TRANSPORT_MODE_META[v.mode];
          const status = STATUS[v.status];
          return (
            <RevealItem key={v.id}>
              <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-md)]">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-xl">
                    {meta.icon}
                  </span>
                  <button
                    type="button"
                    aria-label="Opciones"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-4 font-semibold">{v.name}</p>
                <p className="text-xs text-muted-foreground">
                  {meta.label} · {v.registration} · {v.year}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {v.capacity} plazas
                  </span>
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
