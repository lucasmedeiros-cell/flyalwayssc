"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plane, QrCode, X } from "lucide-react";
import type { BookingRecord } from "@vialta/types";
import { TRANSPORT_MODE_META, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";
import { LogoBadge } from "@/components/ui/logo-badge";

export function TicketModal({
  record,
  onClose,
}: {
  record: BookingRecord | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {record && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-lg)]"
          >
            <Ticket record={record} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Ticket({ record, onClose }: { record: BookingRecord; onClose: () => void }) {
  const meta = TRANSPORT_MODE_META[record.mode];
  return (
    <>
      <div className="relative bg-aurora p-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/70 backdrop-blur hover:bg-surface"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <LogoBadge mark={record.operatorMark} color={record.operatorColor} size={40} />
          <div>
            <p className="font-semibold">{record.operatorName}</p>
            <p className="text-xs text-muted-foreground">
              {meta.icon} {meta.label} · {TRAVEL_CLASS_LABEL[record.travelClass]}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between border-y border-dashed border-border px-5 py-4">
        <span className="absolute -left-3 h-6 w-6 rounded-full bg-background" />
        <span className="absolute -right-3 h-6 w-6 rounded-full bg-background" />
        <div>
          <p className="text-2xl font-bold tabular-nums">{formatTime(record.departAt)}</p>
          <p className="text-xs text-muted-foreground">
            {record.originCity} · {record.originCode}
          </p>
        </div>
        <Plane className="h-5 w-5 rotate-90 text-primary" />
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{formatTime(record.arriveAt)}</p>
          <p className="text-xs text-muted-foreground">
            {record.destinationCity} · {record.destinationCode}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-5 text-sm">
        <Info label="Código" value={record.reference} />
        <Info label="Fecha" value={formatDate(record.departAt)} />
        <Info label="Pasajeros" value={String(record.passengers)} />
        <Info label="Asientos" value={record.seats.join(", ") || "—"} />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border bg-surface-2/40 px-5 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <QrCode className="h-10 w-10" />
          <span className="text-xs">Escanea en el embarque</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
            {formatMoney(record.total.amount, record.total.currency)}
          </p>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold">{value}</p>
    </div>
  );
}
