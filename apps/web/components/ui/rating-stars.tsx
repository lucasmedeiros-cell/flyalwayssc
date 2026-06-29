import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Cinco estrellas reutilizables (relleno según rating). Accesible. */
export function RatingStars({
  rating,
  size = 16,
  showValue = false,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating.toFixed(1)} de 5 estrellas`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          style={{ width: size, height: size }}
          className={i < rounded ? "fill-warning text-warning" : "fill-surface-2 text-surface-2"}
        />
      ))}
      {showValue && (
        <span className="ml-1.5 text-sm font-semibold tabular-nums text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
