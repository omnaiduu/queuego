# QueueGo Production Dockerfile
# Build frontend locally first: cd packages/frontend && bun run build
FROM oven/bun:1

WORKDIR /app

# Copy workspace package files
COPY package.json ./
COPY packages/backend/package.json ./packages/backend/

# Install backend dependencies only
WORKDIR /app/packages/backend
RUN bun install --frozen-lockfile --production

# Copy backend source (all files including drizzle migrations)
COPY packages/backend ./

# Copy pre-built frontend from local build
COPY packages/frontend/dist/client ./dist/client

# Verify frontend files exist
RUN ls -la dist/client && echo "✅ Frontend files ready" || echo "⚠️ No frontend files found"

# Verify migrations exist
RUN ls -la drizzle && echo "✅ Migrations ready" || echo "⚠️ No migrations found"

# Expose port
EXPOSE 4000

# Start backend server (serves frontend + API, runs migrations)
CMD ["bun", "run", "src/index.ts"]
