import { cn } from "../lib/cn";

/** Bloque de carga con barrido luminoso (usa la clase global `.skeleton`). */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton rounded-2xl", className)} {...props} />;
}
