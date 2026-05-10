FROM oven/bun:1-slim AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

ENV NODE_ENV=production
ENV BETTER_AUTH_URL=http://localhost:3000
ENV VITE_APP_URL=http://localhost:3000

# DO NOT set BETTER_AUTH_SECRET here — pass it at runtime.
# DO NOT set GITHUB_CLIENT_SECRET here.

RUN groupadd -r -g 1001 appuser && useradd -r -u 1001 -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

CMD ["bun", "dist/server/server.js"]
