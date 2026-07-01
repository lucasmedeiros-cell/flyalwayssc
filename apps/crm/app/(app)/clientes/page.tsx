import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { CustomersView } from "@/components/customers/customers-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Clientes" };

export default async function ClientesPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "clients.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Clientes." />;
  }

  const customers = await getCrmDataSource().listCustomers();
  return <CustomersView initialCustomers={customers} />;
}
