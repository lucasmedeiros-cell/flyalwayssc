import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { TasksBoard } from "@/components/tasks/tasks-board";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Tareas" };

export default async function TareasPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "tasks.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Tareas." />;
  }
  const tasks = await getCrmDataSource().listTasks();
  return <TasksBoard initialTasks={tasks} />;
}
