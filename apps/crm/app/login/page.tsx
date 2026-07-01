import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage() {
  // Si la sesión es VÁLIDA (verificada, no por mera presencia de cookie),
  // mandamos al dashboard. Si la cookie es inválida/vieja, getServerUser
  // devuelve null y se muestra el login — sin bucles de redirección.
  const user = await getServerUser();
  if (user) redirect("/");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Fondo aurora de marca */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-background/40" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
