import type { Metadata } from "next";
import { getDataSource } from "@/lib/services";
import { AdminDashboardView } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = { title: "Dashboard de administrador" };

export default async function AdminPage() {
  const data = await getDataSource().getAdminDashboard();
  return <AdminDashboardView data={data} />;
}
