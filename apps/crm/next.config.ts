import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Permite abrir el dev server desde otros equipos de la red local (IP en vez de
  // localhost). Sin esto, Next 16 bloquea HMR/chunks cross-origin y la página queda
  // sin hidratar. Cubre rangos LAN típicos.
  allowedDevOrigins: ["192.168.125.162", "192.168.*.*", "10.*.*.*", "172.*.*.*"],
  // Importa los paquetes del workspace (TS fuente) sin pre-compilarlos.
  transpilePackages: ["@vialta/types", "@vialta/ui"],
};

export default nextConfig;
