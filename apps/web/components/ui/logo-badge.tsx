import { cn } from "@/lib/utils";

/** Insignia cuadrada con iniciales y color de marca (logo generado, sin terceros). */
export function LogoBadge({
  mark,
  color,
  size = 44,
  className,
}: {
  mark: string;
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl font-[family-name:var(--font-display)] font-bold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 55%, #000))`,
        boxShadow: `0 6px 16px -6px ${color}80`,
      }}
    >
      {mark}
    </span>
  );
}
