import { cn } from "../lib/cn";

/**
 * Logotipo de marca FlyAlways. Usa el logo oficial en
 * `/brand/flyalways.png` (debe existir en el public/ de la app que lo consume)
 * + wordmark opcional y una pequeña bajada (p. ej. "CRM").
 * Para cambiar el logo, sustituye ese archivo (mismo nombre).
 */
export function BrandLogo({
  className,
  showWordmark = true,
  size = 36,
  tagline,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  tagline?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- logo de marca local */}
      <img
        src="/brand/flyalways.png"
        alt="FlyAlways"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 object-contain"
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-[family-name:var(--font-display)] text-base font-extrabold tracking-tight">
            FlyAlways
          </span>
          {tagline && (
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
