import type { Metadata } from "next";
import type { SearchQuery, TransportMode, TripKind, TravelClass } from "@vialta/types";
import { TRANSPORT_MODES } from "@vialta/types";
import { SearchPanel } from "@/components/search/search-panel";
import { ResultsView } from "@/components/results/results-view";

export const metadata: Metadata = { title: "Resultados de búsqueda" };

type SP = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}
function num(v: string | string[] | undefined, fallback: number): number {
  const n = Number(str(v));
  return Number.isFinite(n) ? n : fallback;
}

function buildQuery(sp: SP): SearchQuery {
  const modeParam = str(sp.mode) as TransportMode;
  const mode = TRANSPORT_MODES.includes(modeParam) ? modeParam : "air";
  return {
    mode,
    originId: str(sp.origin),
    destinationId: str(sp.destination),
    departDate: str(sp.depart),
    returnDate: str(sp.return),
    tripKind: (str(sp.trip) as TripKind) === "one_way" ? "one_way" : "round_trip",
    passengers: {
      adults: Math.max(1, num(sp.adults, 1)),
      children: Math.max(0, num(sp.children, 0)),
      infants: Math.max(0, num(sp.infants, 0)),
    },
    travelClass: str(sp.class) as TravelClass | undefined,
  };
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const query = buildQuery(sp);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SearchPanel initialMode={query.mode} className="mb-8" />
      <ResultsView query={query} />
    </div>
  );
}
