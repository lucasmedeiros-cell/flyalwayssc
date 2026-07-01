"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CrmCalendarEvent, CrmEventKind } from "@vialta/types";
import { CRM_EVENT_LABEL } from "@vialta/types";
import { Button, cn } from "@vialta/ui";

const TODAY = "2026-06-30";
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

const KIND_DOT: Record<CrmEventKind, string> = {
  departure: "bg-primary",
  flight: "bg-primary",
  meeting: "bg-accent",
  follow_up: "bg-warning",
  payment: "bg-danger",
  birthday: "bg-success",
  passport_renewal: "bg-warning",
  reminder: "bg-muted-foreground",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CalendarView({ events }: { events: CrmCalendarEvent[] }) {
  // Mes inicial: el de "hoy" (junio 2026).
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5); // 0-indexed → junio

  const byDate = useMemo(() => {
    const map = new Map<string, CrmCalendarEvent[]>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [events]);

  // Construye la grilla (semanas empezando en lunes).
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // lunes = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: { date: string | null; day: number }[] = [];
    for (let i = 0; i < startOffset; i++) out.push({ date: null, day: 0 });
    for (let d = 1; d <= daysInMonth; d++) out.push({ date: `${year}-${pad(month + 1)}-${pad(d)}`, day: d });
    while (out.length % 7 !== 0) out.push({ date: null, day: 0 });
    return out;
  }, [year, month]);

  const monthEvents = useMemo(
    () => events.filter((e) => e.date.startsWith(`${year}-${pad(month + 1)}`)).sort((a, b) => (a.date < b.date ? -1 : 1)),
    [events, year, month]
  );

  function shift(delta: number) {
    const m = month + delta;
    if (m < 0) { setMonth(11); setYear((y) => y - 1); }
    else if (m > 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth(m);
  }

  function goToday() {
    setYear(2026);
    setMonth(5);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">Calendario</h1>
          <p className="mt-1 text-sm text-muted-foreground">Salidas, vuelos, reuniones, seguimientos, pagos y recordatorios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>Hoy</Button>
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
            <button type="button" aria-label="Mes anterior" onClick={() => shift(-1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-2">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[140px] text-center text-sm font-semibold capitalize">{MONTHS[month]} {year}</span>
            <button type="button" aria-label="Mes siguiente" onClick={() => shift(1)} className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-2">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Grilla mensual */}
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]">
          <div className="grid grid-cols-7 border-b border-border bg-surface-2/50 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-2">{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((c, i) => {
              const dayEvents = c.date ? byDate.get(c.date) ?? [] : [];
              const isToday = c.date === TODAY;
              return (
                <div key={i} className={cn("min-h-[92px] border-b border-r border-border p-1.5 [&:nth-child(7n)]:border-r-0", !c.date && "bg-surface-2/30")}>
                  {c.date && (
                    <>
                      <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs tabular-nums", isToday ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground")}>
                        {c.day}
                      </span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 3).map((e) => (
                          <div key={e.id} className="flex items-center gap-1 truncate rounded-md bg-surface-2/70 px-1.5 py-0.5 text-[11px]" title={e.title}>
                            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", KIND_DOT[e.kind])} />
                            <span className="truncate">{e.time ? `${e.time} ` : ""}{e.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 3 && <p className="px-1.5 text-[10px] text-muted-foreground">+{dayEvents.length - 3} más</p>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista del mes */}
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
          <h3 className="font-semibold capitalize">Eventos · {MONTHS[month]}</h3>
          {monthEvents.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Sin eventos este mes.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {monthEvents.map((e) => (
                <li key={e.id} className="flex items-start gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl bg-surface-2 leading-none">
                    <span className="text-sm font-bold tabular-nums">{e.date.slice(8)}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span className={cn("h-1.5 w-1.5 rounded-full", KIND_DOT[e.kind])} />
                        {CRM_EVENT_LABEL[e.kind]}
                      </span>
                      {e.time ? ` · ${e.time}` : ""}
                      {e.customerName ? ` · ${e.customerName}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
