import type { Metadata } from "next";
import { getDataSource } from "@/lib/services";
import { ProfileShell } from "@/components/profile/profile-shell";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function PerfilPage() {
  const account = await getDataSource().getAccount();
  return <ProfileShell account={account} />;
}
