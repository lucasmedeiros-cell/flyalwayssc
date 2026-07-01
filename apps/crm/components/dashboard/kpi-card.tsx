"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { CrmKpi } from "@vialta/types";
import { cn, formatCompact, formatMoneyCompact } from "@vialta/ui";
import { useMoneyMask } from "@/components/privacy/privacy-provider";

export function KpiCard({ kpi, currency }: { kpi: CrmKpi; currency: string }) {
  const { mask } = useMoneyMask();
  const value =
    kpi.unit === "money"
      ? mask(formatMoneyCompact(kpi.value, currency))
      : kpi.unit === "pct"
        ? `${kpi.value}%`
        : formatCompact(kpi.value);

  const up = kpi.deltaPct >= 0;
  const good = kpi.invert ? !up : up;

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <p className="text-sm text-muted-foreground">{kpi.label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums sm:text-[1.75rem]">
        {value}
      </p>
      <span
        className={cn(
          "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          good ? "bg-success/14 text-success" : "bg-danger/14 text-danger"
        )}
      >
        {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        {up ? "+" : ""}
        {kpi.deltaPct}%
      </span>
    </div>
  );
}
