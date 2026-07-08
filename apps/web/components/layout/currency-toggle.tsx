"use client";

import { cn } from "@/lib/utils";
import { useCurrency, type Currency } from "@/components/common/currency-provider";

/** Selector Bs / $ para ver los precios en bolivianos o dólares. */
export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const options: { key: Currency; label: string }[] = [
    { key: "BOB", label: "Bs" },
    { key: "USD", label: "$" },
  ];
  return (
    <div
      role="group"
      aria-label="Moneda de los precios"
      title="Ver precios en bolivianos o dólares"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface p-0.5 text-xs font-semibold",
        className,
      )}
    >
      {options.map((o) => {
        const active = currency === o.key;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => setCurrency(o.key)}
            className={cn(
              "min-w-[2rem] rounded-full px-2.5 py-1 transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
