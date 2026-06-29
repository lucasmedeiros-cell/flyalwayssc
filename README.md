# Vialta

Plataforma web **premium** para la venta y administración de **transporte multimodal**:

- ✈️ Aéreo
- 🚌 Terrestre (buses)
- 🚆 Ferroviario (trenes)
- 🚐 Flotas privadas

Identidad visual y código **100 % originales**. Inspirada únicamente en buenas prácticas
de UX, navegación y fluidez de plataformas de viaje líderes — sin copiar marca, imágenes,
textos ni código de terceros.

## Arquitectura (monorepo)

```
vialta/
├── apps/
│   ├── web/     Next.js 16 + React 19 + Tailwind v4 + Framer Motion  (frontend)
│   └── api/     NestJS + Prisma + PostgreSQL                          (backend)
└── packages/
    └── types/   Modelos de dominio compartidos (TypeScript)
```

Principios: **API First**, modular, escalable, multiempresa, multisucursal,
multilenguaje, multimoneda, SEO/SSR, PWA-ready.

## Estado actual — Hito 1

- [x] Monorepo con npm workspaces
- [x] Tipos de dominio compartidos
- [x] Sistema de diseño + modo claro/oscuro (identidad "Vialta")
- [x] Capa de servicios con datos mock (swap a API real sin reescribir UI)
- [x] Home: hero + selector de transporte + buscador inteligente
- [x] Scaffold backend NestJS + Prisma (sin bloquear la UI)

> El frontend consume una **capa mock** con interfaz estable. Cuando la API NestJS esté
> lista, se cambia el adaptador sin tocar componentes.

## Desarrollo

```bash
npm install          # instala todo el workspace
npm run dev          # arranca apps/web en http://localhost:3000
npm run dev:api      # arranca apps/api (cuando tenga deps instaladas)
```

## Tecnología

**Frontend:** Next.js, React, TypeScript, TailwindCSS, Framer Motion, next-themes
**Backend:** Node.js, NestJS, REST/GraphQL, Prisma
**Datos:** PostgreSQL, Redis (cache/realtime), Supabase (opcional)

## Roadmap

- [x] Hito 2 — Resultados con filtros laterales dinámicos + ordenamientos
- [x] Hito 3 — Wizard de reserva (7 pasos) + selección visual de asientos
- [x] Hito 4 — Perfil de usuario (historial, tickets, facturas, pagos)
- [x] Hito 5 — Panel de operadores (vehículos, rutas, horarios, precios)
- [x] Hito 6 — Dashboard de administrador + analytics en tiempo real
- Hito 7 — Pagos (Stripe/PayPal/Mercado Pago) pendiente · **Mapas/GPS y Notificaciones hechos**
