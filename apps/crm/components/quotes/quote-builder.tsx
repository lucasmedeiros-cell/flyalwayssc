"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Quote, QuoteItem } from "@vialta/types";
import { quoteSubtotal, quoteTaxes, quoteTotal } from "@vialta/types";
import { Modal, Input, Field, Textarea, Button, cn, formatMoney } from "@vialta/ui";

interface DraftItem {
  id: string;
  description: string;
  detail: string;
  quantity: string;
  unitPrice: string;
}

function emptyItem(): DraftItem {
  return { id: `it-${Math.round(performance.now() * 1000)}-${Math.random().toString(36).slice(2, 6)}`, description: "", detail: "", quantity: "1", unitPrice: "" };
}

export function QuoteBuilder({
  open,
  onClose,
  onCreate,
  nextCode,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (q: Quote) => void;
  nextCode: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [taxPct, setTaxPct] = useState("13");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([emptyItem()]);

  const parsedItems: QuoteItem[] = items
    .filter((it) => it.description.trim())
    .map((it) => ({
      id: it.id,
      description: it.description,
      detail: it.detail || undefined,
      quantity: Number(it.quantity) || 0,
      unitPrice: Number(it.unitPrice) || 0,
    }));

  const tax = Number(taxPct) || 0;
  const subtotal = quoteSubtotal({ items: parsedItems });
  const taxes = quoteTaxes({ items: parsedItems, taxPct: tax });
  const total = quoteTotal({ items: parsedItems, taxPct: tax });

  /** Filas con cantidad/precio/detalle pero sin concepto: se excluirían silenciosamente. */
  const rowIncomplete = (it: DraftItem) =>
    !it.description.trim() && (it.unitPrice.trim() !== "" || it.detail.trim() !== "" || Number(it.quantity) > 1);
  const hasIncomplete = items.some(rowIncomplete);

  function setItem(id: string, patch: Partial<DraftItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function reset() {
    setCustomerName(""); setCustomerEmail(""); setCustomerPhone(""); setValidUntil("");
    setTaxPct("13"); setNotes(""); setItems([emptyItem()]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q: Quote = {
      id: `q-${Date.now()}`,
      code: nextCode,
      customerName,
      customerEmail: customerEmail || undefined,
      customerPhone: customerPhone || undefined,
      agentName: "Ana Flores",
      items: parsedItems,
      currency: "BOB",
      taxPct: tax,
      validUntil,
      status: "draft",
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };
    onCreate(q);
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva cotización"
      description={`Se generará con el código ${nextCode}.`}
      size="xl"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="quote-form" disabled={parsedItems.length === 0 || !customerName}>Crear cotización</Button>
        </>
      }
    >
      <form id="quote-form" onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Cliente" htmlFor="cn">
            <Input id="cn" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Nombre del cliente" />
          </Field>
          <Field label="Email" htmlFor="ce">
            <Input id="ce" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="cliente@correo.com" />
          </Field>
          <Field label="WhatsApp" htmlFor="cp">
            <Input id="cp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+591 7..." />
          </Field>
        </div>

        {/* Ítems */}
        <div>
          <p className="mb-2 text-sm font-medium">Detalle</p>
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id} className="grid grid-cols-1 gap-2 rounded-2xl border border-border bg-background/40 p-3 sm:grid-cols-[1fr_5rem_7rem_2.5rem] sm:items-start">
                <div className="space-y-1.5">
                  <Input
                    value={it.description}
                    onChange={(e) => setItem(it.id, { description: e.target.value })}
                    placeholder="Concepto (ej. Vuelo VVI-MAD)"
                    aria-invalid={rowIncomplete(it)}
                    className={cn(rowIncomplete(it) && "border-danger/60 focus-visible:border-danger")}
                  />
                  <Input value={it.detail} onChange={(e) => setItem(it.id, { detail: e.target.value })} placeholder="Detalle opcional" className="h-9 text-xs" />
                </div>
                <Input type="number" min={1} value={it.quantity} onChange={(e) => setItem(it.id, { quantity: e.target.value })} placeholder="Cant." aria-label="Cantidad" />
                <Input type="number" min={0} value={it.unitPrice} onChange={(e) => setItem(it.id, { unitPrice: e.target.value })} placeholder="P. unit." aria-label="Precio unitario" />
                <button
                  type="button"
                  aria-label="Eliminar ítem"
                  onClick={() => setItems((prev) => (prev.length > 1 ? prev.filter((x) => x.id !== it.id) : prev))}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setItems((prev) => [...prev, emptyItem()])}>
            <Plus className="h-4 w-4" /> Agregar ítem
          </Button>
          {hasIncomplete && (
            <p className="mt-2 text-xs font-medium text-danger">
              Hay ítems con monto pero sin concepto: no se incluirán en la cotización hasta que les pongas un concepto.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Impuesto (%)" htmlFor="tx">
            <Input id="tx" type="number" min={0} max={100} value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />
          </Field>
          <Field label="Válida hasta" htmlFor="vu" className="sm:col-span-2">
            <Input id="vu" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} required />
          </Field>
        </div>

        <Field label="Notas" htmlFor="no">
          <Textarea id="no" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Condiciones, inclusiones, observaciones…" />
        </Field>

        {/* Totales en vivo */}
        <div className="rounded-2xl border border-border bg-surface-2/50 p-4">
          <ul className="ml-auto max-w-xs space-y-1.5 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatMoney(subtotal, "BOB")}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Impuestos ({tax}%)</span><span className="tabular-nums">{formatMoney(taxes, "BOB")}</span></li>
            <li className={cn("flex justify-between border-t border-border pt-1.5 text-base font-semibold")}><span>Total</span><span className="tabular-nums">{formatMoney(total, "BOB")}</span></li>
          </ul>
        </div>
      </form>
    </Modal>
  );
}
