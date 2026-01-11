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

console.log("🚀 Backend application starting...");

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
                // Allow localhost and 127.0.0.1 on port 3000
                const allowed = [
                    'http://localhost:3000',
                    'http://127.0.0.1:3000',
                ];
                return origin && allowed.includes(origin) ? origin : null;
            },
            allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
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
 * Non-matching requests return a 404 response.
 */
const server = Bun.serve({
    port: 4000,
    async fetch(req) {
        console.log(`📥 ${req.method} ${req.url}`);

        const result = await handler.handle(req);

        if (!result.matched) {
            // Add CORS headers even for 404 responses
            const origin = req.headers.get('origin');
            const allowed = ['http://localhost:3000', 'http://127.0.0.1:3000'];

            const headers = new Headers();
            if (origin && allowed.includes(origin)) {
                headers.set('Access-Control-Allow-Origin', origin);
                headers.set('Access-Control-Allow-Credentials', 'true');
                headers.set('Access-Control-Allow-Methods', 'GET, HEAD, PUT, POST, DELETE, PATCH');
                headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
            }

            return new Response("404: No procedure matched", {
                status: 404,
                headers
            });
        }

        return result.response;
    },
});

console.log(`✅ Backend running at http://localhost:${server.port}`);
console.log(`📡 RPC endpoint ready for procedure calls`);
