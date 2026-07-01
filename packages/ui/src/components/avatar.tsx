import { cn } from "../lib/cn";

/** Avatar de iniciales con color de marca (sin dependencias de imagen). */
export function Avatar({
  initials,
  color,
  size = 36,
  className,
}: {
  initials: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  const bg = color ?? "var(--primary)";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${bg}, color-mix(in oklab, ${bg} 70%, #000))`,
      }}
    >
      {initials}
    </span>
  );
}
