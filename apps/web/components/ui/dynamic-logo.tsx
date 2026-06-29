"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Carga dinámica de logotipos oficiales con degradación elegante.
 *
 * Resuelve `/public/logos/{kind}/{slug}.{svg|png|webp}` PROBANDO del lado del
 * cliente con objetos Image() controlados (evita el "race" de hidratación que
 * hacía que un .svg inexistente bloqueara la carga del .png). Solo cuando un
 * archivo carga de verdad se muestra; si ninguno existe, placeholder de marca.
 *
 * Así el diseño nunca se rompe y, al copiar el archivo oficial en la carpeta,
 * aparece automáticamente en TODA la plataforma sin tocar código.
 *
 * Formas: `square` (avatar, por defecto) y `wordmark` (placa apaisada para
 * logotipos horizontales — carrusel de aerolíneas).
 */
const EXTS = ["png", "svg", "webp"] as const;

function useResolvedLogo(kind: string, slug: string): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(null);
    if (!slug) return;
    let cancelled = false;
    (async () => {
      for (const ext of EXTS) {
        const url = `/logos/${kind}/${slug}.${ext}`;
        const ok = await new Promise<boolean>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });
        if (cancelled) return;
        if (ok) {
          setSrc(url);
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, slug]);

  return src;
}

export function DynamicLogo({
  kind,
  slug,
  name,
  mark,
  color = "#3a23a8",
  size = 44,
  icon: Icon,
  rounded = "rounded-2xl",
  wordmark = false,
  bare = false,
  className,
}: {
  kind: "airlines" | "operators";
  slug: string;
  name: string;
  mark: string;
  color?: string;
  size?: number;
  icon?: LucideIcon;
  rounded?: string;
  wordmark?: boolean;
  /** Solo el logotipo (sin placa), grande y centrado. Para muros de logos. */
  bare?: boolean;
  className?: string;
}) {
  const src = useResolvedLogo(kind, slug);

  if (bare) {
    return src ? (
      // eslint-disable-next-line @next/next/no-img-element -- logo local resuelto en cliente
      <img
        src={src}
        alt={name}
        decoding="async"
        className={cn(
          "h-auto max-h-14 w-auto max-w-full object-contain dark:[filter:brightness(0)_invert(1)]",
          className,
        )}
      />
    ) : (
      <span className={cn("inline-flex items-center gap-2.5", className)} aria-label={name} role="img">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-xl font-[family-name:var(--font-display)] text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 55%, #000))` }}
        >
          {Icon ? <Icon className="h-5 w-5" strokeWidth={2.2} /> : mark}
        </span>
        <span className="whitespace-nowrap text-lg font-bold text-slate-800">{name}</span>
      </span>
    );
  }

  if (wordmark) {
    return (
      <span
        aria-label={name}
        role="img"
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-xl bg-white px-3 shadow-[var(--shadow-sm)] ring-1 ring-black/5",
          className,
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- logo local resuelto en cliente
          <img
            src={src}
            alt={name}
            decoding="async"
            className="max-h-7 w-auto max-w-[150px] object-contain"
          />
        ) : (
          <>
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-lg font-[family-name:var(--font-display)] text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 55%, #000))` }}
            >
              {Icon ? <Icon className="h-4 w-4" strokeWidth={2.2} /> : mark}
            </span>
            <span className="whitespace-nowrap pr-1 text-sm font-bold text-slate-800">{name}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <span
      aria-label={name}
      role="img"
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden", rounded, className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- logo local resuelto en cliente
        <img src={src} alt={name} decoding="async" className="h-full w-full bg-white object-contain p-1.5" />
      ) : (
        <span
          aria-hidden
          className="flex h-full w-full items-center justify-center font-[family-name:var(--font-display)] font-bold text-white"
          style={{
            fontSize: size * 0.34,
            background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 55%, #000))`,
            boxShadow: `0 6px 16px -6px ${color}80`,
          }}
        >
          {Icon ? <Icon style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2} /> : mark}
        </span>
      )}
    </span>
  );
}
