import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Importa los paquetes del workspace (TS fuente) sin pre-compilarlos.
  transpilePackages: ["@vialta/types", "@vialta/ui"],
};

export default nextConfig;
