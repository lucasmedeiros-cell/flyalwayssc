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

  // Encabezado y filas comparten UNA sola grilla mediante `subgrid`: así las
  // columnas quedan perfectamente alineadas aunque usen anchos `auto`/`fr`
  // (que de otro modo se calcularían distinto en cada grilla independiente).
  const spanAll: React.CSSProperties = { gridColumn: "1 / -1", gridTemplateColumns: "subgrid" };

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-sm)]", className)}>
      <div className="sm:grid" style={{ gridTemplateColumns: gridTemplate }}>
        {/* Cabecera (solo desktop) */}
        <div
          className="hidden gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid"
          style={spanAll}
        >
          {columns.map((c) => (
            <span key={c.key} className={cn(alignClass(c.align), c.hideOnMobile && "hidden sm:block")}>
              {c.header}
            </span>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground" style={{ gridColumn: "1 / -1" }}>
            {empty}
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={keyOf(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "flex flex-col gap-2 border-b border-border px-5 py-3.5 last:border-b-0 sm:grid sm:items-center sm:gap-4",
                onRowClick && "cursor-pointer transition-colors hover:bg-surface-2/60"
              )}
              style={spanAll}
            >
              {columns.map((c) => (
                <div
                  key={c.key}
                  className={cn("min-w-0 text-sm sm:flex sm:items-center", alignClass(c.align), c.hideOnMobile && "hidden sm:flex")}
                >
                  {c.cell(row)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
