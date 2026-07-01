import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { CalendarView } from "@/components/calendar/calendar-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Calendario" };

export default async function CalendarioPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "calendar.view")) {
    return <AccessDenied message="No tienes permiso para ver el Calendario." />;
  }
  const events = await getCrmDataSource().listCalendarEvents();
  return <CalendarView events={events} />;
}
