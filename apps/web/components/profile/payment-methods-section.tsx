"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Plus, Wallet, X } from "lucide-react";
import type { PaymentMethodInfo } from "@vialta/types";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PaymentMethodsSection({ methods: initial }: { methods: PaymentMethodInfo[] }) {
  const [methods, setMethods] = useState<PaymentMethodInfo[]>(initial);
  const [addOpen, setAddOpen] = useState(false);
  const [label, setLabel] = useState("Visa");
  const [last4, setLast4] = useState("");
  const [expiry, setExpiry] = useState("");

  function makeDefault(id: string) {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  }

  function resetForm() {
    setLabel("Visa");
    setLast4("");
    setExpiry("");
  }

  function addMethod(e: React.FormEvent) {
    e.preventDefault();
    const newMethod: PaymentMethodInfo = {
      id: `pm-${Date.now()}`,
      kind: "card",
      label,
      last4: last4.slice(-4),
      expiry,
      isDefault: false,
    };
    setMethods((prev) => [...prev, newMethod]);
    resetForm();
    setAddOpen(false);
  }

  return (
    <div className="space-y-3">
      {methods.map((m) => (
        <div
          key={m.id}
          className={cn(
            "flex items-center justify-between gap-4 rounded-3xl border bg-surface p-5 shadow-[var(--shadow-sm)]",
            m.isDefault ? "border-primary/40" : "border-border"
          )}
        >
          <div className="flex items-center gap-4">
            <span className="inline-flex h-11 w-14 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground">
              {m.kind === "wallet" ? <Wallet className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
            </span>
            <div>
              <p className="flex items-center gap-2 font-semibold">
                {m.label}
                {m.last4 && <span className="text-muted-foreground">•••• {m.last4}</span>}
                {m.isDefault && <Badge tone="primary">Predeterminada</Badge>}
              </p>
              <p className="text-xs text-muted-foreground">
                {m.expiry
                  ? `Vence ${m.expiry}`
                  : m.balance
                    ? `Saldo ${formatMoney(m.balance.amount, m.balance.currency)}`
                    : "Cuenta vinculada"}
              </p>
            </div>
          </div>
          {!m.isDefault && (
            <button
              type="button"
              onClick={() => makeDefault(m.id)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Hacer principal
            </button>
          )}
        </div>
      ))}

      <Button variant="outline" className="w-full" size="lg" onClick={() => setAddOpen(true)}>
        <Plus className="h-4 w-4" />
        Añadir método de pago
      </Button>

      <AnimatePresence>
        {addOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-label="Añadir método de pago"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lg)]"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">Añadir tarjeta</h2>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setAddOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <form onSubmit={addMethod} className="space-y-4 px-6 py-5">
                <div>
                  <label htmlFor="pm-label" className="mb-1.5 block text-sm font-medium">Tipo de tarjeta</label>
                  <select
                    id="pm-label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-border bg-surface px-4 text-sm outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
                  >
                    <option>Visa</option>
                    <option>Mastercard</option>
                    <option>Amex</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pm-last4" className="mb-1.5 block text-sm font-medium">Últimos 4 dígitos</label>
                  <input
                    id="pm-last4"
                    inputMode="numeric"
                    maxLength={4}
                    required
                    value={last4}
                    onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))}
                    placeholder="4242"
                    className="h-11 w-full rounded-2xl border border-border bg-surface px-4 text-sm tabular-nums outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                </div>
                <div>
                  <label htmlFor="pm-expiry" className="mb-1.5 block text-sm font-medium">Vencimiento (MM/AA)</label>
                  <input
                    id="pm-expiry"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="08/27"
                    className="h-11 w-full rounded-2xl border border-border bg-surface px-4 text-sm tabular-nums outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={last4.length < 4 || !expiry.trim()}>Guardar tarjeta</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
