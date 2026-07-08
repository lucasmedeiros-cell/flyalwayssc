import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { SettingsView } from "@/components/settings/settings-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Ajustes" };

export default async function AjustesPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "settings.view")) {
    return <AccessDenied message="Solo administración y supervisión pueden acceder a Ajustes." />;
  }

  const ds = getCrmDataSource();
  const [data, automations] = await Promise.all([ds.getSettings(), ds.listAutomations()]);
  return <SettingsView data={data} automations={automations} />;
}
