"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader({ promoActive = false }: { promoActive?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500 ease-[var(--ease-spring)]",
          scrolled ? "glass shadow-[var(--shadow-md)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-500 ease-[var(--ease-spring)] sm:px-6 lg:px-8",
            scrolled ? "h-15" : "h-18",
          )}
        >
          <Link
            href="/"
            className="shrink-0 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
            aria-label="FlyAlways — inicio"
          >
            <BrandLogo />
          </Link>

          <DesktopNav promoActive={promoActive} />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/perfil" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Ingresar
              </Button>
            </Link>
            <MobileNav promoActive={promoActive} />
          </div>
        </div>
      </div>
    </header>
  );
}
