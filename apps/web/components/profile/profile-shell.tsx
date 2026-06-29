"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarClock,
  History,
  XCircle,
  Heart,
  FileText,
  CreditCard,
  Inbox,
  Search,
} from "lucide-react";
import type { Account, BookingRecord } from "@vialta/types";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProfileHeader } from "./profile-header";
import { BookingCard } from "./booking-card";
import { TicketModal } from "./ticket-modal";
import { InvoicesSection } from "./invoices-section";
import { PaymentMethodsSection } from "./payment-methods-section";
import { FavoritesSection } from "./favorites-section";
import { Button } from "@/components/ui/button";

type Tab = "upcoming" | "history" | "cancelled" | "favorites" | "invoices" | "payments";

const NAV: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "upcoming", label: "Próximos viajes", icon: CalendarClock },
  { key: "history", label: "Historial", icon: History },
  { key: "cancelled", label: "Cancelaciones", icon: XCircle },
  { key: "favorites", label: "Favoritos", icon: Heart },
  { key: "invoices", label: "Facturas", icon: FileText },
  { key: "payments", label: "Métodos de pago", icon: CreditCard },
];

export function ProfileShell({ account }: { account: Account }) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [ticket, setTicket] = useState<BookingRecord | null>(null);

  const upcoming = account.bookings.filter((b) => b.status === "upcoming");
  const completed = account.bookings.filter((b) => b.status === "completed");
  const cancelled = account.bookings.filter((b) => b.status === "cancelled");

  const counts: Partial<Record<Tab, number>> = {
    upcoming: upcoming.length,
    history: completed.length,
    cancelled: cancelled.length,
    favorites: account.favorites.length,
    invoices: account.invoices.length,
    payments: account.paymentMethods.length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileHeader account={account} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Navegación */}
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {NAV.map((item) => {
              const active = tab === item.key;
              return (
                <li key={item.key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={cn(
                      "flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/12 text-primary"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {counts[item.key] != null && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          active ? "bg-primary/20 text-primary" : "bg-surface-2 text-muted-foreground"
                        )}
                      >
                        {counts[item.key]}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Contenido */}
        <div className="min-h-[320px]">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "upcoming" && <BookingList items={upcoming} onViewTicket={setTicket} emptyLabel="No tienes viajes próximos." emptyCta />}
            {tab === "history" && <BookingList items={completed} onViewTicket={setTicket} emptyLabel="Aún no tienes viajes completados." />}
            {tab === "cancelled" && <BookingList items={cancelled} onViewTicket={setTicket} emptyLabel="No tienes cancelaciones." />}
            {tab === "favorites" && <FavoritesSection favorites={account.favorites} />}
            {tab === "invoices" && <InvoicesSection invoices={account.invoices} />}
            {tab === "payments" && <PaymentMethodsSection methods={account.paymentMethods} />}
          </motion.div>
        </div>
      </div>

      <TicketModal record={ticket} onClose={() => setTicket(null)} />
    </div>
  );
}

function BookingList({
  items,
  onViewTicket,
  emptyLabel,
  emptyCta,
}: {
  items: BookingRecord[];
  onViewTicket: (r: BookingRecord) => void;
  emptyLabel: string;
  emptyCta?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-muted-foreground">
          <Inbox className="h-6 w-6" />
        </span>
        <p className="mt-4 font-semibold">{emptyLabel}</p>
        {emptyCta && (
          <Link href="/buscar" className="mt-4">
            <Button>
              <Search className="h-4 w-4" />
              Buscar un viaje
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
      {items.map((r) => (
        <BookingCard key={r.id} record={r} onViewTicket={onViewTicket} />
      ))}
    </motion.div>
  );
}
