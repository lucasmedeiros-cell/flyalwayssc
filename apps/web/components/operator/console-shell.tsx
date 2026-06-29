"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Truck,
  Route as RouteIcon,
  CalendarClock,
  Tag,
  BadgePercent,
  Users,
  Star,
} from "lucide-react";
import type { OperatorConsole } from "@vialta/types";
import { TRANSPORT_MODE_META } from "@vialta/types";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/ui/logo-badge";
import { OverviewSection } from "./overview-section";
import { VehiclesSection } from "./vehicles-section";
import { RoutesSection } from "./routes-section";
import { SchedulesSection } from "./schedules-section";
import { PricingSection } from "./pricing-section";
import { PromotionsSection } from "./promotions-section";
import { StaffSection } from "./staff-section";

type Tab = "overview" | "vehicles" | "routes" | "schedules" | "pricing" | "promotions" | "staff";

const NAV: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Resumen", icon: LayoutDashboard },
  { key: "vehicles", label: "Vehículos", icon: Truck },
  { key: "routes", label: "Rutas", icon: RouteIcon },
  { key: "schedules", label: "Horarios", icon: CalendarClock },
  { key: "pricing", label: "Precios", icon: Tag },
  { key: "promotions", label: "Promociones", icon: BadgePercent },
  { key: "staff", label: "Personal", icon: Users },
];

export function ConsoleShell({ data }: { data: OperatorConsole }) {
  const [tab, setTab] = useState<Tab>("overview");
  const c = data.company;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Topbar */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-50" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <LogoBadge mark={c.logoMark} color={c.brandColor} size={52} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
                  {c.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  {c.rating.toFixed(1)}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {c.modes.map((mode) => (
                  <span
                    key={mode}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {TRANSPORT_MODE_META[mode].icon} {TRANSPORT_MODE_META[mode].label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-success" />
            Panel de operador
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        {/* Navegación */}
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {NAV.map((item) => {
              const active = tab === item.key;
              return (
                <li key={item.key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={cn(
                      "flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/12 text-primary"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Contenido */}
        <div className="min-h-[360px]">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "overview" && <OverviewSection data={data} />}
            {tab === "vehicles" && <VehiclesSection vehicles={data.vehicles} />}
            {tab === "routes" && <RoutesSection routes={data.routes} />}
            {tab === "schedules" && <SchedulesSection departures={data.departures} />}
            {tab === "pricing" && <PricingSection routes={data.routes} />}
            {tab === "promotions" && <PromotionsSection promotions={data.promotions} />}
            {tab === "staff" && <StaffSection staff={data.staff} />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
