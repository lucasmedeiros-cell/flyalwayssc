import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Permite importar el paquete del workspace (TS fuente) sin pre-compilarlo.
  transpilePackages: ["@vialta/types"],
  images: {
    // Fotografía aspiracional optimizada por next/image (AVIF/WebP, sizes responsivos).
    // Las URLs concretas viven en lib/images.ts; si alguna falla, SmartImage cae al gradiente.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
