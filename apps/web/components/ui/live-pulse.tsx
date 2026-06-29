import { cn } from "@/lib/utils";

/**
 * Indicador "en vivo": punto que late + texto. Para señales de prueba social
 * y urgencia ("45 personas viendo", "Reservado hace 5 min").
 */
export function LivePulse({
  children,
  tone = "accent",
  className,
}: {
  children: React.ReactNode;
  tone?: "accent" | "warning" | "danger" | "success";
  className?: string;
}) {
  const dot =
    tone === "warning"
      ? "bg-warning"
      : tone === "danger"
        ? "bg-danger"
        : tone === "success"
          ? "bg-success"
          : "bg-accent";

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", className)}>
      <span className="relative flex h-2 w-2 shrink-0">
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", dot)} />
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dot)} />
      </span>
      {children}
    </span>
  );
}
