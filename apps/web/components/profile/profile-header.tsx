import { Award, Sparkles } from "lucide-react";
import type { Account } from "@vialta/types";
import { formatDate } from "@/lib/utils";

export function ProfileHeader({ account }: { account: Account }) {
  const { user, bookings, favorites } = account;
  const upcoming = bookings.filter((b) => b.status === "upcoming").length;
  const trips = bookings.filter((b) => b.status !== "cancelled").length;

  const stats = [
    { label: "Próximos viajes", value: upcoming },
    { label: "Viajes realizados", value: trips },
    { label: "Rutas favoritas", value: favorites.length },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent font-[family-name:var(--font-display)] text-2xl font-bold text-white shadow-[var(--shadow-glow)]">
            {user.initials}
          </span>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
              {user.fullName}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/16 px-2.5 py-1 font-medium text-warning">
                <Award className="h-3.5 w-3.5" />
                {user.tier}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {user.points.toLocaleString("es")} puntos
              </span>
              <span className="text-muted-foreground">
                Miembro desde {formatDate(user.memberSince)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-surface/70 px-4 py-3 text-center backdrop-blur"
            >
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-gradient">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
