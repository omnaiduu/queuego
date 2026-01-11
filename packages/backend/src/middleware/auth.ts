/**
 * Authentication Middleware for oRPC
 * 
 * Provides authentication checking that can be chained to procedures.
 * Reads auth cookie, validates user, and adds to context.
 */

import { os } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { getCookie } from "@orpc/server/helpers";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Auth context extension
 * Adds authenticated user to the context
 */
export type AuthContext = {
    user: {
        id: number;
        email: string;
        name: string;
    };
};

/**
 * Authentication Middleware
 * 
 * Reads the 'auth_token' cookie (format: userId:randomToken)
 * Validates user exists and adds to context
 * 
 * Usage:
 *   const protectedProcedure = authMiddleware
 *     .input(z.object({ ... }))
 *     .handler(async ({ input, context }) => {
 *       // context.user is available here
 *     });
 */
export const authMiddleware = os
    .$context<RequestHeadersPluginContext>()
    .middleware(async ({ context, next }) => {
        // Get cookies from request headers
        const authToken = getCookie(context.reqHeaders, 'auth_token');

        if (!authToken) {
            throw new ORPCError('UNAUTHORIZED', {
                message: 'Not authenticated',
            });
        }

        // Parse token (format: userId:randomToken)
        const [userIdStr] = authToken.split(':');
        const userId = parseInt(userIdStr || '');

        if (!userId || isNaN(userId)) {
            throw new ORPCError('UNAUTHORIZED', {
                message: 'Invalid auth token',
            });
        }

        // Fetch user from database
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) {
            throw new ORPCError('UNAUTHORIZED', {
                message: 'User not found',
            });
        }

        // Add user to context and continue
        return next({
            context: {
                user,
            },
        });
    });
