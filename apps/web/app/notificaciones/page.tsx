import type { Metadata } from "next";
import { getDataSource } from "@/lib/services";
import { NotificationsView } from "@/components/notifications/notifications-view";

export const metadata: Metadata = { title: "Notificaciones" };

export default async function NotificacionesPage() {
  const ds = getDataSource();
  const [notifications, prefs] = await Promise.all([
    ds.getNotifications(),
    ds.getNotificationPreferences(),
  ]);
  return <NotificationsView initialNotifications={notifications} initialPrefs={prefs} />;
}
