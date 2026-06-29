"use client";

import { User } from "lucide-react";
import {
  type BookingDraft,
  type PassengerForm,
  totalPassengers,
} from "@/lib/booking/config";
import { cn } from "@/lib/utils";
import { StepHeading } from "./step-heading";

export function StepPassenger({
  draft,
  onChange,
}: {
  draft: BookingDraft;
  onChange: (d: BookingDraft) => void;
}) {
  const pax = totalPassengers(draft);

  const update = (index: number, patch: Partial<PassengerForm>) => {
    const passengers = draft.passengers.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChange({ ...draft, passengers });
  };

  return (
    <div>
      <StepHeading
        title="Datos de los pasajeros"
        subtitle="Ingresa los datos tal como figuran en el documento de identidad."
      />

      <div className="space-y-5">
        {Array.from({ length: pax }).map((_, i) => {
          const p = draft.passengers[i];
          return (
            <div
              key={i}
              className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <User className="h-4 w-4" />
                </span>
                <p className="font-semibold">
                  Pasajero {i + 1}
                  {i === 0 && <span className="ml-2 text-xs text-muted-foreground">(contacto)</span>}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput
                  label="Nombres"
                  value={p.firstName}
                  onChange={(v) => update(i, { firstName: v })}
                  placeholder="Ej. María"
                  required
                />
                <TextInput
                  label="Apellidos"
                  value={p.lastName}
                  onChange={(v) => update(i, { lastName: v })}
                  placeholder="Ej. González"
                  required
                />
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <SelectInput
                    label="Documento"
                    value={p.documentType}
                    onChange={(v) => update(i, { documentType: v as PassengerForm["documentType"] })}
                    options={[
                      { value: "dni", label: "DNI" },
                      { value: "passport", label: "Pasaporte" },
                      { value: "other", label: "Otro" },
                    ]}
                  />
                  <TextInput
                    label="Número"
                    value={p.documentNumber}
                    onChange={(v) => update(i, { documentNumber: v })}
                    placeholder="00000000"
                    required
                  />
                </div>
                {i === 0 ? (
                  <TextInput
                    label="Email"
                    type="email"
                    value={p.email}
                    onChange={(v) => update(i, { email: v })}
                    placeholder="tu@correo.com"
                  />
                ) : (
                  <div className="hidden sm:block" />
                )}
                {i === 0 && (
                  <TextInput
                    label="Teléfono"
                    value={p.phone}
                    onChange={(v) => update(i, { phone: v })}
                    placeholder="+51 999 999 999"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "rounded-2xl border border-input bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition-colors",
          "placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
        )}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer rounded-2xl border border-input bg-surface px-3 py-3 text-sm font-medium text-foreground outline-none focus:border-primary/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
