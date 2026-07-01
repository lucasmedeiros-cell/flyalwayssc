import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import { AuthProvider } from "@/components/auth/auth-provider";
import { PrivacyProvider } from "@/components/privacy/privacy-provider";
import { CrmShell } from "@/components/shell/crm-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login");

  return (
    <AuthProvider user={user}>
      <PrivacyProvider>
        <CrmShell>{children}</CrmShell>
      </PrivacyProvider>
    </AuthProvider>
  );
}
