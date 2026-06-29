import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "accent" | "success" | "warning";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted-foreground",
  primary: "bg-primary/12 text-primary",
  accent: "bg-accent/14 text-accent-strong dark:text-accent",
  success: "bg-success/14 text-success",
  warning: "bg-warning/16 text-warning",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
