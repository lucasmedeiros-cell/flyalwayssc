"use client";

import { CreditCard, Wallet, QrCode, Landmark, Lock } from "lucide-react";
import {
  type BookingDraft,
  type PaymentForm,
  type PaymentMethod,
  type Quote,
} from "@/lib/booking/config";
import { cn } from "@/lib/utils";
import { StepHeading } from "./step-heading";

const METHODS: { id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "card", label: "Tarjeta", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Wallet },
  { id: "mercadopago", label: "Mercado Pago", icon: Wallet },
  { id: "transfer", label: "Transferencia", icon: Landmark },
  { id: "qr", label: "Pago QR", icon: QrCode },
  { id: "wallet", label: "Wallet FlyAlways", icon: Wallet },
];

export function StepPayment({
  draft,
  onChange,
  quote,
}: {
  draft: BookingDraft;
  onChange: (d: BookingDraft) => void;
  quote: Quote;
}) {
  const setPay = (patch: Partial<PaymentForm>) =>
    onChange({ ...draft, payment: { ...draft.payment, ...patch } });

  const p = draft.payment;

  const onCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 19);
    const grouped = digits.replace(/(.{4})/g, "$1 ").trim();
    setPay({ cardNumber: grouped });
  };
  const onExp = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setPay({ cardExp: formatted });
  };

  return (
    <div>
      <StepHeading title="Pago" subtitle="Elige tu método de pago. Tus datos viajan cifrados." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {METHODS.map((m) => {
          const active = p.method === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setPay({ method: m.id })}
              aria-pressed={active}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all",
                active
                  ? "border-primary bg-primary/8 shadow-[var(--shadow-sm)]"
                  : "border-border bg-surface hover:border-primary/40"
              )}
            >
              <m.icon className={cn("h-6 w-6", active ? "text-primary" : "text-muted-foreground")} />
              <span className="text-xs font-medium">{m.label}</span>
            </button>
          );
        })}
      </div>

      {p.method === "card" ? (
        <div className="mt-6 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Titular de la tarjeta"
              value={p.cardName}
              onChange={(v) => setPay({ cardName: v })}
              placeholder="Como aparece en la tarjeta"
            />
            <Input
              label="Número de tarjeta"
              value={p.cardNumber}
              onChange={onCardNumber}
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Vencimiento" value={p.cardExp} onChange={onExp} placeholder="MM/AA" inputMode="numeric" />
              <Input
                label="CVC"
                value={p.cardCvc}
                onChange={(v) => setPay({ cardCvc: v.replace(/\D/g, "").slice(0, 4) })}
                placeholder="123"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Al continuar te redirigiremos a <span className="font-medium text-foreground">{METHODS.find((m) => m.id === p.method)?.label}</span> para completar el pago de forma segura.
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums">
            {quote.currency} {quote.total.toFixed(2)}
          </p>
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        Demostración: no se procesa ningún cobro real.
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-input bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
