# syntax=docker/dockerfile:1
# Imagen de producción del backend Vialta API (NestJS + Prisma + Postgres).
# El contexto de build es la RAÍZ del monorepo (para resolver el workspace npm).
#   docker build -f apps/api/Dockerfile -t vialta-api .

# ----------------------------------------------------------------------------
# Builder: instala deps del workspace, genera Prisma Client y compila la API.
# ----------------------------------------------------------------------------
FROM node:20-bookworm-slim AS builder
WORKDIR /repo
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# Manifiestos primero para cachear la instalación. Se copian los package.json de
# cada workspace para que `npm ci` resuelva el monorepo con el lockfile raíz.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/crm/package.json apps/crm/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN npm ci

# Código de la API + generación del cliente Prisma + build de Nest.
COPY apps/api apps/api
RUN npm run prisma:generate --workspace api \
 && npm run build --workspace api

# ----------------------------------------------------------------------------
# Runner: imagen final. Aplica migraciones y arranca la API compilada.
# ----------------------------------------------------------------------------
FROM node:20-bookworm-slim AS runner
WORKDIR /repo/apps/api
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

# node_modules del workspace (hoisted en la raíz) + build + prisma.
COPY --from=builder /repo/node_modules /repo/node_modules
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/prisma ./prisma
COPY --from=builder /repo/apps/api/package.json ./package.json

# La API escucha en $PORT (default 4000) y expone /api y /api/health.
EXPOSE 4000

# En el arranque: aplica migraciones pendientes (idempotente) y levanta la API.
# El seed NO corre automáticamente (ver DEPLOY.md) para no pisar datos.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
