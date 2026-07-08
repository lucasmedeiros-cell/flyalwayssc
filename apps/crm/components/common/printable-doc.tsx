import type { BadgeTone } from "@vialta/ui";
import { Badge, BrandLogo, formatMoney, formatDate } from "@vialta/ui";

export interface DocMeta {
  label: string;
  value: string;
}

export interface DocLine {
  description: string;
  detail?: string;
  amount: number;
}

/** Documento profesional imprimible (factura, recibo, voucher, itinerario…). */
export function PrintableDoc({
  title,
  code,
  statusLabel,
  statusTone = "neutral",
  customerName,
  customerEmail,
  customerPhone,
  meta,
  lines,
  amount,
  amountLabel = "Total",
  currency = "BOB",
  notes,
}: {
  title: string;
  code: string;
  statusLabel?: string;
  statusTone?: BadgeTone;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  meta: DocMeta[];
  lines?: DocLine[];
  amount?: number;
  amountLabel?: string;
  currency?: string;
  notes?: string;
}) {
  return (
    <div className="print-area paper-doc">
      <div className="flex items-start justify-between gap-4">
        <BrandLogo size={44} tagline="Agencia de viajes" />
        <div className="text-right">
          <p className="font-[family-name:var(--font-display)] text-xl font-bold uppercase tracking-tight">{title}</p>
          <p className="text-sm font-medium tabular-nums">{code}</p>
          {statusLabel && <Badge tone={statusTone} className="mt-1">{statusLabel}</Badge>}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Cliente</p>
          <p className="font-semibold">{customerName}</p>
          {customerEmail && <p className="text-sm text-muted-foreground">{customerEmail}</p>}
          {customerPhone && <p className="text-sm text-muted-foreground">{customerPhone}</p>}
        </div>
        <div className="space-y-0.5 sm:text-right">
          {meta.map((m) => (
            <p key={m.label} className="text-sm">
              <span className="text-muted-foreground">{m.label}: </span>
              {m.value}
            </p>
          ))}
        </div>
      </div>

      {lines && lines.length > 0 && (
        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-2 font-medium">Concepto</th>
              <th className="py-2 pl-2 text-right font-medium">Importe</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-border align-top">
                <td className="py-2.5 pr-2">
                  <p className="font-medium">{l.description}</p>
                  {l.detail && <p className="text-xs text-muted-foreground">{l.detail}</p>}
                </td>
                <td className="py-2.5 pl-2 text-right tabular-nums">{formatMoney(l.amount, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {typeof amount === "number" && (
        <div className="mt-4 flex justify-end">
          <div className="flex w-full max-w-xs items-center justify-between border-t border-border pt-3 text-base font-bold">
            <span>{amountLabel}</span>
            <span className="tabular-nums">{formatMoney(amount, currency)}</span>
          </div>
        </div>
      )}

      {notes && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Notas</p>
          <p className="mt-1 text-sm text-muted-foreground">{notes}</p>
        </div>
      )}

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        FlyAlways · Agencia de viajes · Santa Cruz, Bolivia · Documento generado el {formatDate(new Date().toISOString())}
      </p>
    </div>
  );
}
