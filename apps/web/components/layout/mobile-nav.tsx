"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Flame, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { LocaleCurrency } from "./locale-currency";
import { BADGE_META, NAV } from "./nav-data";
import { cn } from "@/lib/utils";

export function MobileNav({ promoActive = false }: { promoActive?: boolean }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<number | null>(0);

  // Bloquea el scroll del body mientras el drawer está abierto.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-[88%] max-w-sm flex-col bg-background shadow-[var(--shadow-lg)]"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
                <BrandLogo />
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={close}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-2">
                {promoActive && (
                  <Link
                    href="/promo"
                    onClick={close}
                    className="mb-1 flex items-center gap-3 rounded-2xl bg-danger/10 p-3 transition-colors hover:bg-danger/15"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
                      <Flame className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-danger">Oferta destacada</span>
                      <span className="block text-xs text-muted-foreground">No te pierdas el producto en promoción</span>
                    </span>
                  </Link>
                )}
                {NAV.map((item, i) => (
                  <Accordion
                    key={item.label}
                    item={item}
                    open={section === i}
                    onToggle={() => setSection((s) => (s === i ? null : i))}
                    onNavigate={close}
                  />
                ))}
              </nav>

              <div className="space-y-3 border-t border-border px-4 py-4">
                <LocaleCurrency className="w-full" />
                <Link href="/perfil" onClick={close} className="block">
                  <Button variant="primary" size="md" className="w-full">
                    Ingresar
                  </Button>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Accordion({
  item,
  open,
  onToggle,
  onNavigate,
}: {
  item: (typeof NAV)[number];
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const links = item.mega?.links ?? [];

  return (
    <div className="border-b border-border/70 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-3.5 text-left text-base font-semibold text-foreground"
      >
        {item.label}
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && links.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-3">
              {links.map((link) => {
                const Icon = link.icon;
                const badge = link.badge ? BADGE_META[link.badge] : null;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onNavigate}
                    className="flex items-start gap-3 rounded-2xl p-2.5 transition-colors hover:bg-surface-2"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">{link.label}</span>
                        {badge && (
                          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", badge.className)}>
                            {badge.label}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{link.description}</span>
                    </span>
                  </Link>
                );
              })}

              {item.mega?.cta && (
                <Link
                  href={item.mega.cta.href}
                  onClick={onNavigate}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  {item.mega.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
