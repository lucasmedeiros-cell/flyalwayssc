import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { DocumentsView } from "@/components/documents/documents-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Documentos" };

export default async function DocumentosPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "documents.view")) {
    return <AccessDenied message="No tienes permiso para ver el módulo de Documentos." />;
  }

  const documents = await getCrmDataSource().listDocuments();
  return <DocumentsView initialDocuments={documents} />;
}
