import { redirect } from "next/navigation";

// Las automatizaciones se gestionan ahora dentro de Ajustes (junto al Vendedor
// 24/7). Mantenemos la ruta como redirección para no romper enlaces antiguos.
export default function AutomatizacionesPage() {
  redirect("/ajustes");
}
