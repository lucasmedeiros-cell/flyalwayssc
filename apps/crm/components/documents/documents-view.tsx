"use client";

import { useMemo, useState } from "react";
import { Search, Plus, FileText } from "lucide-react";
import type { GeneratedDocument, DocumentKind } from "@vialta/types";
import { DOCUMENT_KIND_LABEL, DOCUMENT_STATUS_LABEL } from "@vialta/types";
import { Badge, Button, DataTable, type Column, Tabs, Input, cn, formatMoney, formatDate, formatInt } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { DOC_KIND_TONE, DOC_KIND_ICON } from "./document-utils";
import { DocumentForm } from "./document-form";
import { DocumentModal } from "./document-modal";
import { PrintableDoc, type DocMeta } from "@/components/common/printable-doc";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "invoice", label: "Facturas" },
  { key: "receipt", label: "Recibos" },
  { key: "voucher", label: "Vouchers" },
  { key: "itinerary", label: "Itinerarios" },
  { key: "confirmation", label: "Confirmaciones" },
  { key: "contract", label: "Contratos" },
  { key: "credit_note", label: "Notas de crédito" },
];

export function DocumentsView({ initialDocuments }: { initialDocuments: GeneratedDocument[] }) {
  const { can } = useAuth();
  const canManage = can("documents.manage");
  const [docs, setDocs] = useState<GeneratedDocument[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [preview, setPreview] = useState<GeneratedDocument | null>(null);

  const stats = useMemo(() => {
    const invoices = docs.filter((d) => d.kind === "invoice").length;
    const receipts = docs.filter((d) => d.kind === "receipt").length;
    const others = docs.length - invoices - receipts;
    return { total: docs.length, invoices, receipts, others };
  }, [docs]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter((d) => {
      // "others" (tarjeta "Otros") = todo lo que no sea factura ni recibo.
      if (filter === "others") {
        if (d.kind === "invoice" || d.kind === "receipt") return false;
      } else if (filter !== "all" && d.kind !== (filter as DocumentKind)) {
        return false;
      }
      if (!q) return true;
      return d.code.toLowerCase().includes(q) || d.customerName.toLowerCase().includes(q) || (d.relatedCode ?? "").toLowerCase().includes(q);
    });
  }, [docs, search, filter]);

  const columns: Column<GeneratedDocument>[] = [
    {
      key: "code",
      header: "Documento",
      width: "1.3fr",
      cell: (d) => {
        const Icon = DOC_KIND_ICON[d.kind];
        return (
          <span className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-medium tabular-nums">{d.code}</span>
              <span className="block truncate text-xs text-muted-foreground">{d.customerName}</span>
            </span>
          </span>
        );
      },
    },
    { key: "kind", header: "Tipo", width: "auto", cell: (d) => <Badge tone={DOC_KIND_TONE[d.kind]}>{DOCUMENT_KIND_LABEL[d.kind]}</Badge> },
    { key: "related", header: "Relacionado", width: "1fr", hideOnMobile: true, cell: (d) => <span className="text-sm tabular-nums text-muted-foreground">{d.relatedCode ?? "—"}</span> },
    { key: "date", header: "Emisión", width: "auto", hideOnMobile: true, cell: (d) => <span className="text-sm text-muted-foreground">{formatDate(d.issuedAt)}</span> },
    { key: "amount", header: "Monto", width: "1fr", align: "right", cell: (d) => <span className="font-medium tabular-nums">{d.amount ? formatMoney(d.amount.amount, d.amount.currency) : "—"}</span> },
    { key: "status", header: "Estado", width: "auto", align: "right", cell: (d) => <Badge tone={d.status === "issued" ? "success" : "neutral"}>{DOCUMENT_STATUS_LABEL[d.status]}</Badge> },
  ];

  const statCards = [
    { label: "Documentos", value: stats.total, icon: FileText, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Facturas", value: stats.invoices, icon: DOC_KIND_ICON.invoice, tone: "bg-primary/12 text-primary", filter: "invoice" },
    { label: "Recibos", value: stats.receipts, icon: DOC_KIND_ICON.receipt, tone: "bg-success/14 text-success", filter: "receipt" },
    { label: "Otros", value: stats.others, icon: DOC_KIND_ICON.voucher, tone: "bg-accent/14 text-accent-strong dark:text-accent", filter: "others" },
  ];

  const previewMeta: DocMeta[] = preview
    ? [
        { label: "Emisión", value: formatDate(preview.issuedAt) },
        { label: "Relacionado", value: preview.relatedCode ?? "—" },
        { label: "Agente", value: preview.agentName },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Documentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Facturas, recibos, vouchers, itinerarios, confirmaciones y contratos</p>
        </div>
        {canManage && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Generar documento
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
              <span className="block text-lg font-bold tabular-nums leading-none">{formatInt(s.value)}</span>
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
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="docs-filter" />
        </div>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} rows={rows} keyOf={(d) => d.id} onRowClick={(d) => setPreview(d)} empty="No se encontraron documentos." />
      </div>

      {canManage && (
        <DocumentForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onCreate={(d) => { setDocs((prev) => [d, ...prev]); setPreview(d); }}
          seq={docs.length + 1}
        />
      )}

      {preview && (
        <DocumentModal
          open={preview !== null}
          onClose={() => setPreview(null)}
          email={preview.customerEmail}
          phone={preview.customerPhone}
          subject={`${DOCUMENT_KIND_LABEL[preview.kind]} ${preview.code} · FlyAlways`}
          message={`Adjuntamos ${DOCUMENT_KIND_LABEL[preview.kind].toLowerCase()} ${preview.code}.`}
        >
          <PrintableDoc
            title={DOCUMENT_KIND_LABEL[preview.kind]}
            code={preview.code}
            statusLabel={DOCUMENT_STATUS_LABEL[preview.status]}
            statusTone={preview.status === "issued" ? "success" : "neutral"}
            customerName={preview.customerName}
            customerEmail={preview.customerEmail}
            customerPhone={preview.customerPhone}
            meta={previewMeta}
            lines={[{ description: preview.concept, detail: preview.relatedCode ? `Ref. ${preview.relatedCode}` : undefined, amount: preview.amount?.amount ?? 0 }]}
            amount={preview.amount?.amount}
            currency={preview.amount?.currency ?? "BOB"}
          />
        </DocumentModal>
      )}
    </div>
  );
}
