/**
 * Authentication Procedures
 * 
 * Handles user registration, login, logout, and current user retrieval.
 * Uses cookie-based authentication (no session table).
 */

import { os } from "@orpc/server";
import { setCookie, deleteCookie } from "@orpc/server/helpers";
import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import * as z from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../lib/password";
import { authMiddleware } from "../middleware/auth";

/**
 * Base procedure with response headers context and type-safe errors
 */
const authBase = os
    .$context<ResponseHeadersPluginContext>()
    .errors({
        UNAUTHORIZED: {
            message: 'Authentication failed',
        },
        CONFLICT: {
            message: 'Resource already exists',
        },
        INTERNAL_SERVER_ERROR: {
            message: 'Internal server error',
        },
    });

/**
 * Cookie configuration
 * Works in both dev (cross-origin) and prod (same-origin)
 */
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS in production, HTTP in dev
    sameSite: 'lax' as const, // lax works for local dev with same top-level site
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
};

/**
 * Cookie options for deletion (without maxAge)
 */
const DELETE_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

/**
 * Generate auth token
 * Format: userId:randomToken
 */
function generateAuthToken(userId: number): string {
    const randomToken = crypto.randomUUID();
    return `${userId}:${randomToken}`;
}

/**
 * Register - Create new user account
 */
export const register = authBase
    .input(
        z.object({
            email: z.string().email(),
            password: z.string().min(6),
            name: z.string().min(1),
        })
    )
    .handler(async ({ input, context, errors }) => {
        // Check if user exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);

        if (existingUser) {
            throw errors.CONFLICT({
                message: 'Email already registered',
            });
        }

        // Hash password
        const passwordHash = await hashPassword(input.password);

        // Create user
        const [newUser] = await db
            .insert(users)
            .values({
                email: input.email,
                name: input.name,
                passwordHash,
            })
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
            });

        if (!newUser) {
            throw errors.INTERNAL_SERVER_ERROR({
                message: 'Failed to create user',
            });
        }

        // Generate auth token
        const authToken = generateAuthToken(newUser.id);

        // Set cookie
        setCookie(context.resHeaders, 'auth_token', authToken, COOKIE_OPTIONS);

        return {
            user: newUser,
            message: 'Registration successful',
        };
    });

/**
 * Login - Authenticate existing user
 */
export const login = authBase
    .input(
        z.object({
            email: z.string().email(),
            password: z.string(),
        })
    )
    .handler(async ({ input, context, errors }) => {
        // Find user
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);

        if (!user) {
            throw errors.UNAUTHORIZED({
                message: 'Invalid email or password',
            });
        }

        // Verify password
        const isValid = await verifyPassword(input.password, user.passwordHash);

        if (!isValid) {
            throw errors.UNAUTHORIZED({
                message: 'Invalid email or password',
            });
        }

        // Generate auth token
        const authToken = generateAuthToken(user.id);

        // Set cookie
        setCookie(context.resHeaders, 'auth_token', authToken, COOKIE_OPTIONS);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            message: 'Login successful',
        };
    });

/**
 * Logout - Clear authentication
 */
export const logout = authBase
    .use(authMiddleware)
    .handler(async ({ context }) => {
        // Delete cookie with same options as when it was set
        deleteCookie(context.resHeaders, 'auth_token', DELETE_COOKIE_OPTIONS);

        return {
            message: 'Logout successful',
        };
    });

/**
 * Get Current User - Returns authenticated user info
 */
export const getCurrentUser = authBase
    .use(authMiddleware)
    .handler(async ({ context }) => {
        return {
            user: context.user,
        };
    });
