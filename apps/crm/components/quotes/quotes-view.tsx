"use client";

import { useMemo, useState } from "react";
import { Search, Plus, FileText, Send, CheckCircle2, ArrowRightLeft } from "lucide-react";
import type { Quote, QuoteStatus } from "@vialta/types";
import { QUOTE_STATUS_LABEL, quoteTotal } from "@vialta/types";
import { Badge, Button, DataTable, type Column, Tabs, Input, cn, formatMoney, formatDate, formatInt } from "@vialta/ui";
import { useAuth } from "@/components/auth/auth-provider";
import { QUOTE_STATUS_TONE } from "./quote-utils";
import { QuoteBuilder } from "./quote-builder";
import { QuotePreview } from "./quote-preview";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "draft", label: "Borradores" },
  { key: "sent", label: "Enviadas" },
  { key: "accepted", label: "Aceptadas" },
  { key: "converted", label: "Convertidas" },
];

export function QuotesView({ initialQuotes }: { initialQuotes: Quote[] }) {
  const { can } = useAuth();
  const canManage = can("quotes.manage");
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [preview, setPreview] = useState<Quote | null>(null);

  const stats = useMemo(() => {
    const sent = quotes.filter((q) => q.status === "sent").length;
    const accepted = quotes.filter((q) => q.status === "accepted").length;
    const converted = quotes.filter((q) => q.status === "converted").length;
    const pipeline = quotes.filter((q) => !["rejected", "expired"].includes(q.status)).reduce((a, q) => a + quoteTotal(q), 0);
    return { total: quotes.length, sent, accepted, converted, pipeline };
  }, [quotes]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return quotes.filter((q) => {
      if (filter !== "all" && q.status !== (filter as QuoteStatus)) return false;
      if (!term) return true;
      return q.code.toLowerCase().includes(term) || q.customerName.toLowerCase().includes(term);
    });
  }, [quotes, search, filter]);

  const nextCode = useMemo(() => {
    const max = quotes.reduce((m, q) => {
      const n = Number(q.code.replace(/\D/g, ""));
      return Number.isFinite(n) && n > m ? n : m;
    }, 1042);
    return `FA-Q${max + 1}`;
  }, [quotes]);

  function duplicate(q: Quote) {
    const copy: Quote = {
      ...q,
      id: `q-${Date.now()}`,
      code: nextCode,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    setQuotes((prev) => [copy, ...prev]);
    setPreview(copy);
  }

  function convert(q: Quote) {
    setQuotes((prev) => prev.map((x) => (x.id === q.id ? { ...x, status: "converted" } : x)));
    setPreview((p) => (p && p.id === q.id ? { ...p, status: "converted" } : p));
  }

  const columns: Column<Quote>[] = [
    {
      key: "code",
      header: "Cotización",
      width: "1.2fr",
      cell: (q) => (
        <span className="min-w-0">
          <span className="block font-medium tabular-nums">{q.code}</span>
          <span className="block truncate text-xs text-muted-foreground">{q.customerName}</span>
        </span>
      ),
    },
    { key: "valid", header: "Válida hasta", width: "1fr", hideOnMobile: true, cell: (q) => <span className="text-sm text-muted-foreground">{formatDate(q.validUntil)}</span> },
    { key: "items", header: "Ítems", width: "auto", align: "right", hideOnMobile: true, cell: (q) => <span className="tabular-nums text-muted-foreground">{q.items.length}</span> },
    { key: "total", header: "Total", width: "1fr", align: "right", cell: (q) => <span className="font-medium tabular-nums">{formatMoney(quoteTotal(q), q.currency)}</span> },
    { key: "status", header: "Estado", width: "auto", align: "right", cell: (q) => <Badge tone={QUOTE_STATUS_TONE[q.status]}>{QUOTE_STATUS_LABEL[q.status]}</Badge> },
  ];

  const statCards = [
    { label: "Cotizaciones", value: formatInt(stats.total), icon: FileText, tone: "bg-primary/12 text-primary", filter: "all" },
    { label: "Enviadas", value: formatInt(stats.sent), icon: Send, tone: "bg-primary/12 text-primary", filter: "sent" },
    { label: "Aceptadas", value: formatInt(stats.accepted), icon: CheckCircle2, tone: "bg-success/14 text-success", filter: "accepted" },
    { label: "Convertidas", value: formatInt(stats.converted), icon: ArrowRightLeft, tone: "bg-accent/14 text-accent-strong dark:text-accent", filter: "converted" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Cotizador</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pipeline en cotizaciones: {formatMoney(stats.pipeline, "BOB")}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setBuilderOpen(true)}>
            <Plus className="h-4 w-4" /> Nueva cotización
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
              <span className="block text-lg font-bold tabular-nums leading-none">{s.value}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{s.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <Input icon={Search} placeholder="Buscar por código o cliente…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto pb-1">
          <Tabs items={FILTERS} value={filter} onChange={setFilter} layoutId="quotes-filter" />
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={rows}
          keyOf={(q) => q.id}
          onRowClick={(q) => setPreview(q)}
          empty="No se encontraron cotizaciones."
        />
      </div>

      {canManage && (
        <QuoteBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} onCreate={(q) => { setQuotes((prev) => [q, ...prev]); setPreview(q); }} nextCode={nextCode} />
      )}
      <QuotePreview
        quote={preview}
        open={preview !== null}
        onClose={() => setPreview(null)}
        onDuplicate={duplicate}
        onConvert={convert}
        canManage={canManage}
      />
    </div>
  );
}
