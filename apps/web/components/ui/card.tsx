import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Card sólida con sombra suave y borde sutil. */
export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-border bg-surface text-foreground shadow-[var(--shadow-sm)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/** Card con glassmorphism muy sutil — para overlays sobre fondos con color. */
export const GlassCard = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("glass rounded-3xl text-foreground shadow-[var(--shadow-lg)]", className)}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";
