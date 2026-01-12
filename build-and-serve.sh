#!/bin/bash
set -e

echo "🏗️  Building QueueGo..."
echo ""

# Build frontend
echo "📦 Building frontend..."
cd packages/frontend
bun install
bun run build
echo "✅ Frontend built successfully"
echo ""

# Copy frontend to backend
echo "📋 Copying frontend build to backend..."
cd ../backend
rm -rf dist/client
mkdir -p dist
cp -r ../frontend/dist/client dist/client
echo "✅ Frontend copied to backend/dist/client"
echo ""

# Start backend
echo "🚀 Starting backend server..."
bun run src/index.ts
