"use client";

import { useState } from "react";
import type { GeneratedDocument, DocumentKind } from "@vialta/types";
import { DOCUMENT_KIND_LABEL } from "@vialta/types";
import { Modal, Input, Field, Select, Textarea, Button } from "@vialta/ui";

const KIND_OPTIONS = (Object.keys(DOCUMENT_KIND_LABEL) as DocumentKind[]).map((k) => ({ value: k, label: DOCUMENT_KIND_LABEL[k] }));

const PREFIX: Record<DocumentKind, string> = {
  invoice: "FAC", receipt: "REC", credit_note: "NC", voucher: "VOU", itinerary: "ITN", confirmation: "CNF", contract: "CTR",
};

export function DocumentForm({
  open,
  onClose,
  onCreate,
  seq,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (d: GeneratedDocument) => void;
  seq: number;
}) {
  const [kind, setKind] = useState<DocumentKind>("invoice");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [concept, setConcept] = useState("");
  const [relatedCode, setRelatedCode] = useState("");
  const [amount, setAmount] = useState("");

  function reset() {
    setKind("invoice"); setCustomerName(""); setCustomerEmail(""); setCustomerPhone("");
    setConcept(""); setRelatedCode(""); setAmount("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    const d: GeneratedDocument = {
      id: `d-${Date.now()}`,
      code: `${PREFIX[kind]}-${10000 + seq}`,
      kind,
      customerName,
      customerEmail: customerEmail || undefined,
      customerPhone: customerPhone || undefined,
      relatedCode: relatedCode || undefined,
      concept,
      amount: amt > 0 ? { amount: amt, currency: "BOB" } : undefined,
      issuedAt: new Date().toISOString().slice(0, 10),
      status: "issued",
      agentName: "Ana Flores",
      createdAt: new Date().toISOString(),
    };
    onCreate(d);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generar documento"
      description="Crea facturas, recibos, vouchers, itinerarios, confirmaciones o contratos."
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="doc-form" disabled={!customerName || !concept}>Generar</Button>
        </>
      }
    >
      <form id="doc-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Tipo de documento" htmlFor="dk">
          <Select id="dk" options={KIND_OPTIONS} value={kind} onChange={(e) => setKind(e.target.value as DocumentKind)} />
        </Field>
        <Field label="Relacionado (código)" htmlFor="rc">
          <Input id="rc" value={relatedCode} onChange={(e) => setRelatedCode(e.target.value)} placeholder="FA-20418 / PG-3041" />
        </Field>
        <Field label="Cliente" htmlFor="cn">
          <Input id="cn" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Nombre del cliente" />
        </Field>
        <Field label="Email" htmlFor="ce">
          <Input id="ce" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="cliente@correo.com" />
        </Field>
        <Field label="WhatsApp / teléfono" htmlFor="cp">
          <Input id="cp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+591 7..." />
        </Field>
        <Field label="Monto (Bs, opcional)" htmlFor="am">
          <Input id="am" type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="18450" />
        </Field>
        <Field label="Concepto" htmlFor="co" className="sm:col-span-2">
          <Textarea id="co" value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Descripción del documento…" required />
        </Field>
      </form>
    </Modal>
  );
}
