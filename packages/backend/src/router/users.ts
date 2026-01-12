/**
 * User Procedures
 * 
 * This file defines RPC procedures for user operations.
 * Each procedure can have input validation, middleware, and handlers.
 */

import { os } from "@orpc/server";
import * as z from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword } from "../lib/password";

/**
 * List users - Fetch all users with pagination support
 * Returns up to 100 users per page, ordered by ID
 * Input: limit (max 100), cursor (offset)
 */
export const listUsers = os
    .input(
        z.object({
            limit: z.number().int().min(1).max(100).optional(),
            cursor: z.number().int().min(0).optional(),
        }).optional().default({})
    )
    .handler(async ({ input }) => {
        const allUsers = await db
            .select()
            .from(users)
            .limit(input.limit ?? 10)
            .offset(input.cursor ?? 0);

        return allUsers;
    });

/**
 * Find user - Get a single user by ID
 * Throws error if user not found
 * Input: user ID
 */
export const findUser = os
    .input(
        z.object({
            id: z.number().int().min(1),
        })
    )
    .handler(async ({ input }) => {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, input.id))
            .limit(1);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    });

/**
 * Create user - Register a new user account
 * Hashes password before storage
 * Input: name, email, password (min 6 chars)
 */
export const createUser = os
    .input(
        z.object({
            name: z.string().min(1).max(100),
            email: z.string().email(),
            password: z.string().min(6),
        })
    )
    .handler(async ({ input }) => {
        // Hash the password
        const passwordHash = await hashPassword(input.password);

        const [newUser] = await db
            .insert(users)
            .values({
                name: input.name,
                email: input.email,
                passwordHash,
            })
            .returning();

        return newUser;
    });

/**
 * Update profile - Update authenticated user's name
 * Requires authentication, user ID comes from auth context
 * Input: new name (1-100 chars)
 */
import { authMiddleware } from "../middleware/auth";

export const updateProfile = os
    .use(authMiddleware)
    .input(
        z.object({
            name: z.string().min(1).max(100),
        })
    )
    .handler(async ({ input, context }) => {
        const userId = context.user.id;

        const [updatedUser] = await db
            .update(users)
            .set({
                name: input.name,
            })
            .where(eq(users.id, userId))
            .returning();

        if (!updatedUser) {
            throw new Error("Failed to update profile");
        }

        return updatedUser;
    });
