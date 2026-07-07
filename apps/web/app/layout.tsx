import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { getDataSource } from "@/lib/services";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BugReportButton } from "@/components/common/bug-report-button";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FlyAlways — Vuelos baratos en Bolivia y el mundo",
    template: "%s · FlyAlways",
  },
  description:
    "Tu agencia de vuelos en Bolivia. Compara y reserva vuelos nacionales e internacionales con BoA, EcoJet, LATAM, Avianca, Copa y más. Precios en bolivianos, pago seguro y soporte nacional 24/7.",
  applicationName: "FlyAlways",
  keywords: [
    "vuelos Bolivia",
    "vuelos baratos Bolivia",
    "BoA",
    "Boliviana de Aviación",
    "EcoJet",
    "vuelos La Paz",
    "vuelos Santa Cruz",
    "Salar de Uyuni",
    "reservar vuelos Bolivia",
    "vuelos internacionales Bolivia",
    "transporte multimodal",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d16" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const promo = await getDataSource().getPromo();
  return (
    <html lang="es-BO" suppressHydrationWarning className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <ScrollProgress />
          <SiteHeader promoActive={!!promo} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <BugReportButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
