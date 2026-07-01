"use client";

import { Download, Mail, MessageCircle, Copy, ArrowRightLeft } from "lucide-react";
import type { Quote } from "@vialta/types";
import { QUOTE_STATUS_LABEL, quoteSubtotal, quoteTaxes, quoteTotal } from "@vialta/types";
import { Modal, Badge, Button, BrandLogo, buttonClasses, formatMoney, formatDate } from "@vialta/ui";
import { QUOTE_STATUS_TONE } from "./quote-utils";

export function QuotePreview({
  quote,
  open,
  onClose,
  onDuplicate,
  onConvert,
  canManage,
}: {
  quote: Quote | null;
  open: boolean;
  onClose: () => void;
  onDuplicate: (q: Quote) => void;
  onConvert: (q: Quote) => void;
  canManage: boolean;
}) {
  if (!quote) return null;
  const q = quote;
  const subtotal = quoteSubtotal(q);
  const taxes = quoteTaxes(q);
  const total = quoteTotal(q);

  const mailto = `mailto:${q.customerEmail ?? ""}?subject=${encodeURIComponent(`Cotización ${q.code} · FlyAlways`)}&body=${encodeURIComponent(
    `Estimado/a ${q.customerName},\n\nAdjuntamos la cotización ${q.code} por un total de ${formatMoney(total, q.currency)}, válida hasta el ${formatDate(q.validUntil)}.\n\nSaludos,\n${q.agentName} — FlyAlways`
  )}`;
  const waPhone = (q.customerPhone ?? "").replace(/\D/g, "");
  const wa = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hola ${q.customerName}, te enviamos la cotización ${q.code} de FlyAlways por ${formatMoney(total, q.currency)} (válida hasta ${formatDate(q.validUntil)}).`
  )}`;

  return (
    <Modal open={open} onClose={onClose} size="xl">
      {/* Documento imprimible */}
      <div className="print-area">
        <div className="flex items-start justify-between gap-4">
          <BrandLogo size={44} tagline="Agencia de viajes" />
          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">COTIZACIÓN</p>
            <p className="text-sm font-medium tabular-nums">{q.code}</p>
            <Badge tone={QUOTE_STATUS_TONE[q.status]} className="mt-1">{QUOTE_STATUS_LABEL[q.status]}</Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Cliente</p>
            <p className="font-semibold">{q.customerName}</p>
            {q.customerEmail && <p className="text-sm text-muted-foreground">{q.customerEmail}</p>}
            {q.customerPhone && <p className="text-sm text-muted-foreground">{q.customerPhone}</p>}
          </div>
          <div className="sm:text-right">
            <p className="text-sm"><span className="text-muted-foreground">Fecha: </span>{formatDate(q.createdAt)}</p>
            <p className="text-sm"><span className="text-muted-foreground">Válida hasta: </span>{formatDate(q.validUntil)}</p>
            <p className="text-sm"><span className="text-muted-foreground">Agente: </span>{q.agentName}</p>
          </div>
        </div>

        {/* Tabla de ítems */}
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-2 font-medium">Concepto</th>
              <th className="py-2 px-2 text-center font-medium">Cant.</th>
              <th className="py-2 px-2 text-right font-medium">P. unitario</th>
              <th className="py-2 pl-2 text-right font-medium">Importe</th>
            </tr>
          </thead>
          <tbody>
            {q.items.map((it) => (
              <tr key={it.id} className="border-b border-border align-top">
                <td className="py-2.5 pr-2">
                  <p className="font-medium">{it.description}</p>
                  {it.detail && <p className="text-xs text-muted-foreground">{it.detail}</p>}
                </td>
                <td className="py-2.5 px-2 text-center tabular-nums">{it.quantity}</td>
                <td className="py-2.5 px-2 text-right tabular-nums">{formatMoney(it.unitPrice, q.currency)}</td>
                <td className="py-2.5 pl-2 text-right tabular-nums">{formatMoney(it.quantity * it.unitPrice, q.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="mt-4 flex justify-end">
          <ul className="w-full max-w-xs space-y-1.5 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{formatMoney(subtotal, q.currency)}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Impuestos ({q.taxPct}%)</span><span className="tabular-nums">{formatMoney(taxes, q.currency)}</span></li>
            <li className="flex justify-between border-t border-border pt-1.5 text-base font-bold"><span>Total</span><span className="tabular-nums">{formatMoney(total, q.currency)}</span></li>
          </ul>
        </div>

        {q.notes && (
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Notas</p>
            <p className="mt-1 text-sm text-muted-foreground">{q.notes}</p>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          FlyAlways · Agencia de viajes · Santa Cruz, Bolivia · Gracias por su preferencia
        </p>
      </div>

      {/* Acciones (no se imprimen) */}
      <div className="no-print mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="h-4 w-4" /> Descargar PDF
        </Button>
        {q.customerEmail && (
          <a href={mailto} className={buttonClasses({ variant: "outline", size: "sm" })}>
            <Mail className="h-4 w-4" /> Email
          </a>
        )}
        {waPhone && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "outline", size: "sm" })}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        )}
        {canManage && (
          <>
            <Button variant="ghost" size="sm" onClick={() => onDuplicate(q)}>
              <Copy className="h-4 w-4" /> Duplicar
            </Button>
            {q.status !== "converted" && (
              <Button size="sm" onClick={() => onConvert(q)}>
                <ArrowRightLeft className="h-4 w-4" /> Convertir en venta
              </Button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
