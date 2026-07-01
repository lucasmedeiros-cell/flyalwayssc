import { ShieldX } from "lucide-react";

export function AccessDenied({ message }: { message?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-20 text-center shadow-[var(--shadow-sm)]">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-danger/12 text-danger">
          <ShieldX className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold">Acceso denegado</h2>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          {message ?? "No tienes permisos para ver esta sección. Contacta a un administrador si crees que es un error."}
        </p>
      </div>
    </div>
  );
}
