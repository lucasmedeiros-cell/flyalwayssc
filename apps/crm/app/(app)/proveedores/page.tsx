import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { ProvidersView } from "@/components/providers/providers-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Proveedores" };

export default async function ProveedoresPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "providers.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Proveedores." />;
  }
  const providers = await getCrmDataSource().listProviders();
  return <ProvidersView initialProviders={providers} />;
}
