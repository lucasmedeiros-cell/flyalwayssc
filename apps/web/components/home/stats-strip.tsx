import { Reveal, RevealItem } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { CountUp } from "@/components/ui/count-up";

const STATS = [
  { value: 500, suffix: " mil+", label: "Viajeros en Bolivia" },
  { value: 16, suffix: "+", label: "Operadores aliados" },
  { value: 9, suffix: "", label: "Departamentos conectados" },
  { value: 2, prefix: "<", suffix: " s", label: "Tiempo de búsqueda" },
];

export function StatsStrip() {
  return (
    <Section className="py-10 sm:py-12 lg:py-12">
      <Reveal className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-sm)] md:grid-cols-4">
        {STATS.map((s) => (
          <RevealItem key={s.label} variant="scale" className="text-center">
            <CountUp
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              className="font-[family-name:var(--font-display)] text-3xl font-bold text-gradient sm:text-4xl"
            />
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
