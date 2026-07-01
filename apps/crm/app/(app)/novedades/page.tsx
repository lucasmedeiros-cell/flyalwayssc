import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import { NovedadesView } from "@/components/novedades/novedades-view";

export const metadata = { title: "Novedades" };

export default async function NovedadesPage() {
  const user = await getServerUser();
  if (!user) redirect("/login");
  return <NovedadesView />;
}
