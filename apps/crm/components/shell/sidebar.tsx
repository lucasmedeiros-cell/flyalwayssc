"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn, BrandLogo } from "@vialta/ui";
import { CRM_NAV } from "./nav-data";
import { useAuth } from "@/components/auth/auth-provider";
import { APP_VERSION } from "@/lib/version";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { can } = useAuth();

  // Filtra ítems y grupos según los permisos del usuario (RBAC).
  const groups = CRM_NAV.map((g) => ({
    ...g,
    items: g.items.filter((it) => can(it.permission)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex h-full flex-col">
      {/* Marca */}
      <div className="flex h-16 items-center px-5">
        <BrandLogo size={36} tagline="CRM" />
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {groups.map((group) => (
          <div key={group.title} className="mt-5 first:mt-2">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "text-primary"
                          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="crm-nav-active"
                          className="absolute inset-0 rounded-2xl bg-primary/12"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <Icon className="relative z-10 h-4.5 w-4.5 shrink-0" />
                      <span className="relative z-10 flex-1">{item.label}</span>
                      {typeof item.badge === "number" && (
                        <span className="relative z-10 rounded-full bg-accent/14 px-1.5 text-[11px] font-semibold text-accent-strong tabular-nums dark:text-accent">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pie: versión de la app */}
      <div className="border-t border-border px-5 py-3">
        <span className="text-[11px] text-muted-foreground">
          FlyAlways CRM · <span className="font-medium tabular-nums">v{APP_VERSION}</span>
        </span>
      </div>
    </div>
  );
}
