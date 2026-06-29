"use client";

import { Luggage, PawPrint, Accessibility, RotateCcw } from "lucide-react";
import type {
  Amenity,
  Operator,
  SearchFacets,
  SearchFilters,
  TransportMode,
  TravelClass,
} from "@vialta/types";
import { AMENITY_LABEL, TRAVEL_CLASS_LABEL } from "@vialta/types";
import { formatDuration, formatMoney } from "@/lib/utils";
import { FilterSection } from "./filter-section";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Chip } from "@/components/ui/chip";
import { RangeSlider } from "@/components/ui/range-slider";
import { AmenityIcon } from "./amenity-icons";

const TIME_WINDOWS: { label: string; hint: string; window: [number, number] }[] = [
  { label: "Madrugada", hint: "00–06", window: [0, 359] },
  { label: "Mañana", hint: "06–12", window: [360, 719] },
  { label: "Tarde", hint: "12–18", window: [720, 1079] },
  { label: "Noche", hint: "18–24", window: [1080, 1439] },
];

function sameWindow(a?: [number, number], b?: [number, number]) {
  return !!a && !!b && a[0] === b[0] && a[1] === b[1];
}

export function FiltersSidebar({
  mode,
  facets,
  operators,
  filters,
  currency,
  onChange,
  onClear,
  activeCount,
}: {
  mode: TransportMode;
  facets: SearchFacets;
  operators: Record<string, Operator>;
  filters: SearchFilters;
  currency: string;
  onChange: (filters: SearchFilters) => void;
  onClear: () => void;
  activeCount: number;
}) {
  const patch = (p: Partial<SearchFilters>) => onChange({ ...filters, ...p });

  const toggleIn = <T,>(arr: T[] | undefined, item: T): T[] => {
    const set = new Set(arr ?? []);
    if (set.has(item)) set.delete(item);
    else set.add(item);
    return Array.from(set);
  };

  const priceLo = filters.priceMin ?? facets.priceMin;
  const priceHi = filters.priceMax ?? facets.priceMax;
  const maxDuration = filters.maxDurationMin ?? facets.durationMax;

  const showStops = mode !== "private" && facets.maxStops > 0;

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between pb-1">
        <h2 className="font-[family-name:var(--font-display)] text-base font-bold">Filtros</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      {/* Empresa */}
      {facets.operators.length > 0 && (
        <FilterSection title="Empresa">
          <div className="space-y-0.5">
            {facets.operators.map((of) => {
              const op = operators[of.operatorId];
              return (
                <Checkbox
                  key={of.operatorId}
                  checked={filters.operatorIds?.includes(of.operatorId) ?? false}
                  onChange={() =>
                    patch({ operatorIds: toggleIn(filters.operatorIds, of.operatorId) })
                  }
                  label={op?.name ?? of.operatorId}
                  hint={`desde ${formatMoney(of.fromPrice, currency)}`}
                />
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Precio */}
      <FilterSection title="Precio">
        <div className="px-1">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold">{formatMoney(priceLo, currency)}</span>
            <span className="font-semibold">{formatMoney(priceHi, currency)}</span>
          </div>
          <RangeSlider
            min={facets.priceMin}
            max={facets.priceMax}
            step={5}
            minGap={5}
            value={[priceLo, priceHi]}
            onChange={([lo, hi]) =>
              patch({
                priceMin: lo <= facets.priceMin ? undefined : lo,
                priceMax: hi >= facets.priceMax ? undefined : hi,
              })
            }
          />
        </div>
      </FilterSection>

      {/* Horario de salida */}
      <FilterSection title="Horario de salida">
        <div className="grid grid-cols-2 gap-2">
          {TIME_WINDOWS.map((w) => {
            const active = sameWindow(filters.departWindow, w.window);
            return (
              <Chip
                key={w.label}
                active={active}
                onClick={() => patch({ departWindow: active ? undefined : w.window })}
                className="justify-center"
              >
                <span className="flex flex-col items-center leading-tight">
                  <span>{w.label}</span>
                  <span className="text-[10px] opacity-70">{w.hint}</span>
                </span>
              </Chip>
            );
          })}
        </div>
      </FilterSection>

      {/* Duración */}
      <FilterSection title="Duración máxima">
        <div className="px-1">
          <p className="mb-3 text-sm font-semibold">{formatDuration(maxDuration)}</p>
          <input
            type="range"
            min={facets.durationMin}
            max={facets.durationMax}
            step={5}
            value={maxDuration}
            onChange={(e) => {
              const v = Number(e.target.value);
              patch({ maxDurationMin: v >= facets.durationMax ? undefined : v });
            }}
            aria-label="Duración máxima"
            className="dual-range__input !relative h-6 w-full"
          />
        </div>
      </FilterSection>

      {/* Escalas */}
      {showStops && (
        <FilterSection title="Escalas">
          <div className="flex flex-wrap gap-2">
            <Chip active={filters.maxStops == null} onClick={() => patch({ maxStops: undefined })}>
              Cualquiera
            </Chip>
            <Chip active={filters.maxStops === 0} onClick={() => patch({ maxStops: 0 })}>
              Directo
            </Chip>
            <Chip active={filters.maxStops === 1} onClick={() => patch({ maxStops: 1 })}>
              Hasta 1 escala
            </Chip>
          </div>
        </FilterSection>
      )}

      {/* Clase */}
      {facets.classes.length > 1 && (
        <FilterSection title="Clase">
          <div className="flex flex-wrap gap-2">
            {facets.classes.map((c: TravelClass) => (
              <Chip
                key={c}
                active={filters.classes?.includes(c) ?? false}
                onClick={() => patch({ classes: toggleIn(filters.classes, c) })}
              >
                {TRAVEL_CLASS_LABEL[c]}
              </Chip>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Servicios */}
      {facets.amenities.length > 0 && (
        <FilterSection title="Servicios">
          <div className="space-y-0.5">
            {facets.amenities.map((a: Amenity) => (
              <Checkbox
                key={a}
                checked={filters.amenities?.includes(a) ?? false}
                onChange={() => patch({ amenities: toggleIn(filters.amenities, a) })}
                label={
                  <span className="flex items-center gap-2">
                    <AmenityIcon amenity={a} />
                    {AMENITY_LABEL[a]}
                  </span>
                }
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Extras */}
      <FilterSection title="Preferencias">
        <div className="space-y-0.5">
          {facets.baggageAvailable && (
            <Switch
              checked={filters.baggageIncluded ?? false}
              onChange={(v) => patch({ baggageIncluded: v || undefined })}
              icon={<Luggage className="h-4 w-4" />}
              label="Equipaje incluido"
            />
          )}
          {facets.petsAvailable && (
            <Switch
              checked={filters.petsAllowed ?? false}
              onChange={(v) => patch({ petsAllowed: v || undefined })}
              icon={<PawPrint className="h-4 w-4" />}
              label="Admite mascotas"
            />
          )}
          {facets.accessibleAvailable && (
            <Switch
              checked={filters.accessible ?? false}
              onChange={(v) => patch({ accessible: v || undefined })}
              icon={<Accessibility className="h-4 w-4" />}
              label="Accesible"
            />
          )}
        </div>
      </FilterSection>
    </div>
  );
}

/** Cuenta cuántos filtros hay activos (para el badge "Limpiar (n)"). */
export function countActiveFilters(f: SearchFilters): number {
  let n = 0;
  if (f.operatorIds?.length) n += 1;
  if (f.priceMin != null || f.priceMax != null) n += 1;
  if (f.departWindow) n += 1;
  if (f.maxDurationMin != null) n += 1;
  if (f.maxStops != null) n += 1;
  if (f.classes?.length) n += 1;
  if (f.amenities?.length) n += 1;
  if (f.baggageIncluded) n += 1;
  if (f.petsAllowed) n += 1;
  if (f.accessible) n += 1;
  return n;
}
