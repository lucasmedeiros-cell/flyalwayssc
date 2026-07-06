# Despliegue del backend (Vialta API + Postgres)

Guía para poner en producción el backend NestJS + Prisma + Postgres, y conectar
el CRM (y la web) para que usen **datos reales** en vez del modo mock.

- **Frontends ya desplegados en Netlify:**
  - Web: `https://flyalwayssc.netlify.app`
  - CRM: `https://flyalwayssc-crm.netlify.app` (hoy en modo **mock**, login `admin`/`admin`)
- **Este backend NO va en Netlify** (Netlify es serverless; NestJS es un servidor
  de larga duración). Va en Render / Railway / Fly, con Postgres gestionado.

Artefactos ya listos en el repo:
- `apps/api/Dockerfile` — imagen de producción (build desde la raíz del monorepo).
- `render.yaml` — blueprint que crea **Postgres + API** de una.
- `.dockerignore` — contexto de build liviano.

---

## Variables de entorno del API

| Variable | Ejemplo / valor | Notas |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/flyalways` | La da el proveedor de Postgres |
| `PORT` | `4000` | Puerto de escucha |
| `WEB_ORIGIN` | `https://flyalwayssc.netlify.app,https://flyalwayssc-crm.netlify.app` | CORS (coma-separado) |
| `JWT_ACCESS_SECRET` | *(aleatorio largo)* | Firmar access token |
| `JWT_REFRESH_SECRET` | *(aleatorio largo)* | Firmar refresh token |
| `JWT_ACCESS_TTL` | `8h` | |
| `JWT_REFRESH_TTL` | `30d` | |

Generar un secreto fuerte: `openssl rand -base64 48`

---

## Opción A — Render (recomendada, un click con el blueprint)

1. Entrar a <https://dashboard.render.com> → **New +** → **Blueprint**.
2. Conectar el repo `lucasmedeiros-cell/flyalwayssc` y elegir la rama `main`.
3. Render lee `render.yaml` y crea:
   - la base **`flyalways-db`** (Postgres),
   - el servicio web **`flyalways-api`** (Docker, con `DATABASE_URL` ya enlazada
     y los `JWT_*` autogenerados).
4. Al primer deploy, el contenedor corre `prisma migrate deploy` solo (crea las
   tablas). Cuando termine, el healthcheck `/api/health` debe dar `200`.
5. **Sembrar datos demo** (una vez): en el servicio `flyalways-api` → pestaña
   **Shell** →
   ```bash
   cd /repo/apps/api && npx prisma db seed
   ```
   > Si `db seed` no está configurado en package.json, usar:
   > `cd /repo/apps/api && npx ts-node prisma/seed.ts` (requiere devDeps; ya están en la imagen).
6. La API queda en `https://flyalways-api.onrender.com` → base `.../api`.

⚠️ **Free tier de Render:** el Postgres gratuito **expira ~30 días** y el web
gratuito **hiberna** tras inactividad (primer request lento). Para algo estable,
subir el plan de la BD o usar Supabase (Opción B).

---

## Opción B — Postgres en Supabase + API en Railway (más estable en free)

1. **Supabase** (<https://supabase.com>): crear proyecto → copiar la
   *Connection string* (modo "Session"/pooler) → esa es `DATABASE_URL`.
2. **Railway** (<https://railway.app>): New Project → Deploy from GitHub →
   este repo. En Settings del servicio:
   - Root/Dockerfile: `apps/api/Dockerfile` (build context = raíz).
   - Variables: pegar todas las de la tabla de arriba (`DATABASE_URL` de Supabase).
3. Deploy. Migraciones corren solas al arrancar (CMD del Dockerfile).
4. Sembrar: en la shell del servicio, `cd /repo/apps/api && npx ts-node prisma/seed.ts`.

---

## Conectar el CRM (y la web) al API

Una vez la API esté viva (ej. `https://flyalways-api.onrender.com`):

1. En el **sitio del CRM** en Netlify, setear variables y redeploy:
   ```bash
   netlify env:set NEXT_PUBLIC_DATA_SOURCE api --filter crm
   netlify env:set NEXT_PUBLIC_API_URL "https://flyalways-api.onrender.com/api" --filter crm
   ```
   Luego disparar un redeploy del sitio del CRM.
2. (Opcional) Igual para la **web** si querés que use datos reales.
3. Verificar que `WEB_ORIGIN` del API incluya los dominios de Netlify (ya está en
   `render.yaml`). Si cambian, actualizarlo.

### Credenciales en modo API
En modo API el login usa los **usuarios sembrados** en la BD (bcrypt), **no**
`admin`/`admin`. Con el seed por defecto la contraseña es **`demo1234`** y el
usuario admin es el email sembrado (p. ej. `ana@flyalways.bo`). El formulario de
login del CRM acepta email o usuario según cómo lo resuelva `crm-auth`.

---

## Probar la API desplegada

```bash
curl https://flyalways-api.onrender.com/api/health            # {"status":"ok",...}
curl -X POST https://flyalways-api.onrender.com/api/crm/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@flyalways.bo","password":"demo1234"}'
```

Docs Swagger: `https://flyalways-api.onrender.com/api/docs`
