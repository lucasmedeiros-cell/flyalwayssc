"use client";

import type { Place } from "@vialta/types";
import { Field } from "./field";

/** Selector de lugar (origen/destino). Usa <select> nativo para robustez/a11y. */
export function PlaceField({
  label,
  icon,
  places,
  value,
  exclude,
  placeholder = "Selecciona",
  onChange,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  places: Place[];
  value?: string;
  exclude?: string;
  placeholder?: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <Field label={label} icon={icon} className={className}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-foreground outline-none"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {places
          .filter((p) => p.id !== exclude)
          .map((p) => (
            <option key={p.id} value={p.id} className="bg-surface text-foreground">
              {p.city} ({p.code}) · {p.country}
            </option>
          ))}
      </select>
    </Field>
  );
}
