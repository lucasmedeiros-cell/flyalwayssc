import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Página premium "en construcción" que adelanta el alcance del módulo. */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  features,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-50" />
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <Badge tone="primary">{eyebrow}</Badge>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-[var(--shadow-sm)]"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="text-sm font-medium">{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
