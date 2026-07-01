import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { AgentsView } from "@/components/agents/agents-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Agentes" };

export default async function AgentesPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "agents.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Agentes." />;
  }
  const agents = await getCrmDataSource().listAgents();
  return <AgentsView agents={agents} />;
}
