import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { PaymentsView } from "@/components/payments/payments-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Pagos" };

export default async function PagosPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "payments.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Pagos." />;
  }

  const payments = await getCrmDataSource().listPayments();
  return <PaymentsView initialPayments={payments} />;
}
