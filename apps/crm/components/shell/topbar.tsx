"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, Bell, LogOut, ChevronDown, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { ThemeToggle, Avatar } from "@vialta/ui";
import { CRM_ROLE_LABEL } from "@vialta/types";
import { useAuth } from "@/components/auth/auth-provider";
import { useMoneyMask } from "@/components/privacy/privacy-provider";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, logout } = useAuth();
  const { masked, toggle: toggleMask } = useMoneyMask();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={onOpenMenu}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-2 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar clientes, pasajes, cotizaciones…"
          className="h-10 w-full rounded-full border border-input bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-2"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
        </button>
        <button
          type="button"
          onClick={toggleMask}
          aria-label={masked ? "Mostrar montos" : "Ocultar montos"}
          title={masked ? "Mostrar montos" : "Ocultar montos"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-2"
        >
          {masked ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
        </button>
        <ThemeToggle />

        {/* Menú de perfil */}
        <div ref={ref} className="relative ml-1">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-surface-2"
          >
            <Avatar initials={user.initials} color={user.color} size={36} />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold">{user.name}</span>
              <span className="block text-[11px] text-muted-foreground">{CRM_ROLE_LABEL[user.role]}</span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-lg)]"
              >
                <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                  <Avatar initials={user.initials} color={user.color} size={40} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-1 text-xs font-medium text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {CRM_ROLE_LABEL[user.role]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 border-t border-border px-4 py-3 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
