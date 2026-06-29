import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataSource } from "@/lib/services";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = { title: "Reserva" };

export default async function ReservaPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getDataSource().getTrip(decodeURIComponent(tripId));
  if (!trip) notFound();

  const operators = await getDataSource().listOperators(trip.mode);
  const operator = operators.find((o) => o.id === trip.operatorId) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <BookingWizard trip={trip} operator={operator} />
    </div>
  );
}
