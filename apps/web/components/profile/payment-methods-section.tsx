"use client";

import { CreditCard, Plus, Wallet } from "lucide-react";
import type { PaymentMethodInfo } from "@vialta/types";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PaymentMethodsSection({ methods }: { methods: PaymentMethodInfo[] }) {
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
              className="text-sm font-medium text-primary hover:underline"
            >
              Hacer principal
            </button>
          )}
        </div>
      ))}

      <Button variant="outline" className="w-full" size="lg">
        <Plus className="h-4 w-4" />
        Añadir método de pago
      </Button>
    </div>
  );
}
