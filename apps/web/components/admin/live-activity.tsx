"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ticket, CreditCard, XCircle, UserPlus, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type EventType = "booking" | "payment" | "cancel" | "user" | "company";

interface LiveEvent {
  id: number;
  type: EventType;
  text: string;
  amount?: string;
  age: number; // segundos desde que ocurrió
}

const META: Record<EventType, { icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  booking: { icon: Ticket, tone: "text-primary bg-primary/12" },
  payment: { icon: CreditCard, tone: "text-success bg-success/14" },
  cancel: { icon: XCircle, tone: "text-danger bg-danger/14" },
  user: { icon: UserPlus, tone: "text-accent-strong bg-accent/14 dark:text-accent" },
  company: { icon: Building2, tone: "text-warning bg-warning/16" },
};

const ROUTES = ["Santa Cruz → La Paz", "La Paz → Cochabamba", "Oruro → Uyuni", "Cochabamba → Santa Cruz", "Santa Cruz → Miami"];
const AMOUNTS = ["Bs 168,90", "Bs 219,90", "Bs 410,00", "Bs 79,00", "Bs 130,00", "Bs 205,00"];

const SEED: LiveEvent[] = [
  { id: 1, type: "booking", text: "Reserva Santa Cruz → La Paz", amount: "Bs 219,90", age: 6 },
  { id: 2, type: "user", text: "Nuevo usuario registrado", age: 23 },
  { id: 3, type: "payment", text: "Pago confirmado", amount: "Bs 410,00", age: 48 },
  { id: 4, type: "company", text: "Boliviana de Aviación actualizó tarifas", age: 95 },
];

function ageLabel(age: number): string {
  if (age < 5) return "ahora";
  if (age < 60) return `hace ${age}s`;
  return `hace ${Math.floor(age / 60)} min`;
}

/** Construye un evento aleatorio (sólo se invoca en cliente, tras montar). */
function makeEvent(id: number): LiveEvent {
  const r = Math.random();
  const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
  const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
  if (r < 0.45) return { id, type: "booking", text: `Reserva ${route}`, amount, age: 0 };
  if (r < 0.7) return { id, type: "payment", text: "Pago confirmado", amount, age: 0 };
  if (r < 0.82) return { id, type: "cancel", text: `Cancelación ${route}`, age: 0 };
  if (r < 0.93) return { id, type: "user", text: "Nuevo usuario registrado", age: 0 };
  return { id, type: "company", text: "Empresa afiliada actualizó precios", age: 0 };
}

export function LiveActivity() {
  const [events, setEvents] = useState<LiveEvent[]>(SEED);

  useEffect(() => {
    let nextId = SEED.length + 1;
    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      setEvents((prev) => {
        const aged = prev.map((e) => ({ ...e, age: e.age + 1 }));
        if (tick % 3 === 0) {
          return [makeEvent(nextId++), ...aged].slice(0, 7);
        }
        return aged;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Actividad en tiempo real</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          En vivo
        </span>
      </div>

      <ul className="space-y-1">
        <AnimatePresence initial={false}>
          {events.map((e) => {
            const meta = META[e.type];
            return (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 py-2"
              >
                <span className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", meta.tone)}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.text}</p>
                  <p className="text-xs text-muted-foreground">{ageLabel(e.age)}</p>
                </div>
                {e.amount && <span className="text-sm font-semibold tabular-nums">{e.amount}</span>}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
