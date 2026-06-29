import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actionLabel && (
        <Button size="sm">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
