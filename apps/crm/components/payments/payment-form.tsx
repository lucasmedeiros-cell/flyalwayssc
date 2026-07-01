"use client";

import { useState } from "react";
import type { PaymentDetail, PaymentMethod } from "@vialta/types";
import { paymentStatusFor } from "@vialta/types";
import { Modal, Input, Field, Select, Button } from "@vialta/ui";

const METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "qr", label: "QR" },
  { value: "transfer", label: "Transferencia" },
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
];

export function PaymentForm({
  open,
  onClose,
  onCreate,
  nextCode,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: PaymentDetail) => void;
  nextCode: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [concept, setConcept] = useState("");
  const [relatedCode, setRelatedCode] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("qr");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState("");
  const [dueDate, setDueDate] = useState("");

  function reset() {
    setCustomerName(""); setConcept(""); setRelatedCode(""); setMethod("qr");
    setTotal(""); setPaid(""); setDueDate("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const totalN = Number(total) || 0;
    const paidN = Math.min(Number(paid) || 0, totalN);
    const now = new Date().toISOString();
    const p: PaymentDetail = {
      id: `pay-${Date.now()}`,
      code: nextCode,
      customerName,
      concept,
      relatedCode: relatedCode || undefined,
      method,
      total: { amount: totalN, currency: "BOB" },
      paid: { amount: paidN, currency: "BOB" },
      status: paymentStatusFor(totalN, paidN),
      dueDate: dueDate || undefined,
      agentName: "Ana Flores",
      createdAt: now,
      transactions: paidN > 0 ? [{ id: `x-${Date.now()}`, at: now, method, amount: { amount: paidN, currency: "BOB" } }] : [],
    };
    onCreate(p);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo pago"
      description={`Se registrará con el código ${nextCode}.`}
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="payment-form" disabled={!customerName || !total}>Registrar pago</Button>
        </>
      }
    >
      <form id="payment-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Cliente" htmlFor="cn">
          <Input id="cn" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Nombre del cliente" />
        </Field>
        <Field label="Relacionado (código)" htmlFor="rc">
          <Input id="rc" value={relatedCode} onChange={(e) => setRelatedCode(e.target.value)} placeholder="FA-20418" />
        </Field>
        <Field label="Concepto" htmlFor="co" className="sm:col-span-2">
          <Input id="co" value={concept} onChange={(e) => setConcept(e.target.value)} required placeholder="Boletos VVI → MAD" />
        </Field>
        <Field label="Método" htmlFor="me">
          <Select id="me" options={METHOD_OPTIONS} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} />
        </Field>
        <Field label="Vencimiento" htmlFor="dd">
          <Input id="dd" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
        <Field label="Total (Bs)" htmlFor="to">
          <Input id="to" type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} required placeholder="18450" />
        </Field>
        <Field label="Pago inicial (Bs)" htmlFor="pa">
          <Input id="pa" type="number" min={0} value={paid} onChange={(e) => setPaid(e.target.value)} placeholder="0" />
        </Field>
      </form>
    </Modal>
  );
}
