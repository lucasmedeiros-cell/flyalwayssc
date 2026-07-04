/**
 * Seed de la landing promocional (producto destacado, fila única "default").
 * Se administra/activa desde el panel de administración; se publica en /promo.
 *   DATABASE_URL=... npx ts-node prisma/seed-promo.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROMO = {
  id: "default",
  active: true,
  eyebrow: "Producto destacado",
  title: "Salar de Uyuni — Expedición Premium",
  subtitle: "3 días · 2 noches en el desierto de sal más grande del mundo, con guía certificado y hotel de sal.",
  productName: "Expedición Salar de Uyuni 3D/2N",
  description:
    "La aventura definitiva por el altiplano boliviano: amaneceres imposibles sobre el espejo de sal, lagunas de colores, geiseres y cielos estrellados. Todo incluido, en grupos reducidos y con los mejores guías del país.",
  badge: "Edición limitada",
  priceAmount: 2200,
  priceCurrency: "BOB",
  originalPriceAmount: 3100,
  originalPriceCurrency: "BOB",
  ctaLabel: "Reservar ahora",
  ctaHref: "/buscar?mode=air&destinationId=uyu",
  imageUrl: "/images/experiences/tours.jpg",
  accentColor: "#e0a106",
  highlights: [
    { icon: "Sparkles", title: "Amanecer en el salar", text: "El espejo de sal al alba, una experiencia irrepetible." },
    { icon: "ShieldCheck", title: "Guía certificado", text: "Expertos locales y grupos reducidos (máx. 8 personas)." },
    { icon: "BedDouble", title: "Hotel de sal", text: "Dos noches en alojamiento construido íntegramente en sal." },
    { icon: "Utensils", title: "Todo incluido", text: "Traslados 4x4, comidas y entradas a reservas naturales." },
  ],
  stats: [
    { label: "Valoración", value: "4.9 ★" },
    { label: "Viajeros", value: "+2.300" },
    { label: "Duración", value: "3 días" },
    { label: "Ahorro", value: "-29%" },
  ],
  validUntil: "2026-08-15T23:59:59",
};

async function main() {
  await prisma.promoLanding.upsert({ where: { id: "default" }, create: PROMO, update: PROMO });
  console.log(`Seed promo OK → ${PROMO.productName} (active=${PROMO.active})`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
