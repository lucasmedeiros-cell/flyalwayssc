"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, CalendarDays, Check, MapPin, Navigation, Search } from "lucide-react";
import { motion } from "framer-motion";
import type { Place, PassengerCount, TransportMode, TripKind } from "@vialta/types";
import {
  CLASSES_BY_MODE,
  TRANSPORT_MODE_META,
  TRAVEL_CLASS_LABEL,
  emptyPassengers,
} from "@vialta/types";
import { getDataSource } from "@/lib/services";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PlaceField } from "./place-field";
import { PassengersField } from "./passengers-field";
import { Field } from "./field";

/** Confianza secundaria — pequeña, monocroma, sin competir con el CTA. */
const TRUST = ["Reserva segura", "Sin cargos ocultos", "Cancelación flexible"];

export function SearchPanel({
  initialMode = "air",
  className,
}: {
  initialMode?: TransportMode;
  className?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<TransportMode>(initialMode);
  const [places, setPlaces] = useState<Place[]>([]);
  const [originId, setOriginId] = useState<string>();
  const [destinationId, setDestinationId] = useState<string>();
  const [tripKind, setTripKind] = useState<TripKind>("round_trip");
  const [departDate, setDepartDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [passengers, setPassengers] = useState<PassengerCount>(emptyPassengers());
  const [travelClass, setTravelClass] = useState<string>("");

  // Cargar lugares cada vez que cambia el modo y re-elegir origen/destino válidos.
  useEffect(() => {
    let active = true;
    getDataSource()
      .listPlaces(mode)
      .then((list) => {
        if (!active) return;
        setPlaces(list);
        setOriginId((prev) => (list.some((p) => p.id === prev) ? prev : list[0]?.id));
        setDestinationId((prev) =>
          list.some((p) => p.id === prev) ? prev : list[list.length - 1]?.id
        );
        const classes = CLASSES_BY_MODE[mode];
        setTravelClass((prev) => (classes.includes(prev as never) ? prev : classes[0]));
      });
    return () => {
      active = false;
    };
  }, [mode]);

  const classes = useMemo(() => CLASSES_BY_MODE[mode], [mode]);
  const meta = TRANSPORT_MODE_META[mode];

  const swap = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (originId) params.set("origin", originId);
    if (destinationId) params.set("destination", destinationId);
    params.set("trip", tripKind);
    if (departDate) params.set("depart", departDate);
    if (tripKind === "round_trip" && returnDate) params.set("return", returnDate);
    params.set("adults", String(passengers.adults));
    params.set("children", String(passengers.children));
    params.set("infants", String(passengers.infants));
    if (travelClass) params.set("class", travelClass);
    router.push(`/buscar?${params.toString()}`);
  };

  // Modo único (solo vuelos): el panel no mezcla modos. Un único contenedor limpio.
  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-3xl border border-border bg-surface/95 p-5 shadow-[var(--shadow-lg)] backdrop-blur-md sm:p-6",
        className,
      )}
    >
      <TripKindToggle value={tripKind} onChange={setTripKind} />

      {/* Origen · Destino · Fechas · Pasajeros */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PlaceField
              label="Origen"
              icon={<MapPin className="h-4 w-4" />}
              places={places}
              value={originId}
              exclude={destinationId}
              onChange={setOriginId}
            />
            <PlaceField
              label="Destino"
              icon={<Navigation className="h-4 w-4" />}
              places={places}
              value={destinationId}
              exclude={originId}
              onChange={setDestinationId}
            />
          </div>
          <motion.button
            type="button"
            onClick={swap}
            whileTap={{ scale: 0.9, rotate: 180 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            aria-label="Intercambiar origen y destino"
            className="absolute left-1/2 top-[3.125rem] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-[var(--shadow-sm)] transition-colors duration-200 hover:border-primary/40 hover:bg-surface-2 hover:text-primary sm:flex"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </motion.button>
        </div>

        <Field label="Salida" icon={<CalendarDays className="h-4 w-4" />} className="md:col-span-2">
          <input
            type="date"
            value={departDate}
            onChange={(e) => setDepartDate(e.target.value)}
            className="date-input relative w-full bg-transparent text-sm font-medium text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
        </Field>
        <Field
          label="Regreso"
          icon={<CalendarDays className="h-4 w-4" />}
          className={cn("md:col-span-2", tripKind === "one_way" && "opacity-40")}
        >
          <input
            type="date"
            value={returnDate}
            disabled={tripKind === "one_way"}
            onChange={(e) => setReturnDate(e.target.value)}
            className="date-input relative w-full bg-transparent text-sm font-medium text-foreground outline-none disabled:cursor-not-allowed [color-scheme:light] dark:[color-scheme:dark]"
          />
        </Field>

        <PassengersField value={passengers} onChange={setPassengers} className="md:col-span-3" />
      </div>

      {/* Clase · Buscar */}
      <div className="mt-3.5 grid grid-cols-1 gap-4 md:grid-cols-12">
        <Field label="Clase" className="md:col-span-3">
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
          >
            {classes.map((c) => (
              <option key={c} value={c} className="bg-surface text-foreground">
                {TRAVEL_CLASS_LABEL[c]}
              </option>
            ))}
          </select>
        </Field>

        <div className="flex items-end md:col-span-9">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className={cn(
              "group inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl px-8 text-sm font-semibold md:w-auto md:px-12",
              "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-primary-strong",
              "transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            )}
          >
            <Search className="h-[18px] w-[18px]" />
            Buscar {meta.label.toLowerCase()}
          </motion.button>
        </div>
      </div>

      {/* Confianza secundaria */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {TRUST.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" strokeWidth={2} />
            {t}
          </span>
        ))}
      </div>
    </form>
  );
}

function TripKindToggle({ value, onChange }: { value: TripKind; onChange: (v: TripKind) => void }) {
  const options: { key: TripKind; label: string }[] = [
    { key: "round_trip", label: "Ida y vuelta" },
    { key: "one_way", label: "Solo ida" },
  ];
  return (
    <div role="tablist" aria-label="Tipo de viaje" className="inline-flex rounded-2xl bg-surface-2 p-1 text-sm">
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.key)}
            className={cn(
              "relative rounded-xl px-4 py-1.5 font-medium transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="tripkind-pill"
                className="absolute inset-0 rounded-xl bg-surface shadow-[var(--shadow-sm)]"
                transition={SPRING_SOFT}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
