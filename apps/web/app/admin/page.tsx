import type { Metadata } from "next";
import { getDataSource } from "@/lib/services";
import { AdminDashboardView } from "@/components/admin/admin-dashboard";
import { PromoManager } from "@/components/admin/promo-manager";

export const metadata: Metadata = { title: "Dashboard de administrador" };

export default async function AdminPage() {
  const data = await getDataSource().getAdminDashboard();
  return (
    <>
      <AdminDashboardView data={data} />
      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <PromoManager />
      </div>
    </>
  );
}
