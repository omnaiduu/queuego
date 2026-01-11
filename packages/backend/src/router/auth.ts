/**
 * Authentication Procedures
 * 
 * Handles user registration, login, logout, and current user retrieval.
 * Uses cookie-based authentication (no session table).
 */

import { os } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { setCookie, deleteCookie } from "@orpc/server/helpers";
import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import * as z from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../lib/password";
import { authMiddleware } from "../middleware/auth";

/**
 * Base procedure with response headers context
 */
const authBase = os.$context<ResponseHeadersPluginContext>();

/**
 * Cookie configuration
 * Works in both dev (cross-origin) and prod (same-origin)
 */
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false, // Set to false for local HTTP development
    sameSite: 'lax' as const, // lax works for local dev with same top-level site
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
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
    .handler(async ({ input, context }) => {
        // Check if user exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);

        if (existingUser) {
            throw new ORPCError('CONFLICT', {
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
            throw new ORPCError('INTERNAL_SERVER_ERROR', {
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
    .handler(async ({ input, context }) => {
        // Find user
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);

        if (!user) {
            throw new ORPCError('UNAUTHORIZED', {
                message: 'Invalid email or password',
            });
        }

        // Verify password
        const isValid = await verifyPassword(input.password, user.passwordHash);

        if (!isValid) {
            throw new ORPCError('UNAUTHORIZED', {
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
        // Delete cookie
        deleteCookie(context.resHeaders, 'auth_token', { path: '/' });

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
