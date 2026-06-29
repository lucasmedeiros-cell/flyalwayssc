"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Operator, SeatMapLayout, Trip } from "@vialta/types";
import { BOOKING_STEPS } from "@vialta/types";
import {
  type BookingDraft,
  bookingReference,
  computeQuote,
  initialDraft,
  totalPassengers,
} from "@/lib/booking/config";
import { getDataSource } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Stepper } from "./stepper";
import { BookingSummary } from "./booking-summary";
import { StepTrip } from "./steps/step-trip";
import { StepSeat } from "./steps/step-seat";
import { StepPassenger } from "./steps/step-passenger";
import { StepBaggage } from "./steps/step-baggage";
import { StepExtras } from "./steps/step-extras";
import { StepPayment } from "./steps/step-payment";
import { StepConfirmation } from "./steps/step-confirmation";

export function BookingWizard({ trip, operator }: { trip: Trip; operator: Operator | null }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  const [seatMap, setSeatMap] = useState<SeatMapLayout | null>(null);

  useEffect(() => {
    let active = true;
    getDataSource()
      .getSeatMap(trip.id)
      .then((m) => active && setSeatMap(m));
    return () => {
      active = false;
    };
  }, [trip.id]);

  const quote = useMemo(() => computeQuote(trip, draft, seatMap), [trip, draft, seatMap]);
  const reference = useMemo(
    () => bookingReference(`${trip.id}|${draft.passengers[0]?.documentNumber ?? ""}`),
    [trip.id, draft.passengers]
  );

  const pax = totalPassengers(draft);
  const isLast = step === BOOKING_STEPS.length - 1;
  const isPayment = BOOKING_STEPS[step].key === "payment";

  const valid = isStepValid(step, draft, pax);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/buscar"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a resultados
        </Link>
        <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-muted-foreground">
          Reserva {reference}
        </span>
      </div>

      <Stepper current={step} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* Contenido del paso */}
        <div className="min-h-[360px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && <StepTrip trip={trip} operator={operator} draft={draft} onChange={setDraft} />}
              {step === 1 && (
                <StepSeat trip={trip} seatMap={seatMap} draft={draft} onChange={setDraft} />
              )}
              {step === 2 && <StepPassenger draft={draft} onChange={setDraft} />}
              {step === 3 && <StepBaggage trip={trip} draft={draft} onChange={setDraft} />}
              {step === 4 && <StepExtras trip={trip} draft={draft} onChange={setDraft} />}
              {step === 5 && <StepPayment draft={draft} onChange={setDraft} quote={quote} />}
              {step === 6 && (
                <StepConfirmation
                  trip={trip}
                  operator={operator}
                  draft={draft}
                  reference={reference}
                  quote={quote}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navegación */}
          {!isLast && (
            <div className="mt-8 flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={() => go(Math.max(0, step - 1))}
                disabled={step === 0}
                className={step === 0 ? "invisible" : ""}
              >
                <ArrowLeft className="h-4 w-4" />
                Atrás
              </Button>
              <Button onClick={() => go(step + 1)} disabled={!valid} size="lg">
                {isPayment ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Pagar {quote.currency} {quote.total.toFixed(2)}
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {!valid && step === 1 && (
            <p className="mt-3 text-right text-xs text-muted-foreground">
              Selecciona {pax} asiento{pax > 1 ? "s" : ""} para continuar.
            </p>
          )}

          {isPayment && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5 shrink-0 text-success" />
              Pago 100% seguro con cifrado SSL · Tus datos están protegidos y nunca se comparten
            </p>
          )}
        </div>

        {/* Resumen */}
        {!isLast && (
          <aside>
            <div className="sticky top-24">
              <BookingSummary trip={trip} operator={operator} quote={quote} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function isStepValid(step: number, draft: BookingDraft, pax: number): boolean {
  switch (BOOKING_STEPS[step].key) {
    case "seat":
      return draft.seatIds.length === pax;
    case "passenger":
      return draft.passengers
        .slice(0, pax)
        .every((p) => p.firstName.trim() && p.lastName.trim() && p.documentNumber.trim());
    case "payment": {
      const p = draft.payment;
      if (p.method !== "card") return true;
      return (
        p.cardName.trim().length > 2 &&
        p.cardNumber.replace(/\s/g, "").length >= 12 &&
        p.cardExp.trim().length >= 4 &&
        p.cardCvc.trim().length >= 3
      );
    }
    default:
      return true;
  }
}
