import type { Metadata } from "next";
import { getDataSource } from "@/lib/services";
import { ConsoleShell } from "@/components/operator/console-shell";

export const metadata: Metadata = { title: "Panel de operador" };

export default async function EmpresasPage() {
  const data = await getDataSource().getOperatorConsole();
  return <ConsoleShell data={data} />;
}
