import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Versión del sistema expuesta al cliente (se actualiza sola con package.json).
  // Requisito Petrobox #2: mostrar la versión debajo del logo.
  env: { NEXT_PUBLIC_APP_VERSION: version },
  // Permite importar el paquete del workspace (TS fuente) sin pre-compilarlo.
  transpilePackages: ["@vialta/types"],
  images: {
    // Fotografía aspiracional optimizada por next/image (AVIF/WebP, sizes responsivos).
    // Las URLs concretas viven en lib/images.ts; si alguna falla, SmartImage cae al gradiente.
    formats: ["image/avif", "image/webp"],
    // Calidades permitidas (Next 16 exige declararlas para usar `quality`>default).
    // 90 = fotografía nítida en hero/destinos; 75 = thumbnails ligeros.
    qualities: [75, 90],
    // Breakpoints amplios para servir versiones más grandes en pantallas retina
    // (más densidad de píxeles = fotos más nítidas sin reventar el peso).
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1600, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
