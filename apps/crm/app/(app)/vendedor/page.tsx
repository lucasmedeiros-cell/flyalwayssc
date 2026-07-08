import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { VendedorView } from "@/components/vendedor/vendedor-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Vendedor 24/7" };

export default async function VendedorPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "tickets.view")) {
    return <AccessDenied message="No tienes permiso para ver el Vendedor 24/7." />;
  }
  return <VendedorView />;
}
