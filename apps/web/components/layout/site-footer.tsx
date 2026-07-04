import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Lock,
  ShieldCheck,
  Smartphone,
  Twitter,
  Youtube,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Vuelos",
    links: [
      { label: "Vuelos nacionales", href: "/buscar?mode=air" },
      { label: "Vuelos internacionales", href: "/buscar?mode=air" },
      { label: "Ofertas de vuelos", href: "/#ofertas" },
      { label: "Aerolíneas", href: "/#operadores" },
    ],
  },
  {
    title: "Descubre",
    links: [
      { label: "Destinos populares", href: "/#destinos" },
      { label: "Experiencias", href: "/#experiencias" },
      { label: "Cómo funciona", href: "/#como-funciona" },
      { label: "Inspiración", href: "/#inspiracion" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Para operadores", href: "/empresas" },
      { label: "Panel admin", href: "/admin" },
      { label: "Sobre FlyAlways", href: "/#como-funciona" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Centro de ayuda", href: "/#ayuda" },
      { label: "Atención 24/7", href: "/#ayuda" },
      { label: "Términos", href: "/legal/terminos" },
      { label: "Privacidad", href: "/legal/privacidad" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

// Medios de pago con logotipo oficial: a color en tema claro y en blanco en
// tema oscuro (mismo tratamiento que el muro de aerolíneas).
const PAYMENTS = [
  { name: "Visa", src: "/logos/payments/visa.png" },
  { name: "Mastercard", src: "/logos/payments/mastercard.svg" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      {/* Newsletter — reciprocidad + retención */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-md">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
              Ofertas que despiertan ganas de viajar
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Suscríbete y recibe tarifas exclusivas y rutas en oferta antes que nadie.
              Sin spam, solo buenos viajes.
            </p>
          </div>
          <div className="w-full lg:max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Marca + columnas */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-6 lg:px-8">
        <div className="col-span-2">
          <BrandLogo />
          {/* Versión del sistema — requisito Petrobox #2 (debajo del logo). */}
          <p className="mt-1.5 text-xs font-medium text-muted-foreground/70">
            v{process.env.NEXT_PUBLIC_APP_VERSION}
          </p>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Tu agencia de vuelos en Bolivia. Compara y reserva vuelos nacionales e
            internacionales en un solo lugar, con precio transparente.
          </p>

          {/* Redes sociales */}
          <div className="mt-5 flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Descarga de la app */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            {["App Store", "Google Play"].map((store) => (
              <a
                key={store}
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 transition-colors hover:border-primary/40"
              >
                <Smartphone className="h-5 w-5 text-foreground" />
                <span className="leading-tight">
                  <span className="block text-[10px] text-muted-foreground">Descárgala en</span>
                  <span className="block text-sm font-semibold">{store}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Confianza: seguridad + medios de pago */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-success" />
              Conexión cifrada SSL
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Pago 100% protegido
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Empresas verificadas
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {PAYMENTS.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element -- logo estático local
              <img
                key={p.name}
                src={p.src}
                alt={p.name}
                decoding="async"
                className="h-6 w-auto object-contain dark:[filter:brightness(0)_invert(1)]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} FlyAlways. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            <span>Desarrollado por</span>
            <a
              href="https://petrobox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Petrobox
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
