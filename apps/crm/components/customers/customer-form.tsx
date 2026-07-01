"use client";

import { useState } from "react";
import type { Customer, CustomerStatus, CustomerDocumentType } from "@vialta/types";
import { customerInitials } from "@vialta/types";
import { Modal, Input, Field, Select, Textarea, Button } from "@vialta/ui";

const STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: "active", label: "Activo" },
  { value: "prospect", label: "Prospecto" },
  { value: "vip", label: "VIP" },
  { value: "inactive", label: "Inactivo" },
];

const DOC_OPTIONS: { value: CustomerDocumentType; label: string }[] = [
  { value: "dni", label: "Cédula de identidad" },
  { value: "passport", label: "Pasaporte" },
  { value: "ce", label: "Carnet de extranjería" },
  { value: "other", label: "Otro" },
];

const AGENTS = [
  { value: "a1", label: "Ana Flores" },
  { value: "a2", label: "Carlos Mendoza" },
  { value: "a3", label: "Lucía Pérez" },
];

export function CustomerForm({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (c: Customer) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [documentType, setDocumentType] = useState<CustomerDocumentType>("dni");
  const [documentNumber, setDocumentNumber] = useState("");
  const [nationality, setNationality] = useState("Boliviana");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Bolivia");
  const [status, setStatus] = useState<CustomerStatus>("active");
  const [agentId, setAgentId] = useState("a1");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  function reset() {
    setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setWhatsapp("");
    setDocumentType("dni"); setDocumentNumber(""); setNationality("Boliviana");
    setCity(""); setCountry("Bolivia"); setStatus("active"); setAgentId("a1");
    setTags(""); setNotes("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const c: Customer = {
      id: `c-${Date.now()}`,
      firstName,
      lastName,
      documentType,
      documentNumber,
      nationality,
      phone: phone || undefined,
      whatsapp: whatsapp || undefined,
      email,
      city: city || undefined,
      country,
      assignedAgentId: agentId,
      assignedAgentName: AGENTS.find((a) => a.value === agentId)?.label ?? "Ana Flores",
      status,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      notes: notes || undefined,
      totalSpent: { amount: 0, currency: "BOB" },
      tripsCount: 0,
      favoriteDestinations: [],
      favoriteAirlines: [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };
    onCreate(c);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo cliente"
      description="Registra un cliente en el CRM de FlyAlways."
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="customer-form">
            Guardar cliente
          </Button>
        </>
      }
    >
      <form id="customer-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="fn">
          <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Roberto" />
        </Field>
        <Field label="Apellido" htmlFor="ln">
          <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Áñez" />
        </Field>
        <Field label="Tipo de documento" htmlFor="dt">
          <Select id="dt" options={DOC_OPTIONS} value={documentType} onChange={(e) => setDocumentType(e.target.value as CustomerDocumentType)} />
        </Field>
        <Field label="N° de documento" htmlFor="dn">
          <Input id="dn" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required placeholder="5402188 SC" />
        </Field>
        <Field label="Email" htmlFor="em">
          <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="cliente@correo.com" />
        </Field>
        <Field label="Teléfono" htmlFor="ph">
          <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+591 3 ..." />
        </Field>
        <Field label="WhatsApp" htmlFor="wa">
          <Input id="wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+591 7..." />
        </Field>
        <Field label="Nacionalidad" htmlFor="na">
          <Input id="na" value={nationality} onChange={(e) => setNationality(e.target.value)} />
        </Field>
        <Field label="Ciudad" htmlFor="ci">
          <Input id="ci" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Santa Cruz" />
        </Field>
        <Field label="País" htmlFor="co">
          <Input id="co" value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Estado" htmlFor="st">
          <Select id="st" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as CustomerStatus)} />
        </Field>
        <Field label="Agente asignado" htmlFor="ag">
          <Select id="ag" options={AGENTS} value={agentId} onChange={(e) => setAgentId(e.target.value)} />
        </Field>
        <Field label="Etiquetas (separadas por coma)" htmlFor="tg" className="sm:col-span-2">
          <Input id="tg" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Corporativo, Frecuente, Europa" />
        </Field>
        <Field label="Observaciones" htmlFor="no" className="sm:col-span-2">
          <Textarea id="no" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferencias, notas internas…" />
        </Field>
      </form>

      {(firstName || lastName) && (
        <p className="mt-3 text-xs text-muted-foreground">
          Iniciales generadas: <span className="font-semibold text-foreground">{customerInitials({ firstName: firstName || " ", lastName: lastName || " " })}</span>
        </p>
      )}
    </Modal>
  );
}
