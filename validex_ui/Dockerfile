# ===================================================================
# Dockerfile: Validex UP - Frontend (Next.js)
# ===================================================================

# Etapa 1: Instalacion de dependencias de Node
FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --only=production

# ===================================================================
# Etapa 2: Construccion del proyecto Next.js
# ===================================================================
FROM node:22-alpine AS builder

WORKDIR /app
# Instalamos todas las dependencias (dev + prod) para el build
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# NEXT_PUBLIC_API_URL removido. Resolucion de URLs dinamica via Proxy Caddy.
# Aumentar memoria de Node para evitar fallos del worker
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Habilitar la salida standalone de Next.js (imagen final mucho mas ligera)
RUN npm run build

# ===================================================================
# Etapa 3: Imagen de produccion (ultra-ligera, ~150MB vs ~1GB)
# ===================================================================
FROM node:20-alpine AS production

# Crear usuario no-root para seguridad (sintaxis Alpine)
RUN addgroup --gid 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nextjs

WORKDIR /app

# Copiar SOLO los artefactos necesarios del stage de build
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Variables de entorno de Next.js para produccion
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck del frontend
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
