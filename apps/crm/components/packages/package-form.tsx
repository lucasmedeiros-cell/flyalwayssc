"use client";

import { useState } from "react";
import type { TravelPackage, PackageType, PackageStatus } from "@vialta/types";
import { PACKAGE_TYPE_LABEL } from "@vialta/types";
import { Modal, Input, Field, Select, Textarea, Button } from "@vialta/ui";

const TYPE_OPTIONS = (Object.keys(PACKAGE_TYPE_LABEL) as PackageType[]).map((k) => ({ value: k, label: PACKAGE_TYPE_LABEL[k] }));
const STATUS_OPTIONS = [
  { value: "active", label: "Activo" },
  { value: "draft", label: "Borrador" },
  { value: "inactive", label: "Inactivo" },
];

export function PackageForm({
  open,
  onClose,
  onCreate,
  seq,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: TravelPackage) => void;
  seq: number;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<PackageType>("tour");
  const [destination, setDestination] = useState("");
  const [durationDays, setDurationDays] = useState("1");
  const [price, setPrice] = useState("");
  const [providerName, setProviderName] = useState("");
  const [includes, setIncludes] = useState("");
  const [status, setStatus] = useState<PackageStatus>("active");
  const [description, setDescription] = useState("");

  function reset() {
    setName(""); setType("tour"); setDestination(""); setDurationDays("1"); setPrice("");
    setProviderName(""); setIncludes(""); setStatus("active"); setDescription("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p: TravelPackage = {
      id: `pk-${Date.now()}`,
      code: `PKG-${510 + seq}`,
      name,
      type,
      destination,
      durationDays: Number(durationDays) || 1,
      price: { amount: Number(price) || 0, currency: "BOB" },
      providerName,
      includes: includes.split(",").map((s) => s.trim()).filter(Boolean),
      status,
      soldCount: 0,
      description: description || undefined,
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
      title="Nuevo paquete"
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="package-form" disabled={!name || !destination}>Crear paquete</Button>
        </>
      }
    >
      <form id="package-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="nm" className="sm:col-span-2">
          <Input id="nm" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Crucero Caribe 7 noches" />
        </Field>
        <Field label="Tipo" htmlFor="ty">
          <Select id="ty" options={TYPE_OPTIONS} value={type} onChange={(e) => setType(e.target.value as PackageType)} />
        </Field>
        <Field label="Destino" htmlFor="de">
          <Input id="de" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="Caribe" />
        </Field>
        <Field label="Duración (días)" htmlFor="du">
          <Input id="du" type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} />
        </Field>
        <Field label="Precio (Bs)" htmlFor="pr">
          <Input id="pr" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="9800" />
        </Field>
        <Field label="Proveedor" htmlFor="pv">
          <Input id="pv" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Royal Caribbean" />
        </Field>
        <Field label="Estado" htmlFor="st">
          <Select id="st" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as PackageStatus)} />
        </Field>
        <Field label="Incluye (separado por coma)" htmlFor="in" className="sm:col-span-2">
          <Input id="in" value={includes} onChange={(e) => setIncludes(e.target.value)} placeholder="Cabina balcón, Pensión completa, Espectáculos" />
        </Field>
        <Field label="Descripción" htmlFor="ds" className="sm:col-span-2">
          <Textarea id="ds" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalle del paquete…" />
        </Field>
      </form>
    </Modal>
  );
}
