import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getDataSource } from "@/lib/services";
import { PromoLanding } from "@/components/promo/promo-landing";

export async function generateMetadata(): Promise<Metadata> {
  const promo = await getDataSource().getPromo();
  if (!promo) return { title: "Producto destacado" };
  return { title: promo.title, description: promo.subtitle };
}

export default async function PromoPage() {
  const promo = await getDataSource().getPromo();

  if (!promo) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Sparkles className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          No hay una promoción activa
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vuelve pronto: estamos preparando una oferta destacada para ti.
        </p>
        <Link href="/buscar" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          Explorar vuelos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return <PromoLanding promo={promo} />;
}
