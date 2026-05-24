# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# Alive Foundation — single-container deploy (CapRover-ready)
#   • Builds the Vite frontend (artifacts/alive-foundation) to static files
#   • Builds the Express API (artifacts/api-server) to a single esbuild bundle
#   • The Express server serves /api/* + the SPA fallback for everything else
# ---------------------------------------------------------------------------

FROM node:24-bookworm-slim AS builder

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /app

# Copy everything needed by the workspace. .dockerignore keeps this lean.
COPY . .

# Install all workspace deps (frozen lockfile)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build API server (esbuild → artifacts/api-server/dist/index.mjs)
RUN pnpm --filter @workspace/api-server run build

# Build frontend (Vite → artifacts/alive-foundation/dist/public)
ENV NODE_ENV=production
ENV PORT=8080
ENV BASE_PATH=/
RUN pnpm --filter @workspace/alive-foundation run build

# Drop dev dependencies to slim the image we copy from
RUN pnpm prune --prod || true


# ---------------------------------------------------------------------------
# Runtime image — minimal Node runtime + only what's needed to serve the app
# ---------------------------------------------------------------------------
FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=80 \
    STATIC_DIR=/app/artifacts/alive-foundation/dist/public \
    DATABASE_FILE=/app/data/alive-foundation.db

WORKDIR /app

# Bundled API server + its externalized node_modules (e.g. @libsql/client)
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/api-server/node_modules ./artifacts/api-server/node_modules
COPY --from=builder /app/node_modules ./node_modules

# Built static frontend
COPY --from=builder /app/artifacts/alive-foundation/dist/public ./artifacts/alive-foundation/dist/public

# Persistent SQLite database lives here. CapRover should mount a volume on /app/data.
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 80

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
