"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import type { FavoriteRoute } from "@vialta/types";
import { TRANSPORT_MODE_META } from "@vialta/types";
import { formatMoney } from "@/lib/utils";
import { Reveal, RevealItem } from "@/components/ui/reveal";

export function FavoritesSection({ favorites }: { favorites: FavoriteRoute[] }) {
  const [items, setItems] = useState(favorites);

  function remove(id: string) {
    setItems((prev) => prev.filter((f) => f.id !== id));
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface/60 p-10 text-center">
        <Heart className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-3 font-medium">Aún no tienes rutas favoritas</p>
        <p className="mt-1 text-sm text-muted-foreground">Guarda tus rutas frecuentes para reservarlas más rápido.</p>
        <Link href="/buscar" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          Explorar rutas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((f) => {
        const meta = TRANSPORT_MODE_META[f.mode];
        return (
          <RevealItem key={f.id}>
            <Link
              href={`/buscar?mode=${f.mode}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{meta.icon}</span>
                <button
                  type="button"
                  aria-label={`Quitar ${f.originCity} → ${f.destinationCity} de favoritos`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    remove(f.id);
                  }}
                  className="rounded-full p-1 text-danger transition-colors hover:bg-danger/10"
                >
                  <Heart className="h-5 w-5 fill-danger text-danger" />
                </button>
              </div>
              <p className="mt-4 text-lg font-semibold">
                {f.originCity} → {f.destinationCity}
              </p>
              <p className="text-sm text-muted-foreground">
                {f.originCode} · {f.destinationCode} · {meta.label}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  Desde{" "}
                  <span className="font-semibold text-foreground">
                    {formatMoney(f.fromPrice.amount, f.fromPrice.currency)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Buscar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </Reveal>
  );
}
