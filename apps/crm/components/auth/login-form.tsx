"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Loader2, AlertCircle, Plane } from "lucide-react";
import { Button, GlassCard, Input, Field, BrandLogo } from "@vialta/ui";

/** URL del sitio web público (para volver desde el CRM). En producción apunta a
 *  la web de Netlify; en local se sobreescribe con NEXT_PUBLIC_WEB_URL. */
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? "https://flyalwayssc.netlify.app";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "No se pudo iniciar sesión");
        return;
      }
      router.push(params.get("from") ?? "/");
      router.refresh();
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="relative w-full max-w-md p-8">
      {/* Marca */}
      <div className="flex flex-col items-center text-center">
        <BrandLogo size={64} showWordmark={false} />
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
          FlyAlways <span className="text-gradient">CRM</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Inicia sesión para administrar tu agencia</p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4" suppressHydrationWarning>
        <Field label="Usuario" htmlFor="email">
          <Input
            id="email"
            type="text"
            autoComplete="username"
            icon={User}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin"
            required
          />
        </Field>

        <Field label="Contraseña" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </Field>

        {error && (
          <p className="flex items-center gap-2 rounded-2xl bg-danger/12 px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Ingresando…
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </form>

      <div className="mt-6 rounded-2xl border border-border bg-surface/60 px-4 py-3 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Acceso de demostración</p>
        <p className="mt-1">
          Usuario <code className="rounded bg-surface-2 px-1 py-0.5">admin</code> · Contraseña{" "}
          <code className="rounded bg-surface-2 px-1 py-0.5">admin</code>
        </p>
      </div>

      {/* Volver al sitio web público (FlyAlways). */}
      <a
        href={WEB_URL}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
      >
        <Plane className="h-4 w-4" /> Ir al sitio web
      </a>
    </GlassCard>
  );
}
