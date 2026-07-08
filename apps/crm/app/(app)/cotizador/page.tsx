import { roleCan } from "@vialta/types";
import { getServerUser } from "@/lib/auth/session";
import { getCrmDataSource } from "@/lib/crm";
import { vendedorQuotes } from "@/lib/vendedor";
import { QuotesView } from "@/components/quotes/quotes-view";
import { AccessDenied } from "@/components/common/access-denied";

export const metadata = { title: "Cotizador" };

export default async function CotizadorPage() {
  const user = await getServerUser();
  if (!user || !roleCan(user.role, "quotes.view")) {
    return <AccessDenied message="No tienes permiso para ver el Cotizador." />;
  }

  // El Cotizador incorpora también las cotizaciones generadas por el Vendedor 24/7.
  const base = await getCrmDataSource().listQuotes();
  const quotes = [...vendedorQuotes(), ...base].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return <QuotesView initialQuotes={quotes} />;
}
