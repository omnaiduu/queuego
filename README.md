# QueueGo - Queue Management System

Full-stack queue management platform built with Bun, React, and SQLite.

## 🚀 Development

```bash
# Install dependencies
bun install

# Terminal 1 - Backend (port 4000)
cd packages/backend && bun run dev

# Terminal 2 - Frontend (port 3000)
cd packages/frontend && bun run dev
```

Visit: http://localhost:3000

## 🐳 Production Deployment

### 1. Build & Push to Registry

```bash
# Build frontend
cd packages/frontend && bun run build && cd ../..

# Login to GitHub Container Registry
echo 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 | docker login ghcr.io -u omnaiduu --password-stdin

# Build and push (ARM64 for AWS EC2)
docker buildx rm multiarch 2>/dev/null || true
docker buildx create --name multiarch --use
docker buildx build \
  --platform linux/arm64 \
  -t ghcr.io/omnaiduu/queuego:latest \
  --push \
  .
```

### 2. Server Setup (One-time)

```bash
# Install Docker (Amazon Linux)
sudo yum update -y && sudo yum install docker -y
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -a -G docker ec2-user && newgrp docker

# Create directories
mkdir -p ~/data ~/uploads

# Login to registry
echo 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 | docker login ghcr.io -u omnaiduu --password-stdin
```

### 3. Deploy

```bash
# Pull image
docker pull ghcr.io/omnaiduu/queuego:latest

# Run
docker run -d \
  --name queuego \
  -p 4000:4000 \
  -e DATABASE_URL=file:./db/queuego.db \
  -e NODE_ENV=production \
  -e WHATSAPP_TOKEN=EAAHnadNEQ9IBQVZBNZAvKzgnEAJ3cnduJo0lNVBrZCCTQbILQ4cOjkbpXZCx1NdQ2yealUqrKSkc8zHGr92gFZAlz2xekQoYvEC6iX2Rco5pPXZBrpVZAQCSG591xYRdhHnPGUW7pLdt4wl1ByzpRaQ2d6lZAskM1sYf4NhWHubKj34IxRBeuVsWipvl0Dqd9AZDZD \
  -e WHATSAPP_PHONE_ID=391311200731640 \
  -v ~/data:/app/packages/backend/db \
  -v ~/uploads:/app/packages/backend/uploads \
  --restart unless-stopped \
  ghcr.io/omnaiduu/queuego:latest

# Check logs
docker logs -f queuego
```

### 4. Update Production

```bash
# Pull latest
docker pull ghcr.io/omnaiduu/queuego:latest

# Stop and remove old container
docker stop queuego && docker rm queuego

# Run new version
docker run -d \
  --name queuego \
  -p 4000:4000 \
  -e DATABASE_URL=file:./db/queuego.db \
  -e NODE_ENV=production \
  -e WHATSAPP_TOKEN=EAAHnadNEQ9IBQVZBNZAvKzgnEAJ3cnduJo0lNVBrZCCTQbILQ4cOjkbpXZCx1NdQ2yealUqrKSkc8zHGr92gFZAlz2xekQoYvEC6iX2Rco5pPXZBrpVZAQCSG591xYRdhHnPGUW7pLdt4wl1ByzpRaQ2d6lZAskM1sYf4NhWHubKj34IxRBeuVsWipvl0Dqd9AZDZD \
  -e WHATSAPP_PHONE_ID=391311200731640 \
  -v ~/data:/app/packages/backend/db \
  -v ~/uploads:/app/packages/backend/uploads \
  --restart unless-stopped \
  ghcr.io/omnaiduu/queuego:latest
```

## 🏠 Local Build & Serve

```bash
# Build frontend, copy to backend, and start server
bun run build-and-serve
```

## 🐳 Local Docker Testing (Optional)

Test Docker build locally before pushing to production:

```bash
# Build frontend first
cd packages/frontend && bun run build && cd ../..

# Start with Docker Compose
docker-compose up --build

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Accesses at: http://localhost:4000

## 📁 Project Structure

```
packages/
├── backend/              # Bun + oRPC API (port 4000)
│   ├── src/
│   │   ├── router/      # API routes
│   │   ├── middleware/  # Auth
│   │   ├── db/          # Drizzle ORM
│   │   └── index.ts     # Server + static serving
│   ├── db/              # SQLite database (mounted)
│   ├── uploads/         # User uploads (mounted)
│   └── dist/client/     # Frontend served from here
└── frontend/            # React + TanStack Router (port 3000)
    └── dist/client/     # Build output
```

## � Environment Variables

```bash
# Database (relative path from backend directory)
DATABASE_URL=file:./db/queuego.db

# WhatsApp Business API
WHATSAPP_TOKEN=EAAHnadNEQ9IBQVZBNZAvKzgnEAJ3cnduJo0lNVBrZCCTQbILQ4cOjkbpXZCx1NdQ2yealUqrKSkc8zHGr92gFZAlz2xekQoYvEC6iX2Rco5pPXZBrpVZAQCSG591xYRdhHnPGUW7pLdt4wl1ByzpRaQ2d6lZAskM1sYf4NhWHubKj34IxRBeuVsWipvl0Dqd9AZDZD
WHATSAPP_PHONE_ID=391311200731640

# Server
NODE_ENV=production
PORT=4000
```

## 💾 Storage Volumes

**Where is the database saved?**

### Local Development:
```
packages/backend/db/queuego.db  ← Database file on your machine
```

### Docker (Local/Production):
```bash
# Volume mount maps host directory → container directory
-v ~/data:/app/packages/backend/db         # Database
-v ~/uploads:/app/packages/backend/uploads # Uploads

# Container writes to: /app/packages/backend/db/queuego.db
# Actually saved to: ~/data/queuego.db (on host machine)
```

**Result:**
- Local dev: `packages/backend/db/queuego.db`
- Docker: `~/data/queuego.db` (persists even after container deletion)
- Production EC2: `~/data/queuego.db` (on server)

## 🗄️ Database Management

**Migrations run automatically on server startup** in all environments.

```bash
cd packages/backend
bun run db:generate     # Generate migrations from schema changes
bun run db:migrate      # Run migrations manually (optional)
bun run db:studio       # Open Drizzle Studio
```

**Note**: When you deploy, migrations are applied automatically when the container starts.

## 🐳 Docker Commands

```bash
docker logs -f queuego          # View logs
docker restart queuego          # Restart
docker stop queuego             # Stop
docker rm queuego               # Remove
docker ps                       # List containers
```

## 🔐 Registry Token

```bash
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
```

## 📄 License

Proprietary - All rights reserved
