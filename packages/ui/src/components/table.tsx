"use client";

import { cn } from "../lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  /** Render de celda. Recibe la fila completa. */
  cell: (row: T) => React.ReactNode;
  /** Clase para alinear (p. ej. "text-right"). */
  align?: "left" | "right" | "center";
  /** Ancho de columna en la grilla CSS (p. ej. "2fr", "1fr", "auto"). */
  width?: string;
  /** Oculta la columna en móvil. */
  hideOnMobile?: boolean;
}

/**
 * Tabla moderna basada en CSS-grid (mismo patrón que la tabla de empresas del
 * admin existente): cabecera en mayúsculas, filas con hover, responsive.
 */
export function DataTable<T>({
  columns,
  rows,
  keyOf,
  onRowClick,
  empty = "Sin resultados",
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  keyOf: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
  className?: string;
}) {
  const gridTemplate = columns.map((c) => c.width ?? "1fr").join(" ");
  const alignClass = (a?: Column<T>["align"]) =>
    a === "right" ? "text-right justify-end" : a === "center" ? "text-center justify-center" : "text-left";

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]", className)}>
      {/* Cabecera (solo desktop) */}
      <div
        className="hidden gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((c) => (
          <span key={c.key} className={cn(alignClass(c.align), c.hideOnMobile && "hidden sm:block")}>
            {c.header}
          </span>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">{empty}</div>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li
              key={keyOf(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "flex flex-col gap-2 px-5 py-3.5 sm:grid sm:items-center sm:gap-4",
                onRowClick && "cursor-pointer transition-colors hover:bg-surface-2/60"
              )}
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((c) => (
                <div
                  key={c.key}
                  className={cn("min-w-0 text-sm sm:flex sm:items-center", alignClass(c.align), c.hideOnMobile && "hidden sm:flex")}
                >
                  {c.cell(row)}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
