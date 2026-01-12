/**
 * Backend Server with oRPC
 * 
 * This file sets up the HTTP server using Bun and oRPC.
 * It handles all RPC procedure calls and provides CORS support.
 */

import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin, RequestHeadersPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";
import { onError } from "@orpc/server";
import { router } from "./router";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

console.log("🚀 Backend application starting...");

// Run migrations on startup
try {
    console.log("🔄 Running database migrations...");
    const sqlite = new Database(process.env.DATABASE_URL?.replace('file:', '') || "./db/queuego.db");
    const db = drizzle(sqlite);
    migrate(db, { migrationsFolder: "./drizzle" });
    sqlite.close();
    console.log("✅ Migrations complete!");
} catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
}

/**
 * Create RPC Handler
 * 
 * The handler processes all RPC requests and routes them to the correct procedures.
 * Plugins: CORS support for cross-origin requests (configured for local development)
 * Interceptors: Error logging
 */
const handler = new RPCHandler(router, {
    plugins: [
        new RequestHeadersPlugin(),
        new ResponseHeadersPlugin(),
        new CORSPlugin({
            origin: (origin) => {
                // Allow localhost and 127.0.0.1 on port 3000, plus production same-origin
                const allowed = [
                    'http://localhost:3000',
                    'http://127.0.0.1:3000',
                    'http://localhost:5173', // Vite dev server alternative port
                ];

                // In development, allow any origin from localhost/127.0.0.1
                if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
                    return origin || '*';
                }

                return allowed.includes(origin) ? origin : null;
            },
            allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
            exposeHeaders: ['Set-Cookie'],
            credentials: true,
            maxAge: 86400, // 24 hours
        }),
    ],
    interceptors: [
        onError((error) => {
            console.error("❌ RPC Error:", error);
        }),
    ],
});

/**
 * Bun HTTP Server
 * 
 * Handles incoming HTTP requests and routes them through the RPC handler.
 * If RPC doesn't match, serves pre-rendered static files from dist/client.
 */
const server = Bun.serve({
    port: 4000,
    async fetch(req) {
        console.log(`📥 ${req.method} ${req.url}`);

        const url = new URL(req.url);
        const pathname = url.pathname;

        // Handle RPC requests
        if (pathname.startsWith("/rpc")) {
            const result = await handler.handle(req, { prefix: "/rpc" });
            return result.matched ? result.response : new Response("Not Found", { status: 404 });
        }

        // Handle user uploads
        if (pathname.startsWith("/uploads/")) {
            const filePath = `.${pathname}`;
            const file = Bun.file(filePath);
            if (await file.exists()) {
                return new Response(file, {
                    headers: { "Cache-Control": "public, max-age=31536000" }
                });
            }
        }

        // Serve static files from dist/client
        let filePath = pathname === "/" ? "/index.html" : pathname;

        // Handle directories and trailing slashes
        if (!filePath.endsWith("/") && !filePath.includes(".")) {
            filePath += "/index.html";
        } else if (filePath.endsWith("/")) {
            filePath += "index.html";
        }

        const file = Bun.file(`./dist/client${filePath}`);
        if (await file.exists()) {
            // Add caching for static assets
            let cacheControl: string;

            if (filePath.startsWith("/assets/")) {
                // Hashed assets - cache forever
                cacheControl = "public, max-age=31536000, immutable";
            } else if (filePath.endsWith(".html")) {
                // HTML files - no cache for SPA routing
                cacheControl = "no-cache, no-store, must-revalidate";
            } else if (/\.(webp|mp4|webm|png|jpg|jpeg|ico|svg|gif)$/i.test(filePath)) {
                // Images and media - cache for 1 day
                cacheControl = "public, max-age=86400";
            } else {
                // Other files - short cache
                cacheControl = "public, max-age=3600";
            }

            return new Response(file, {
                headers: { "Cache-Control": cacheControl }
            });
        }

        // SPA Fallback - serve index.html for client-side routing
        const indexFile = Bun.file("./dist/client/index.html");
        if (await indexFile.exists()) {
            return new Response(indexFile, {
                headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }
            });
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`✅ Backend running at http://localhost:${server.port}`);
console.log(`📡 RPC endpoint ready for procedure calls`);
console.log(`🌐 Serving pre-rendered static files from dist/client`);
