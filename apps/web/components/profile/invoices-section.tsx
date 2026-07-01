"use client";

import { Download, FileText } from "lucide-react";
import type { Invoice } from "@vialta/types";
import { formatDate, formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUS: Record<Invoice["status"], { label: string; tone: "success" | "warning" | "neutral" }> = {
  paid: { label: "Pagada", tone: "success" },
  pending: { label: "Pendiente", tone: "warning" },
  refunded: { label: "Reembolsada", tone: "neutral" },
};

export function InvoicesSection({ invoices }: { invoices: Invoice[] }) {
  function downloadInvoice(inv: Invoice) {
    const content = [
      "FlyAlways — Comprobante de factura",
      "----------------------------------",
      `Factura:  ${inv.number}`,
      `Reserva:  ${inv.bookingReference}`,
      `Fecha:    ${formatDate(inv.date)}`,
      `Importe:  ${formatMoney(inv.amount.amount, inv.amount.currency)}`,
      `Estado:   ${STATUS[inv.status].label}`,
      "",
      "Gracias por viajar con FlyAlways.",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.number}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
      {/* Cabecera (desktop) */}
      <div className="hidden grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
        <span>Factura</span>
        <span>Reserva</span>
        <span>Fecha</span>
        <span className="text-right">Importe</span>
        <span className="w-9" />
      </div>

      <ul className="divide-y divide-border">
        {invoices.map((inv) => {
          const status = STATUS[inv.status];
          return (
            <li
              key={inv.id}
              className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[1fr_1fr_1fr_auto_auto] sm:items-center sm:gap-4"
            >
              <span className="flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {inv.number}
              </span>
              <span className="text-sm text-muted-foreground">{inv.bookingReference}</span>
              <span className="text-sm text-muted-foreground">{formatDate(inv.date)}</span>
              <span className="flex items-center justify-between gap-3 sm:justify-end">
                <Badge tone={status.tone}>{status.label}</Badge>
                <span className="font-semibold tabular-nums">
                  {formatMoney(inv.amount.amount, inv.amount.currency)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => downloadInvoice(inv)}
                aria-label={`Descargar ${inv.number}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Download className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
