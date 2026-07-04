import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PromoProduct } from "@vialta/types";
import { formatMoney } from "@/lib/utils";

/** Banner de portada del producto destacado. Solo se muestra si la promo está activa. */
export function PromoBanner({ promo }: { promo: PromoProduct }) {
  const accent = promo.accentColor ?? "#e0a106";
  const hasDiscount = promo.originalPrice && promo.originalPrice.amount > promo.price.amount;
  const discountPct = hasDiscount ? Math.round((1 - promo.price.amount / promo.originalPrice!.amount) * 100) : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/promo"
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:flex-row"
        aria-label={`Ver oferta: ${promo.productName}`}
      >
        {/* Imagen */}
        <div className="relative h-48 w-full overflow-hidden sm:h-auto sm:w-2/5">
          {promo.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={promo.imageUrl} alt={promo.productName} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent sm:bg-gradient-to-r" />
          {promo.badge && (
            <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold text-slate-950" style={{ background: accent }}>
              {promo.badge}
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="relative flex flex-1 flex-col justify-center gap-3 bg-surface p-6 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{ background: `radial-gradient(70% 100% at 100% 0%, ${accent}18, transparent 70%)` }}
          />
          <span className="relative inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
            <Sparkles className="h-3.5 w-3.5" /> {promo.eyebrow}
          </span>
          <h2 className="relative font-[family-name:var(--font-display)] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {promo.title}
          </h2>
          <p className="relative max-w-lg text-sm text-muted-foreground">{promo.subtitle}</p>

          <div className="relative mt-1 flex flex-wrap items-end gap-2.5">
            <span className="font-[family-name:var(--font-display)] text-3xl font-bold">{formatMoney(promo.price.amount, promo.price.currency)}</span>
            {hasDiscount && (
              <>
                <span className="mb-1 text-sm text-muted-foreground line-through">{formatMoney(promo.originalPrice!.amount, promo.originalPrice!.currency)}</span>
                <span className="mb-1 rounded-full bg-success/90 px-2 py-0.5 text-xs font-bold text-white">−{discountPct}%</span>
              </>
            )}
            <span
              className="relative ml-auto inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-950 transition-transform group-hover:gap-2.5"
              style={{ background: accent }}
            >
              {promo.ctaLabel} <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
