import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
  // Verifica sesión antes de pedir datos (evita un fetch 401 cuando no hay
  // sesión; el layout también redirige, pero la página corre en paralelo).
  const user = await getServerUser();
  if (!user) redirect("/login");

  const data = await getCrmDataSource().getDashboard();
  return <DashboardView data={data} />;
}
