# Copyright (c) 2026 MPK SMK Negeri 13 Bandung. Created by Davin Maritza.
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install

# Copy source and build
COPY . .
RUN bun run build

# Runner stage
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["bun", "run", "start"]
