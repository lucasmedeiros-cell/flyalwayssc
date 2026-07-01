import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { AutomationsView } from "@/components/automations/automations-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Automatizaciones" };

export default async function AutomatizacionesPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "automations.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Automatizaciones." />;
  }
  const data = await getCrmDataSource().listAutomations();
  return <AutomationsView initial={data} />;
}
