"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Flame } from "lucide-react";
import { BADGE_META, NAV, type MegaLink } from "./nav-data";
import { cn } from "@/lib/utils";

export function DesktopNav({ promoActive = false }: { promoActive?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelClose = () => timer.current && clearTimeout(timer.current);
  const open = (i: number) => {
    cancelClose();
    setActive(i);
  };
  const scheduleClose = () => {
    cancelClose();
    timer.current = setTimeout(() => setActive(null), 120);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative hidden md:block" onMouseLeave={scheduleClose}>
      <nav className="flex items-center gap-1">
        {NAV.map((item, i) => {
          const isActive = active === i;
          return (
            <div key={item.label} onMouseEnter={() => open(i)}>
              <Link
                href={item.href}
                aria-haspopup={item.mega ? "true" : undefined}
                aria-expanded={item.mega ? isActive : undefined}
                onFocus={() => open(i)}
                className={cn(
                  "relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {item.mega && (
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform duration-200", isActive && "rotate-180")}
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            </div>
          );
        })}

        {promoActive && (
          <Link
            href="/promo"
            onMouseEnter={() => setActive(null)}
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-danger/12 px-4 py-2 text-sm font-semibold text-danger transition-colors duration-200 hover:bg-danger/20"
          >
            <Flame className="h-4 w-4" />
            Oferta
          </Link>
        )}
      </nav>

      <AnimatePresence>
        {active !== null && NAV[active].mega && (
          <motion.div
            key={active}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-1/2 top-full z-50 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"
          >
            <MegaPanel index={active} onNavigate={() => setActive(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MegaPanel({ index, onNavigate }: { index: number; onNavigate: () => void }) {
  const mega = NAV[index].mega!;
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface/95 shadow-[var(--shadow-lg)] backdrop-blur-md">
      <div className="grid gap-1 p-4 sm:grid-cols-2">
        {mega.links.map((link) => (
          <MegaLinkRow key={link.label} link={link} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="border-t border-border bg-surface-2/30 px-4 py-3">
        <Link
          href={mega.cta.href}
          onClick={onNavigate}
          className="group/cta inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
        >
          {mega.cta.label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function MegaLinkRow({ link, onNavigate }: { link: MegaLink; onNavigate: () => void }) {
  const Icon = link.icon;
  const badge = link.badge ? BADGE_META[link.badge] : null;
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="group/row flex items-center gap-3 rounded-2xl p-3 transition-colors duration-200 hover:bg-surface-2"
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover/row:scale-105">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">{link.label}</span>
          {badge && (
            <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold", badge.className)}>
              {badge.label}
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{link.description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover/row:translate-x-0 group-hover/row:opacity-100" />
    </Link>
  );
}
