import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { ReportsView } from "@/components/reports/reports-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Reportes" };

export default async function ReportesPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "reports.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Reportes." />;
  }
  const reports = await getCrmDataSource().getReports();
  return <ReportsView reports={reports} />;
}
