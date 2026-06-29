/** Skeleton de carga para una card de resultado (con barrido shimmer). */
export function ResultSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-4">
          <div className="skeleton h-11 w-11 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="flex items-center gap-3">
              <div className="skeleton h-6 w-12 rounded" />
              <div className="skeleton h-px flex-1" />
              <div className="skeleton h-6 w-12 rounded" />
            </div>
            <div className="skeleton h-5 w-40 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
          <div className="skeleton h-8 w-24 rounded" />
          <div className="skeleton h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
