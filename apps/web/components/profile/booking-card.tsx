"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Navigation, Ticket } from "lucide-react";
import type { BookingRecord } from "@vialta/types";
import { TRANSPORT_MODE_META, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { LogoBadge } from "@/components/ui/logo-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";

const STATUS: Record<BookingRecord["status"], { label: string; tone: "primary" | "success" | "warning" }> = {
  upcoming: { label: "Próximo", tone: "primary" },
  completed: { label: "Completado", tone: "success" },
  cancelled: { label: "Cancelado", tone: "warning" },
};

export function BookingCard({
  record,
  onViewTicket,
}: {
  record: BookingRecord;
  onViewTicket?: (r: BookingRecord) => void;
}) {
  const meta = TRANSPORT_MODE_META[record.mode];
  const status = STATUS[record.status];
  const isCancelled = record.status === "cancelled";

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-md)]",
        isCancelled && "opacity-80"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-4">
          <LogoBadge mark={record.operatorMark} color={record.operatorColor} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{record.operatorName}</p>
              <Badge tone={status.tone}>{status.label}</Badge>
              {record.favorite && <Heart className="h-4 w-4 fill-danger text-danger" />}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {meta.icon} {meta.label} · {TRAVEL_CLASS_LABEL[record.travelClass]} ·{" "}
              {record.reference}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div>
                <p className={cn("text-lg font-semibold tabular-nums", isCancelled && "line-through")}>
                  {formatTime(record.departAt)}
                </p>
                <p className="text-xs text-muted-foreground">{record.originCode}</p>
              </div>
              <div className="flex flex-1 flex-col items-center px-1 text-muted-foreground">
                <span className="text-[11px]">{formatDate(record.departAt)}</span>
                <div className="relative my-1 h-px w-full max-w-32 bg-border">
                  <ArrowRight className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 bg-surface text-primary" />
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-lg font-semibold tabular-nums", isCancelled && "line-through")}>
                  {formatTime(record.arriveAt)}
                </p>
                <p className="text-xs text-muted-foreground">{record.destinationCode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums">
              {formatMoney(record.total.amount, record.total.currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {record.passengers} pas. · {record.seats.join(", ")}
            </p>
          </div>
          <div className="flex gap-2">
            {!isCancelled && (
              <Button size="sm" variant="outline" onClick={() => onViewTicket?.(record)}>
                <Ticket className="h-4 w-4" />
                Ticket
              </Button>
            )}
            {record.status === "upcoming" ? (
              <Link href={`/seguimiento/${encodeURIComponent(record.reference)}`}>
                <Button size="sm">
                  <Navigation className="h-4 w-4" />
                  Seguir
                </Button>
              </Link>
            ) : (
              <Link href={`/buscar?mode=${record.mode}`}>
                <Button size="sm" variant={isCancelled ? "outline" : "ghost"}>
                  Reservar similar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
