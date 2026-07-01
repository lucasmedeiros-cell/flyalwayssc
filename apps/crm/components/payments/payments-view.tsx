"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Wallet, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import type { PaymentDetail, PaymentMethod, PaymentStatus, DocumentKind } from "@vialta/types";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, DOCUMENT_KIND_LABEL, paymentBalance, paymentStatusFor } from "@vialta/types";
import { Badge, Button, DataTable, type Column, Tabs, Input, cn, formatMoney, formatInt } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { PAYMENT_STATUS_TONE, PAYMENT_METHOD_ICON } from "./payment-utils";
import { PaymentForm } from "./payment-form";
import { PaymentDetailModal } from "./payment-detail-modal";
import { DocumentModal } from "@/components/documents/document-modal";
import { PrintableDoc, type DocMeta } from "@/components/common/printable-doc";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "pending", label: "Pendientes" },
  { key: "partial", label: "Parciales" },
  { key: "paid", label: "Pagados" },
  { key: "refunded", label: "Reembolsados" },
];

const DOC_PREFIX: Partial<Record<DocumentKind, string>> = { receipt: "REC", invoice: "FAC", credit_note: "NC" };

export function PaymentsView({ initialPayments }: { initialPayments: PaymentDetail[] }) {
  const { can } = useAuth();
  const canManage = can("payments.manage");
  const [payments, setPayments] = useState<PaymentDetail[]>(initialPayments);
  const [search, setSearch] = useState("");
  const requestedFilter = useSearchParams().get("filter");
  const validFilters = [...FILTERS.map((f) => f.key), "overdue", "with_balance"];
  const [filter, setFilter] = useState(requestedFilter && validFilters.includes(requestedFilter) ? requestedFilter : "all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [docFor, setDocFor] = useState<{ payment: PaymentDetail; kind: DocumentKind } | null>(null);

  const today = "2026-06-30";

  const stats = useMemo(() => {
    const collected = payments.reduce((a, p) => (p.status === "refunded" ? a : a + Math.max(0, p.paid.amount)), 0);
    const pending = payments.reduce((a, p) => a + paymentBalance(p), 0);
    const overdue = payments.filter((p) => paymentBalance(p) > 0 && p.dueDate && p.dueDate < today).length;
    return { collected, pending, count: payments.length, overdue };
  }, [payments]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      // Pseudo-filtros usados por las tarjetas: "with_balance" (saldo>0) y "overdue" (vencidos).
      if (filter === "overdue") {
        if (!(paymentBalance(p) > 0 && p.dueDate && p.dueDate < today)) return false;
      } else if (filter === "with_balance") {
        if (!(paymentBalance(p) > 0)) return false;
      } else if (filter !== "all" && p.status !== (filter as PaymentStatus)) {
        return false;
      }
      if (!q) return true;
      return p.code.toLowerCase().includes(q) || p.customerName.toLowerCase().includes(q) || (p.relatedCode ?? "").toLowerCase().includes(q);
    });
  }, [payments, search, filter]);

  const selected = payments.find((p) => p.id === selectedId) ?? null;
  const nextCode = `PG-${payments.reduce((m, p) => {
    const n = Number(p.code.replace(/\D/g, ""));
    return Number.isFinite(n) && n > m ? n : m;
  }, 3047) + 1}`;

  function registerInstallment(amount: number, method: PaymentMethod) {
    if (!selected) return;
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id !== selected.id) return p;
        const newPaid = p.paid.amount + amount;
        return {
          ...p,
          paid: { ...p.paid, amount: newPaid },
          status: paymentStatusFor(p.total.amount, newPaid),
          transactions: [...p.transactions, { id: `x-${Date.now()}`, at: new Date().toISOString(), method, amount: { amount, currency: p.total.currency } }],
        };
      })
    );
  }

  const columns: Column<PaymentDetail>[] = [
    {
      key: "code",
      header: "Pago",
      width: "1.3fr",
      cell: (p) => (
        <span className="min-w-0">
          <span className="block font-medium tabular-nums">{p.code}</span>
          <span className="block truncate text-xs text-muted-foreground">{p.customerName}</span>
        </span>
      ),
    },
    {
      key: "method",
      header: "Método",
      width: "auto",
      hideOnMobile: true,
      cell: (p) => {
        const Icon = PAYMENT_METHOD_ICON[p.method];
        return (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" /> {PAYMENT_METHOD_LABEL[p.method]}
          </span>
        );
      },
    },
    { key: "total", header: "Total", width: "1fr", align: "right", cell: (p) => <span className="tabular-nums">{formatMoney(p.total.amount, p.total.currency)}</span> },
    { key: "paid", header: "Pagado", width: "1fr", align: "right", hideOnMobile: true, cell: (p) => <span className="tabular-nums text-success">{formatMoney(p.paid.amount, p.paid.currency)}</span> },
    { key: "balance", header: "Saldo", width: "1fr", align: "right", cell: (p) => { const b = paymentBalance(p); return <span className={cn("font-medium tabular-nums", b > 0 ? "text-warning" : "text-muted-foreground")}>{formatMoney(b, p.total.currency)}</span>; } },
    { key: "status", header: "Estado", width: "auto", align: "right", cell: (p) => <Badge tone={PAYMENT_STATUS_TONE[p.status]}>{PAYMENT_STATUS_LABEL[p.status]}</Badge> },
  ];

  const statCards = [
    { label: "Cobrado", value: formatMoney(stats.collected, "BOB"), icon: TrendingUp, tone: "bg-success/14 text-success", filter: "paid" },
    { label: "Por cobrar", value: formatMoney(stats.pending, "BOB"), icon: Clock, tone: "bg-warning/16 text-warning", filter: "with_balance" },
    { label: "Pagos", value: formatInt(stats.count), icon: Wallet, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Vencidos", value: formatInt(stats.overdue), icon: AlertTriangle, tone: "bg-danger/14 text-danger", filter: "overdue" },
  ];

  // Documento generado a partir de un pago
  const doc = docFor;
  const docMeta: DocMeta[] = doc
    ? [
        { label: "Emisión", value: today },
        { label: "Ref. pago", value: doc.payment.code },
        { label: "Método", value: PAYMENT_METHOD_LABEL[doc.payment.method] },
        { label: "Agente", value: doc.payment.agentName },
      ]
    : [];
  const docAmount = doc ? (doc.kind === "invoice" ? doc.payment.total.amount : doc.payment.paid.amount) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Pagos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Control financiero, saldos y comprobantes</p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo pago
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setFilter(s.filter)}
            aria-pressed={filter === s.filter}
            title={`Filtrar: ${s.label}`}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-surface p-4 text-left shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              filter === s.filter ? "border-primary/60 ring-2 ring-primary/30" : "border-border",
            )}
          >
            <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", s.tone)}>
              <s.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold tabular-nums leading-none">{s.value}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <Input icon={Search} placeholder="Buscar por código, cliente o relacionado…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto pb-1">
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="payments-filter" />
        </div>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} rows={rows} keyOf={(p) => p.id} onRowClick={(p) => setSelectedId(p.id)} empty="No se encontraron pagos." />
      </div>

      {canManage && (
        <PaymentForm open={formOpen} onClose={() => setFormOpen(false)} onCreate={(p) => setPayments((prev) => [p, ...prev])} nextCode={nextCode} />
      )}

      <PaymentDetailModal
        payment={selected}
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        onRegister={registerInstallment}
        onGenerate={(kind) => { if (selected) { setDocFor({ payment: selected, kind }); setSelectedId(null); } }}
        canManage={canManage}
      />

      {doc && (
        <DocumentModal
          open={docFor !== null}
          onClose={() => setDocFor(null)}
          subject={`${DOCUMENT_KIND_LABEL[doc.kind]} ${doc.payment.code} · FlyAlways`}
          message={`Adjuntamos ${DOCUMENT_KIND_LABEL[doc.kind].toLowerCase()} del pago ${doc.payment.code}.`}
        >
          <PrintableDoc
            title={DOCUMENT_KIND_LABEL[doc.kind]}
            code={`${DOC_PREFIX[doc.kind] ?? "DOC"}-${doc.payment.code.replace(/\D/g, "")}`}
            customerName={doc.payment.customerName}
            meta={docMeta}
            lines={[{ description: doc.payment.concept, detail: doc.payment.relatedCode ? `Ref. ${doc.payment.relatedCode}` : undefined, amount: docAmount }]}
            amount={docAmount}
            amountLabel={doc.kind === "invoice" ? "Total" : "Monto recibido"}
            currency={doc.payment.total.currency}
          />
        </DocumentModal>
      )}
    </div>
  );
}
