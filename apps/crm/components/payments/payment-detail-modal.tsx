"use client";

import { useState } from "react";
import { Receipt, FileText, FileMinus } from "lucide-react";
import type { PaymentDetail, PaymentMethod, DocumentKind } from "@vialta/types";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, paymentBalance } from "@vialta/types";
import { Modal, Badge, Button, Input, Select, cn, formatMoney, formatDate, RelativeTime } from "@vialta/ui";
import { PAYMENT_STATUS_TONE } from "./payment-utils";

const METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "qr", label: "QR" },
  { value: "transfer", label: "Transferencia" },
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
];

export function PaymentDetailModal({
  payment,
  open,
  onClose,
  onRegister,
  onGenerate,
  canManage,
}: {
  payment: PaymentDetail | null;
  open: boolean;
  onClose: () => void;
  onRegister: (amount: number, method: PaymentMethod) => void;
  onGenerate: (kind: DocumentKind) => void;
  canManage: boolean;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("qr");
  const [error, setError] = useState<string | null>(null);

  if (!payment) return null;
  const p = payment;
  const balance = paymentBalance(p);

  function register(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    if (n > balance) {
      setError(`El abono no puede superar el saldo (${formatMoney(balance, p.total.currency)}).`);
      return;
    }
    setError(null);
    onRegister(n, method);
    setAmount("");
  }

  return (
    <Modal open={open} onClose={onClose} title={`Pago ${p.code}`} description={p.concept} size="lg">
      {/* Resumen financiero */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Cliente</p>
          <p className="font-semibold">{p.customerName}</p>
          {p.relatedCode && <p className="text-xs text-muted-foreground">Ref. {p.relatedCode}</p>}
        </div>
        <Badge tone={PAYMENT_STATUS_TONE[p.status]}>{PAYMENT_STATUS_LABEL[p.status]}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <Stat label="Total" value={formatMoney(p.total.amount, p.total.currency)} />
        <Stat label="Pagado" value={formatMoney(p.paid.amount, p.paid.currency)} tone="text-success" />
        <Stat label="Saldo" value={formatMoney(balance, p.total.currency)} tone={balance > 0 ? "text-warning" : "text-muted-foreground"} />
      </div>

      {/* Historial de abonos */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">Historial de abonos</p>
        {p.transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin abonos registrados.</p>
        ) : (
          <ul className="space-y-1.5">
            {p.transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl bg-surface-2/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">{PAYMENT_METHOD_LABEL[t.method]}</span>
                  {t.reference && <span className="text-xs text-muted-foreground">· {t.reference}</span>}
                </span>
                <span className="flex items-center gap-3">
                  <RelativeTime iso={t.at} className="text-xs text-muted-foreground" />
                  <span className={cn("font-medium tabular-nums", t.amount.amount < 0 ? "text-danger" : "text-foreground")}>
                    {formatMoney(t.amount.amount, t.amount.currency)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Registrar abono */}
      {canManage && balance > 0 && p.status !== "refunded" && (
        <form onSubmit={register} className="mt-4 flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-surface-2/40 p-3">
          <div className="flex-1 min-w-[120px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Monto del abono</label>
            <Input
              type="number"
              min={1}
              max={balance}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError(null);
              }}
              placeholder={`Hasta ${balance}`}
            />
          </div>
          <div className="min-w-[140px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Método</label>
            <Select options={METHOD_OPTIONS} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} />
          </div>
          <Button type="submit">Registrar abono</Button>
          {error && <p className="w-full text-xs font-medium text-danger">{error}</p>}
        </form>
      )}

      {/* Generar documentos */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <span className="w-full text-xs text-muted-foreground">Generar documento:</span>
        <Button variant="outline" size="sm" onClick={() => onGenerate("receipt")}>
          <Receipt className="h-4 w-4" /> Recibo
        </Button>
        <Button variant="outline" size="sm" onClick={() => onGenerate("invoice")}>
          <FileText className="h-4 w-4" /> Factura
        </Button>
        {canManage && (
          <Button variant="outline" size="sm" onClick={() => onGenerate("credit_note")}>
            <FileMinus className="h-4 w-4" /> Nota de crédito
          </Button>
        )}
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">Creado {formatDate(p.createdAt)} · Agente {p.agentName}</p>
    </Modal>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <p className={cn("font-[family-name:var(--font-display)] text-lg font-bold tabular-nums", tone)}>{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
