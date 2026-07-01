-- CreateTable
CREATE TABLE "WebAccount" (
    "id" TEXT NOT NULL DEFAULT 'me',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "memberSince" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "WebAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebBookingRecord" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "operatorName" TEXT NOT NULL,
    "operatorMark" TEXT NOT NULL,
    "operatorColor" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "originCode" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationCode" TEXT NOT NULL,
    "departAt" TEXT NOT NULL,
    "arriveAt" TEXT NOT NULL,
    "travelClass" TEXT NOT NULL,
    "passengers" INTEGER NOT NULL,
    "seats" TEXT[],
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "totalCurrency" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WebBookingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebInvoice" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WebInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebPaymentMethod" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "last4" TEXT,
    "expiry" TEXT,
    "balanceAmount" DOUBLE PRECISION,
    "balanceCurrency" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WebPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebFavoriteRoute" (
    "id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "originCode" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationCode" TEXT NOT NULL,
    "fromPriceAmount" DOUBLE PRECISION NOT NULL,
    "fromPriceCurrency" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WebFavoriteRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebNotification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "href" TEXT,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WebNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebNotificationPreference" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "categories" JSONB NOT NULL,

    CONSTRAINT "WebNotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebTripTracking" (
    "reference" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "operatorName" TEXT NOT NULL,
    "operatorMark" TEXT NOT NULL,
    "operatorColor" TEXT NOT NULL,
    "vehicleName" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "originCode" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progressPct" INTEGER NOT NULL,
    "departAt" TEXT NOT NULL,
    "etaAt" TEXT NOT NULL,
    "distanceTotalKm" INTEGER NOT NULL,
    "speedKmh" INTEGER NOT NULL,
    "path" JSONB NOT NULL,
    "waypoints" JSONB NOT NULL,

    CONSTRAINT "WebTripTracking_pkey" PRIMARY KEY ("reference")
);
