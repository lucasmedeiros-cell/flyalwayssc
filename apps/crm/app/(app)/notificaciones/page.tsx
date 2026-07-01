import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { NotificationsView } from "@/components/notifications/notifications-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Notificaciones" };

export default async function NotificacionesPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "notifications.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Notificaciones." />;
  }
  const data = await getCrmDataSource().listNotifications();
  return <NotificationsView initial={data} />;
}
