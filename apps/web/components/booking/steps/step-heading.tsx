export function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
