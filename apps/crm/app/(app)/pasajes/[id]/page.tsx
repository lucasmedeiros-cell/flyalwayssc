import { notFound } from "next/navigation";
import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { TicketDetailView } from "@/components/tickets/ticket-detail";
import { AccessDenied } from "@/components/common/access-denied";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getCrmDataSource().getTicket(id);
  return { title: ticket ? ticket.code : "Pasaje" };
}

export default async function PasajeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "tickets.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Pasajes." />;
  }

  const { id } = await params;
  const ticket = await getCrmDataSource().getTicket(id);
  if (!ticket) notFound();

  return <TicketDetailView ticket={ticket} />;
}
