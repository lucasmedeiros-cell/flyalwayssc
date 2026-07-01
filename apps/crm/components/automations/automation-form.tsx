"use client";

import { useState } from "react";
import type { Automation, AutomationTrigger, MarketingChannel } from "@vialta/types";
import { AUTOMATION_TRIGGER_LABEL, MARKETING_CHANNEL_LABEL } from "@vialta/types";
import { Modal, Input, Field, Select, Button } from "@vialta/ui";

const TRIGGER_OPTIONS = (Object.keys(AUTOMATION_TRIGGER_LABEL) as AutomationTrigger[]).map((k) => ({ value: k, label: AUTOMATION_TRIGGER_LABEL[k] }));
const CHANNEL_OPTIONS = (Object.keys(MARKETING_CHANNEL_LABEL) as MarketingChannel[]).map((k) => ({ value: k, label: MARKETING_CHANNEL_LABEL[k] }));

export function AutomationForm({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (a: Automation) => void;
}) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState<AutomationTrigger>("payment_due");
  const [channel, setChannel] = useState<MarketingChannel>("whatsapp");
  const [timing, setTiming] = useState("");

  function reset() {
    setName(""); setTrigger("payment_due"); setChannel("whatsapp"); setTiming("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const a: Automation = {
      id: `au-${Date.now()}`,
      name,
      trigger,
      channel,
      status: "active",
      timing: timing || "Al ocurrir el evento",
      runs: 0,
      createdAt: new Date().toISOString(),
    };
    onCreate(a);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva automatización"
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="automation-form" disabled={!name}>Activar automatización</Button>
        </>
      }
    >
      <form id="automation-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="au-nm" className="sm:col-span-2">
          <Input id="au-nm" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Recordatorio de pago pendiente" />
        </Field>
        <Field label="Disparador" htmlFor="au-tr">
          <Select id="au-tr" options={TRIGGER_OPTIONS} value={trigger} onChange={(e) => setTrigger(e.target.value as AutomationTrigger)} />
        </Field>
        <Field label="Canal" htmlFor="au-ch">
          <Select id="au-ch" options={CHANNEL_OPTIONS} value={channel} onChange={(e) => setChannel(e.target.value as MarketingChannel)} />
        </Field>
        <Field label="Condición / momento" htmlFor="au-ti" className="sm:col-span-2">
          <Input id="au-ti" value={timing} onChange={(e) => setTiming(e.target.value)} placeholder="3 días antes del vencimiento" />
        </Field>
      </form>
    </Modal>
  );
}
