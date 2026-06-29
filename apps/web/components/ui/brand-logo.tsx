import { cn } from "@/lib/utils";

/**
 * Logotipo de marca "FlyAlways". Usa el logo oficial de /public/brand/flyalways.png
 * + el wordmark. Para cambiar el logo, sustituye ese archivo (mismo nombre).
 */
export function BrandLogo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- logo de marca local */}
      <img
        src="/brand/flyalways.png"
        alt="FlyAlways"
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 object-contain"
      />
      {showWordmark && (
        <span className="font-[family-name:var(--font-display)] text-[1.35rem] font-bold tracking-tight">
          FlyAlways
        </span>
      )}
    </span>
  );
}
