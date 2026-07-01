import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { QuotesView } from "@/components/quotes/quotes-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Cotizador" };

export default async function CotizadorPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "quotes.view")) {
    return <AccessDenied message="No tienes permiso para ver el Cotizador." />;
  }

  const quotes = await getCrmDataSource().listQuotes();
  return <QuotesView initialQuotes={quotes} />;
}
