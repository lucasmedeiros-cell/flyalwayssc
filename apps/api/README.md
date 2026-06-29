# Vialta API

Backend NestJS para la plataforma de transporte multimodal.

## Estructura

```
src/
├── main.ts            Bootstrap (CORS, validación, Swagger en /api/docs)
├── app.module.ts      Composición de módulos
├── prisma/            PrismaService global (arranca aunque no haya DB)
├── health/            GET /api/health
├── catalog/           GET /api/catalog/modes
├── operators/         GET /api/operators  ·  GET /api/operators/:id
└── trips/             GET /api/trips/search  ·  GET /api/trips/:id
```

`prisma/schema.prisma` define el modelo: empresas (multiempresa), sucursales
(multisucursal), lugares, vehículos, rutas, viajes, asientos, usuarios, reservas,
pasajeros y pagos.

## Puesta en marcha

```bash
cp .env.example .env            # configura DATABASE_URL (Postgres o Supabase)
npm run prisma:generate         # genera el cliente Prisma
npm run prisma:migrate          # crea las tablas (requiere DB)
npm run db:seed                 # datos de ejemplo (requiere DB)
npm run start:dev               # API en http://localhost:4000/api
```

> El API arranca aunque no haya base de datos: los endpoints que consultan
> Postgres fallarán hasta configurar `DATABASE_URL`, pero `/api/health` y
> `/api/catalog/modes` responden siempre.

## Conexión con el frontend

El frontend (`apps/web`) consume hoy una **capa mock** con la interfaz
`DataSource`. Cuando este API esté poblado, se implementará un `HttpDataSource`
que llame a estos endpoints y se cambiará el adaptador en
`apps/web/lib/services/index.ts` — sin tocar componentes.
