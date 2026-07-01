"use client";

import { useState } from "react";
import type { CrmNotification, CrmNotificationChannel, CrmNotificationKind } from "@vialta/types";
import { CRM_NOTIFICATION_CHANNEL_LABEL, CRM_NOTIFICATION_KIND_LABEL } from "@vialta/types";
import { Modal, Input, Field, Select, Textarea, Button } from "@vialta/ui";

const CHANNEL_OPTIONS = (Object.keys(CRM_NOTIFICATION_CHANNEL_LABEL) as CrmNotificationChannel[]).map((k) => ({ value: k, label: CRM_NOTIFICATION_CHANNEL_LABEL[k] }));
const KIND_OPTIONS = (Object.keys(CRM_NOTIFICATION_KIND_LABEL) as CrmNotificationKind[]).map((k) => ({ value: k, label: CRM_NOTIFICATION_KIND_LABEL[k] }));

export function NotificationForm({
  open,
  onClose,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  onSend: (n: CrmNotification) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<CrmNotificationChannel>("whatsapp");
  const [kind, setKind] = useState<CrmNotificationKind>("system");
  const [recipient, setRecipient] = useState("");

  function reset() {
    setTitle(""); setBody(""); setChannel("whatsapp"); setKind("system"); setRecipient("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n: CrmNotification = {
      id: `nt-${Date.now()}`,
      kind,
      channel,
      status: "sent",
      title,
      body,
      recipient: recipient || "Todos",
      at: new Date().toISOString(),
    };
    onSend(n);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enviar notificación"
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="notification-form" disabled={!title || !body}>Enviar ahora</Button>
        </>
      }
    >
      <form id="notification-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Título" htmlFor="nt-ti" className="sm:col-span-2">
          <Input id="nt-ti" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Recordatorio de pago" />
        </Field>
        <Field label="Canal" htmlFor="nt-ch">
          <Select id="nt-ch" options={CHANNEL_OPTIONS} value={channel} onChange={(e) => setChannel(e.target.value as CrmNotificationChannel)} />
        </Field>
        <Field label="Tipo" htmlFor="nt-ki">
          <Select id="nt-ki" options={KIND_OPTIONS} value={kind} onChange={(e) => setKind(e.target.value as CrmNotificationKind)} />
        </Field>
        <Field label="Destinatario" htmlFor="nt-re" className="sm:col-span-2">
          <Input id="nt-re" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Cliente, agente o «Todos»" />
        </Field>
        <Field label="Mensaje" htmlFor="nt-bo" className="sm:col-span-2">
          <Textarea id="nt-bo" value={body} onChange={(e) => setBody(e.target.value)} required placeholder="Escribí el contenido de la notificación…" />
        </Field>
      </form>
    </Modal>
  );
}
