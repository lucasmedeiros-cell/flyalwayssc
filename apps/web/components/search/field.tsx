import { cn } from "@/lib/utils";

/** Envoltorio de campo del buscador: etiqueta + icono + control. Limpio y consistente. */
export function Field({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("group flex flex-col gap-2", className)}>
      <span className="px-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "flex min-h-[52px] items-center gap-2.5 rounded-2xl border border-border bg-surface-2/40 px-4 py-3",
          "transition-colors duration-200 group-hover:border-muted-foreground/30",
          "focus-within:border-primary/80 focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/15",
        )}
      >
        {icon && (
          <span className="shrink-0 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary">
            {icon}
          </span>
        )}
        {children}
      </span>
    </label>
  );
}
