/**
 * Authentication Middleware
 * 
 * Use this to PROTECT routes that require authentication.
 * Checks cookie, validates user exists, adds user to context.
 * 
 * Usage:
 *   export const myProtectedRoute = authMiddleware
 *     .input(z.object({ ... }))
 *     .handler(async ({ input, context }) => {
 *       const userId = context.user.id // user is guaranteed to exist
 *     })
 */

import { os } from "@orpc/server";
import { getCookie } from "@orpc/server/helpers";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export type AuthContext = {
    user: {
        id: number;
        email: string;
        name: string;
    };
};

const authBase = os
    .$context<RequestHeadersPluginContext>()
    .errors({
        UNAUTHORIZED: {
            message: 'Not authenticated',
        },
    });

/**
 * authMiddleware - Makes routes protected (requires login)
 */
export const authMiddleware = authBase
    .middleware(async ({ context, next, errors }) => {
        // Check cookie
        const authToken = getCookie(context.reqHeaders, 'auth_token');

        if (!authToken) {
            throw errors.UNAUTHORIZED({
                message: 'Not authenticated',
            });
        }

        // Parse token (format: userId:randomToken)
        const [userIdStr] = authToken.split(':');
        const userId = parseInt(userIdStr || '');

        if (!userId || isNaN(userId)) {
            throw errors.UNAUTHORIZED({
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
            throw errors.UNAUTHORIZED({
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
