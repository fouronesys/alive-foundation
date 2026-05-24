# Alive Foundation — Festival de la Inclusión 2026

Web app del NGO Alive Foundation (RD) para gestionar patrocinios del Festival de la Inclusión 2026. El admin genera enlaces únicos de invitación; cada patrocinador entra al enlace, selecciona un plan y confirma su patrocinio.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — corre el API server (puerto 5000 en local Replit)
- `pnpm --filter @workspace/alive-foundation run dev` — corre el frontend Vite
- `pnpm run typecheck` — typecheck completo de todo el workspace
- `pnpm run build` — typecheck + build de todos los paquetes
- `pnpm --filter @workspace/db run push` — push de cambios al schema (solo dev)
- Env requeridas: `SESSION_SECRET` (admin), `ADMIN_PASSWORD`. Opcional: `DATABASE_FILE` (default `./data/alive-foundation.db`).

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: SQLite (libSQL) + Drizzle ORM (archivo único, persiste en `./data/`)
- Frontend: React 19 + Vite 7 + Tailwind 4 + framer-motion + wouter
- Validación: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (desde OpenAPI spec)
- Build API: esbuild (ESM bundle único)

## Despliegue en CapRover (VPS externo)

El proyecto está empacado como un **único contenedor Docker** donde Express sirve:
- `/api/*` → rutas del API server
- todo lo demás → frontend Vite estático con SPA fallback

### Archivos clave
- `Dockerfile` — build multi-stage (builder + runtime). Compila el frontend y el API, deja solo lo necesario en la imagen final.
- `captain-definition` — descriptor de CapRover que apunta al Dockerfile.
- `.dockerignore` — excluye node_modules, dist, .git, .local, etc.

### Pasos en CapRover

1. **Crear la app** en el dashboard de CapRover (ej: `alive-foundation`).
2. **Persistent Directory**: en _App Configs → Persistent Directories_ agrega:
   - Path in App: `/app/data`
   - Label: `alive-foundation-data`
   (Aquí vive el archivo SQLite; sin esto se pierde la BD en cada redeploy.)
3. **Environment Variables** (App Configs → Environment Variables):
   - `SESSION_SECRET` — string aleatorio largo (genera con `openssl rand -hex 32`)
   - `ADMIN_PASSWORD` — clave del admin
   - `NODE_ENV=production` (ya está en el Dockerfile pero no estorba)
4. **HTTP Settings**:
   - Container HTTP Port: `80`
   - Habilita HTTPS y _Force HTTPS_ (necesario porque las cookies de sesión van con `secure: true` + `sameSite: none`)
   - Conecta el dominio `alivefoundationrd.com`.
5. **Deploy** desde el repo de GitHub:
   - _Deployment → Method 3 (Deploy from GitHub)_, o usa _Method 1_ (tarball) si prefieres CLI manual.
   - El repo está en `github.com/fouronesys/alive-foundation`.

### Variables que el contenedor maneja solo
- `PORT=80` — Express escucha aquí dentro del contenedor.
- `STATIC_DIR=/app/artifacts/alive-foundation/dist/public` — desde dónde se sirve el frontend.
- `DATABASE_FILE=/app/data/alive-foundation.db` — SQLite persistente.
- `BASE_PATH=/` — base de Vite (se usa solo en build).

### Probar la imagen localmente (opcional)
```bash
docker build -t alive-foundation .
docker run -p 8080:80 \
  -e SESSION_SECRET=dev-secret-change-me \
  -e ADMIN_PASSWORD=dev123 \
  -v $(pwd)/data:/app/data \
  alive-foundation
# Abre http://localhost:8080
```

## Where things live

- `artifacts/alive-foundation/` — frontend Vite (React + Tailwind)
- `artifacts/api-server/` — Express API (esbuild bundle)
- `artifacts/mockup-sandbox/` — sandbox de componentes (solo dev, NO se despliega)
- `lib/db/` — schema Drizzle + cliente libSQL
- `lib/api-spec/` — OpenAPI spec (fuente de verdad)
- `lib/api-zod/`, `lib/api-client-react/` — generados desde OpenAPI

## Architecture decisions

- **Single container, dos servicios**: Express sirve el SPA en producción (vía `STATIC_DIR`) para evitar tener dos apps en CapRover. En Replit cada artifact corre en su propio workflow.
- **SQLite + persistent volume**: simple, sin servidor adicional. El path es relativo (`./data/`) para que funcione idéntico en Replit y Docker.
- **Cookies de sesión cross-site**: `sameSite: "none"` + `secure: true` porque originalmente la preview de Replit es un iframe cross-site. CapRover requiere HTTPS para que esto siga funcionando.
- **Frontend animado one-shot reusable**: `AnimatedLogo` tiene dos modos (`loop`/`oneshot`) compartiendo el mismo motor interno; se usa en el hero del landing y como splash de carga en `/invitacion/:token`.

## Product

- Landing público con quiénes somos, plan del festival, equipo, videos.
- `/admin` — login + dashboard para generar/listar invitaciones, ver estadísticas (totales, % confirmados, RD$ recaudados).
- `/invitacion/:token` — página personalizada por sponsor para elegir plan (Comunidad, Inclusión, Impacto, En Especie) y confirmar.

## User preferences

- Comunicación en español.
- Branding obligatorio: naranja `#F5821F`, aqua `#00B5CC`, amarillo `#F5C400`, navy `#1A2F4E`.
- Slogan: _"haciendo de la inclusión una realidad"_.
- Animaciones: framer-motion (no GSAP). El usuario rechaza animaciones genéricas tipo "halo/pulso simple".

## Gotchas

- **Replit**: cada artifact tiene su propio workflow; no correr `pnpm dev` en la raíz.
- **CapRover**: si no se configura el persistent directory `/app/data`, la BD se borra en cada redeploy.
- **HTTPS obligatorio en prod**: las cookies de sesión no se envían sin él.
- **Asset paths**: usar `@assets/...` y `import.meta.env.BASE_URL` para rutas estáticas en el frontend.

## Pointers

- Ver el skill `pnpm-workspace` para estructura del workspace, TypeScript, etc.
