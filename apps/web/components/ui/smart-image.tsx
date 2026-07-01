"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BLUR_DATA_URL, type CuratedImage } from "@/lib/images";

/**
 * Imagen de fondo "a prueba de fallos": la fotografía optimizada (next/image) se
 * monta SOBRE el gradiente duotono de marca. Si la foto no carga, ocultamos la
 * imagen y queda el gradiente — la identidad nunca se rompe. Pensada para vivir
 * dentro de un contenedor `relative` (cards, hero, tiles).
 */
export function SmartImage({
  image,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
}: {
  image: CuratedImage;
  sizes?: string;
  priority?: boolean;
  /** Clases del contenedor (por defecto cubre todo el padre relative). */
  className?: string;
  /** Clases extra para el <img> (p. ej. transiciones de zoom al hover). */
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Gradiente de marca: fondo durante la carga y fallback si la foto falla. */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", image.gradient)} aria-hidden />
      {!failed && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          quality={90}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          priority={priority}
          onError={() => setFailed(true)}
          className={cn("object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
