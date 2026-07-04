-- CreateTable
CREATE TABLE "PromoLanding" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "eyebrow" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT,
    "priceAmount" DOUBLE PRECISION NOT NULL,
    "priceCurrency" TEXT NOT NULL DEFAULT 'BOB',
    "originalPriceAmount" DOUBLE PRECISION,
    "originalPriceCurrency" TEXT,
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,
    "imageUrl" TEXT,
    "accentColor" TEXT,
    "highlights" JSONB NOT NULL,
    "stats" JSONB NOT NULL,
    "validUntil" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoLanding_pkey" PRIMARY KEY ("id")
);
