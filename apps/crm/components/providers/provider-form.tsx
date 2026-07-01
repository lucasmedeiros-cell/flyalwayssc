"use client";

import { useState } from "react";
import type { Provider, ProviderType, ProviderStatus } from "@vialta/types";
import { PROVIDER_TYPE_LABEL } from "@vialta/types";
import { Modal, Input, Field, Select, Textarea, Button } from "@vialta/ui";

const TYPE_OPTIONS = (Object.keys(PROVIDER_TYPE_LABEL) as ProviderType[]).map((k) => ({ value: k, label: PROVIDER_TYPE_LABEL[k] }));
const STATUS_OPTIONS = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

export function ProviderForm({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: Provider) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ProviderType>("operator");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Bolivia");
  const [status, setStatus] = useState<ProviderStatus>("active");
  const [notes, setNotes] = useState("");

  function reset() {
    setName(""); setType("operator"); setContactName(""); setEmail(""); setPhone("");
    setCity(""); setCountry("Bolivia"); setStatus("active"); setNotes("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p: Provider = {
      id: `pv-${Date.now()}`,
      name,
      type,
      contactName: contactName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      city: city || undefined,
      country,
      rating: 0,
      status,
      balance: { amount: 0, currency: "BOB" },
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };
    onCreate(p);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo proveedor"
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="provider-form" disabled={!name}>Crear proveedor</Button>
        </>
      }
    >
      <form id="provider-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="nm" className="sm:col-span-2">
          <Input id="nm" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Royal Caribbean" />
        </Field>
        <Field label="Tipo" htmlFor="ty">
          <Select id="ty" options={TYPE_OPTIONS} value={type} onChange={(e) => setType(e.target.value as ProviderType)} />
        </Field>
        <Field label="Contacto" htmlFor="ct">
          <Input id="ct" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Nombre del contacto" />
        </Field>
        <Field label="Email" htmlFor="em">
          <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ventas@proveedor.com" />
        </Field>
        <Field label="Teléfono" htmlFor="ph">
          <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+591 ..." />
        </Field>
        <Field label="Ciudad" htmlFor="ci">
          <Input id="ci" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Santa Cruz" />
        </Field>
        <Field label="País" htmlFor="co">
          <Input id="co" value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Estado" htmlFor="st" className="sm:col-span-2">
          <Select id="st" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as ProviderStatus)} />
        </Field>
        <Field label="Notas" htmlFor="no" className="sm:col-span-2">
          <Textarea id="no" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Condiciones comerciales, observaciones…" />
        </Field>
      </form>
    </Modal>
  );
}
