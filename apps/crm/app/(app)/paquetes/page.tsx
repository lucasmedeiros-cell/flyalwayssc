import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { PackagesView } from "@/components/packages/packages-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Paquetes" };

export default async function PaquetesPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "packages.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Paquetes." />;
  }
  const packages = await getCrmDataSource().listPackages();
  return <PackagesView initialPackages={packages} />;
}
