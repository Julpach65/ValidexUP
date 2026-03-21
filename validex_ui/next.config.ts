import type { NextConfig } from "next";

// En Docker, el backend es accesible por el nombre del servicio 'backend'.
// En desarrollo local, sigue apuntando a localhost:8000.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig = {
  // Modo standalone: genera una imagen de produccion ultraligera (~150MB).
  // Necesario para el build de Docker. No afecta el modo de desarrollo local.
  output: "standalone",

  // Ignorar errores de validación durante el build de producción para Docker
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Proxy dinamico: emula a Caddy en modo local (npm run dev) para evitar 404 sin romper AWS
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      }
    ];
  },

  // Estabilizacion del build en entornos Docker
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
