"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import type {
  Operator,
  SearchFacets,
  SearchFilters,
  SearchQuery,
  SortKey,
  Trip,
} from "@vialta/types";
import { SORT_LABEL, TRANSPORT_MODE_META } from "@vialta/types";
import { getDataSource } from "@/lib/services";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { computeTripTags } from "@/lib/trip-insights";
import { TrustBar } from "@/components/ui/trust-bar";
import { ResultCard } from "./result-card";
import { ResultSkeleton } from "./result-skeleton";
import { FiltersSidebar, countActiveFilters } from "./filters-sidebar";

const SORTS: SortKey[] = ["recommended", "price", "duration", "depart_time", "arrive_time"];

export function ResultsView({ query }: { query: SearchQuery }) {
  const queryKey = useMemo(() => JSON.stringify(query), [query]);

  const [filters, setFilters] = useState<SearchFilters>({});
  const [facets, setFacets] = useState<SearchFacets | null>(null);
  const [operators, setOperators] = useState<Record<string, Operator>>({});
  const [trips, setTrips] = useState<Trip[]>([]);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Cambia la búsqueda → reinicia filtros y carga facets + operadores.
  useEffect(() => {
    let active = true;
    setFilters({});
    const ds = getDataSource();
    Promise.all([ds.searchFacets(query), ds.listOperators(query.mode)]).then(([f, ops]) => {
      if (!active) return;
      setFacets(f);
      setOperators(Object.fromEntries(ops.map((o) => [o.id, o])));
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  // Carga la lista cada vez que cambian búsqueda, filtros u orden.
  useEffect(() => {
    let active = true;
    setLoading(true);
    getDataSource()
      .searchTrips(query, { filters, sort })
      .then((page) => {
        if (!active) return;
        setTrips(page.items);
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, filters, sort]);

  const meta = TRANSPORT_MODE_META[query.mode];
  const count = trips.length;
  const tripTags = useMemo(() => computeTripTags(trips), [trips]);
  const currency = trips[0]?.price.currency ?? "BOB";
  const activeCount = countActiveFilters(filters);

  const sidebar = facets ? (
    <FiltersSidebar
      mode={query.mode}
      facets={facets}
      operators={operators}
      filters={filters}
      currency={currency}
      onChange={setFilters}
      onClear={() => setFilters({})}
      activeCount={activeCount}
    />
  ) : (
    <div className="h-96 animate-pulse rounded-3xl border border-border bg-surface" />
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">{sidebar}</div>
      </aside>

      {/* Resultados */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
              <span className="mr-2">{meta.icon}</span>
              {loading
                ? "Buscando opciones…"
                : `${count} ${(count === 1 ? meta.label : meta.pluralLabel).toLowerCase()} ${count === 1 ? "disponible" : "disponibles"}`}
            </h1>
            {!loading && count > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                Ordenado por {SORT_LABEL[sort].toLowerCase()}
                {activeCount > 0 && ` · ${activeCount} filtro${activeCount > 1 ? "s" : ""} activo${activeCount > 1 ? "s" : ""}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Botón filtros (móvil) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {activeCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </button>

            <label className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-sm">
              <span className="hidden text-muted-foreground sm:inline">Ordenar:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="cursor-pointer appearance-none bg-transparent font-medium text-foreground outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s} className="bg-surface text-foreground">
                    {SORT_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {!loading && count > 0 && (
          <TrustBar className="mt-4 rounded-2xl border border-border bg-surface/60 px-4 py-2.5" />
        )}

        <div className="mt-6 space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <ResultSkeleton key={i} />)
          ) : count === 0 ? (
            <EmptyState onClear={() => setFilters({})} hasFilters={activeCount > 0} />
          ) : (
            <motion.div
              key={`${sort}-${activeCount}`}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {trips.map((trip) => (
                <ResultCard
                  key={trip.id}
                  trip={trip}
                  operator={operators[trip.operatorId]}
                  tags={tripTags[trip.id]}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Drawer de filtros (móvil) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm overflow-y-auto bg-background p-4 shadow-[var(--shadow-lg)] lg:hidden"
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-[family-name:var(--font-display)] text-lg font-bold">
                  Filtros
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Cerrar filtros"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebar}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Ver {count} resultado{count === 1 ? "" : "s"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
      <p className="text-lg font-semibold">Sin resultados para esta búsqueda</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasFilters
          ? "Ningún viaje cumple los filtros seleccionados."
          : "Prueba con otra fecha o ruta."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary/50 hover:text-primary"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
