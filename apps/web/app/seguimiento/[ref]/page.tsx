import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDataSource } from "@/lib/services";
import { TrackingView } from "@/components/tracking/tracking-view";

export const metadata: Metadata = { title: "Seguimiento del viaje" };

export default async function SeguimientoPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const tracking = await getDataSource().getTripTracking(decodeURIComponent(ref));
  if (!tracking) notFound();

  return <TrackingView tracking={tracking} />;
}
