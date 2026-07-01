"use client";

import { useState } from "react";
import type { Campaign, MarketingChannel, CampaignAudience } from "@vialta/types";
import { MARKETING_CHANNEL_LABEL, CAMPAIGN_AUDIENCE_LABEL } from "@vialta/types";
import { Modal, Input, Field, Select, Textarea, Button } from "@vialta/ui";

const CHANNEL_OPTIONS = (Object.keys(MARKETING_CHANNEL_LABEL) as MarketingChannel[]).map((k) => ({ value: k, label: MARKETING_CHANNEL_LABEL[k] }));
const AUDIENCE_OPTIONS = (Object.keys(CAMPAIGN_AUDIENCE_LABEL) as CampaignAudience[]).map((k) => ({ value: k, label: CAMPAIGN_AUDIENCE_LABEL[k] }));

/** Tamaño estimado de audiencia por segmento (mock; en la API real lo calcula el backend). */
const AUDIENCE_SIZE: Record<CampaignAudience, number> = {
  all: 1240,
  frequent: 540,
  inactive: 210,
  new: 95,
  birthday: 86,
  with_balance: 64,
  custom: 0,
};

export function CampaignForm({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (c: Campaign) => void;
}) {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<MarketingChannel>("email");
  const [audience, setAudience] = useState<CampaignAudience>("frequent");
  const [subject, setSubject] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  function reset() {
    setName(""); setChannel("email"); setAudience("frequent"); setSubject(""); setScheduledAt("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const size = AUDIENCE_SIZE[audience];
    const c: Campaign = {
      id: `cm-${Date.now()}`,
      name,
      channel,
      status: scheduledAt ? "scheduled" : "draft",
      audience,
      subject: subject || undefined,
      owner: "María Fernández",
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      metrics: { audience: size, sent: 0, opened: 0, clicked: 0, converted: 0 },
      createdAt: new Date().toISOString(),
    };
    onCreate(c);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva campaña"
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="campaign-form" disabled={!name}>
            {scheduledAt ? "Programar campaña" : "Guardar borrador"}
          </Button>
        </>
      }
    >
      <form id="campaign-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="cm-nm" className="sm:col-span-2">
          <Input id="cm-nm" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Promo verano Caribe 2026" />
        </Field>
        <Field label="Canal" htmlFor="cm-ch">
          <Select id="cm-ch" options={CHANNEL_OPTIONS} value={channel} onChange={(e) => setChannel(e.target.value as MarketingChannel)} />
        </Field>
        <Field label="Audiencia" htmlFor="cm-au">
          <Select id="cm-au" options={AUDIENCE_OPTIONS} value={audience} onChange={(e) => setAudience(e.target.value as CampaignAudience)} />
        </Field>
        <Field label="Asunto / mensaje" htmlFor="cm-sub" className="sm:col-span-2">
          <Textarea id="cm-sub" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Escribí el asunto del email o la primera línea del mensaje…" />
        </Field>
        <Field label="Programar envío (opcional)" htmlFor="cm-sc" className="sm:col-span-2">
          <Input id="cm-sc" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
