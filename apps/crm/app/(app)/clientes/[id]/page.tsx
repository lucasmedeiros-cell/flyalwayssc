import { notFound } from "next/navigation";
import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { CustomerProfile } from "@/components/customers/customer-profile";
import { AccessDenied } from "@/components/common/access-denied";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCrmDataSource().getCustomer(id);
  return { title: customer ? `${customer.firstName} ${customer.lastName}` : "Cliente" };
}

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "clients.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Clientes." />;
  }

  const { id } = await params;
  const customer = await getCrmDataSource().getCustomer(id);
  if (!customer) notFound();

  return <CustomerProfile customer={customer} />;
}
