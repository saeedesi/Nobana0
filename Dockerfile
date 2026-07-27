# syntax=docker/dockerfile:1.7
# Nobana — production image (Next.js standalone + Prisma, built with pnpm)
#
# Debian bookworm (not alpine) on purpose: Prisma's query engine is a native
# binary and bookworm's OpenSSL 3.0 matches the `debian-openssl-3.0.x`
# binaryTarget in prisma/schema.prisma. musl would need a different target.

# ─────────────────────────── base ───────────────────────────
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    NEXT_TELEMETRY_DISABLED=1 \
    CI=true
# openssl: required by the Prisma query engine at runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app

# ─────────────────────────── deps ───────────────────────────
# Only the files that affect resolution, so this layer caches across code edits.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store --ignore-scripts

# ────────────────────────── builder ─────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generates into src/generated/prisma (see prisma/schema.prisma).
# --ignore-scripts above skipped the postinstall, so run it explicitly.
RUN pnpm prisma generate
RUN pnpm build

# ───────────────────────── migrator ─────────────────────────
# Separate image that keeps the Prisma CLI, for `migrate deploy` on release.
# The runtime image below deliberately has no node_modules.
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
CMD ["pnpm", "prisma", "migrate", "deploy"]

# ────────────────────────── runner ──────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# `standalone` ships its own pruned node_modules and server.js.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# User-uploaded images (admin panel writes here); mounted as a volume in compose.
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
