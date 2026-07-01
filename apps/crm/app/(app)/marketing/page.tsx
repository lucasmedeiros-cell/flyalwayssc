import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { MarketingView } from "@/components/marketing/marketing-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Marketing" };

export default async function MarketingPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "marketing.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Marketing." />;
  }
  const data = await getCrmDataSource().getMarketing();
  return <MarketingView initial={data} />;
}
