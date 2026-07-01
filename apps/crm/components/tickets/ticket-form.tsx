"use client";

import { useState } from "react";
import type { Ticket, TicketTripType, TicketStatus } from "@vialta/types";
import type { TravelClass } from "@vialta/types";
import { Modal, Input, Field, Select, Button } from "@vialta/ui";

const TRIP_OPTIONS = [
  { value: "round_trip", label: "Ida y vuelta" },
  { value: "one_way", label: "Solo ida" },
  { value: "multi_city", label: "Multidestino" },
];

const CLASS_OPTIONS = [
  { value: "economy", label: "Económica" },
  { value: "premium_economy", label: "Premium economy" },
  { value: "business", label: "Ejecutiva" },
  { value: "first", label: "Primera" },
];

const STATUS_OPTIONS = [
  { value: "quote", label: "Cotización" },
  { value: "reserved", label: "Reservado" },
  { value: "confirmed", label: "Confirmado" },
  { value: "issued", label: "Emitido" },
];

const AGENTS = [
  { value: "a1", label: "Ana Flores" },
  { value: "a2", label: "Carlos Mendoza" },
  { value: "a3", label: "Lucía Pérez" },
];

export function TicketForm({
  open,
  onClose,
  onCreate,
  nextCode,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (t: Ticket) => void;
  nextCode: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [airline, setAirline] = useState("");
  const [origin, setOrigin] = useState("");
  const [originCode, setOriginCode] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationCode, setDestinationCode] = useState("");
  const [tripType, setTripType] = useState<TicketTripType>("round_trip");
  const [travelClass, setTravelClass] = useState<TravelClass>("economy");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [fare, setFare] = useState("");
  const [taxes, setTaxes] = useState("");
  const [commission, setCommission] = useState("");
  const [profit, setProfit] = useState("");
  const [pnr, setPnr] = useState("");
  const [provider, setProvider] = useState("");
  const [agentId, setAgentId] = useState("a1");
  const [status, setStatus] = useState<TicketStatus>("quote");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const f = Number(fare) || 0;
    const tx = Number(taxes) || 0;
    const t: Ticket = {
      id: `t-${Date.now()}`,
      code: nextCode,
      customerId: "",
      customerName,
      agentId,
      agentName: AGENTS.find((a) => a.value === agentId)?.label ?? "Ana Flores",
      airline,
      airlineCode: airline.slice(0, 2).toUpperCase(),
      pnr: pnr || undefined,
      gds: "Amadeus",
      originCity: origin,
      originCode: originCode.toUpperCase(),
      destinationCity: destination,
      destinationCode: destinationCode.toUpperCase(),
      tripType,
      travelClass,
      travelDate,
      passengerCount: Number(passengers) || 1,
      fare: { amount: f, currency: "BOB" },
      taxes: { amount: tx, currency: "BOB" },
      total: { amount: f + tx, currency: "BOB" },
      commission: { amount: Number(commission) || 0, currency: "BOB" },
      profit: { amount: Number(profit) || 0, currency: "BOB" },
      providerId: "p0",
      providerName: provider || airline,
      status,
      createdAt: new Date().toISOString(),
    };
    onCreate(t);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva venta / pasaje"
      description={`Se registrará con el código ${nextCode}.`}
      size="xl"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="ticket-form">Registrar pasaje</Button>
        </>
      }
    >
      <form id="ticket-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Cliente" htmlFor="cn" className="sm:col-span-2 lg:col-span-1">
          <Input id="cn" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Nombre del cliente" />
        </Field>
        <Field label="Aerolínea" htmlFor="al">
          <Input id="al" value={airline} onChange={(e) => setAirline(e.target.value)} required placeholder="BoA, LATAM…" />
        </Field>
        <Field label="PNR" htmlFor="pn">
          <Input id="pn" value={pnr} onChange={(e) => setPnr(e.target.value)} placeholder="AB12CD" />
        </Field>
        <Field label="Origen (ciudad)" htmlFor="or">
          <Input id="or" value={origin} onChange={(e) => setOrigin(e.target.value)} required placeholder="Santa Cruz" />
        </Field>
        <Field label="Código origen" htmlFor="orc">
          <Input id="orc" value={originCode} onChange={(e) => setOriginCode(e.target.value)} required placeholder="VVI" maxLength={3} />
        </Field>
        <Field label="Tipo de viaje" htmlFor="tt">
          <Select id="tt" options={TRIP_OPTIONS} value={tripType} onChange={(e) => setTripType(e.target.value as TicketTripType)} />
        </Field>
        <Field label="Destino (ciudad)" htmlFor="de">
          <Input id="de" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="Madrid" />
        </Field>
        <Field label="Código destino" htmlFor="dec">
          <Input id="dec" value={destinationCode} onChange={(e) => setDestinationCode(e.target.value)} required placeholder="MAD" maxLength={3} />
        </Field>
        <Field label="Clase" htmlFor="cl">
          <Select id="cl" options={CLASS_OPTIONS} value={travelClass} onChange={(e) => setTravelClass(e.target.value as TravelClass)} />
        </Field>
        <Field label="Fecha de viaje" htmlFor="td">
          <Input id="td" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
        </Field>
        <Field label="Pasajeros" htmlFor="px">
          <Input id="px" type="number" min={1} value={passengers} onChange={(e) => setPassengers(e.target.value)} />
        </Field>
        <Field label="Agente" htmlFor="ag">
          <Select id="ag" options={AGENTS} value={agentId} onChange={(e) => setAgentId(e.target.value)} />
        </Field>
        <Field label="Tarifa (Bs)" htmlFor="fa">
          <Input id="fa" type="number" min={0} value={fare} onChange={(e) => setFare(e.target.value)} required placeholder="14800" />
        </Field>
        <Field label="Impuestos (Bs)" htmlFor="tx">
          <Input id="tx" type="number" min={0} value={taxes} onChange={(e) => setTaxes(e.target.value)} placeholder="3650" />
        </Field>
        <Field label="Proveedor" htmlFor="pr">
          <Input id="pr" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Iberia Bolivia" />
        </Field>
        <Field label="Comisión (Bs)" htmlFor="co">
          <Input id="co" type="number" min={0} value={commission} onChange={(e) => setCommission(e.target.value)} placeholder="1480" />
        </Field>
        <Field label="Utilidad (Bs)" htmlFor="ut">
          <Input id="ut" type="number" min={0} value={profit} onChange={(e) => setProfit(e.target.value)} placeholder="2100" />
        </Field>
        <Field label="Estado inicial" htmlFor="st">
          <Select id="st" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} />
        </Field>
      </form>
    </Modal>
  );
}
