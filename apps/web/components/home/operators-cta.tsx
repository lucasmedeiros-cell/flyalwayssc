import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export function OperatorsCta() {
  return (
    <Section id="ayuda">
      <Reveal>
        <RevealItem variant="blur">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-md)] sm:p-12">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60 aurora-animate" />
            <div className="max-w-2xl">
              <span className="eyebrow">Para operadores</span>
              <h2 className="mt-3 text-balance font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
                Haz crecer tu negocio de transporte con FlyAlways
              </h2>
              <p className="mt-3 text-balance text-muted-foreground sm:text-lg">
                Publica tus rutas, gestiona horarios, precios y promociones, y vende a miles de
                viajeros nuevos desde un panel pensado para crecer. Multiempresa, multisucursal y
                multimoneda desde el día uno.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/empresas">
                  <Button size="lg">
                    Soy operador
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="lg">
                    Ver panel admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </RevealItem>
      </Reveal>
    </Section>
  );
}
