FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install production dependencies only
FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Final minimal image — no build step needed, Bun runs TS directly
FROM oven/bun:1-alpine AS release
WORKDIR /app
COPY --from=prod-deps /app/node_modules node_modules
COPY package.json bun.lock tsconfig.json ./
COPY src ./src

EXPOSE 4060
CMD ["bun", "run", "src/index.ts"]
