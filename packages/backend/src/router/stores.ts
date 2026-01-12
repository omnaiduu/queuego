/**
 * Stores Router
 * 
 * Handles all store-related procedures
 */

import { z } from "zod";
import { os } from "@orpc/server";
import { db } from "../db";
import { stores, storeServices, tickets } from "../db/schema";
import { eq, and, like, or, desc, sql, count } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { calculateWaitTime } from "../lib/queue";

/**
 * List all stores - Fetch stores with optional search and filters
 * Supports searching by name/category/description, filtering by category and open status
 * Returns stores with real-time queue counts
 */
export const listStores = os
    .use(authMiddleware)
    .input(z.object({
        search: z.string().optional(),
        category: z.enum(["Doctor", "Saloon", "Car Wash"]).optional(),
        isOpen: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
    }))
    .handler(async ({ input }) => {
        const conditions = [eq(stores.isActive, true)];

        // Apply search filter
        if (input.search) {
            conditions.push(
                or(
                    like(stores.name, `%${input.search}%`),
                    like(stores.category, `%${input.search}%`),
                    like(stores.description, `%${input.search}%`)
                )!
            );
        }

        // Apply category filter
        if (input.category) {
            conditions.push(eq(stores.category, input.category));
        }

        // Apply isOpen filter
        if (input.isOpen !== undefined) {
            conditions.push(eq(stores.isOpen, input.isOpen));
        }

        const result = await db.select({
            id: stores.id,
            name: stores.name,
            category: stores.category,
            description: stores.description,
            address: stores.address,
            city: stores.city,
            imageUrl: stores.imageUrl,
            rating: stores.rating,
            totalReviews: stores.totalReviews,
            isOpen: stores.isOpen,
            deposit: stores.deposit,
            phone: stores.phone,
        })
            .from(stores)
            .where(and(...conditions))
            .orderBy(desc(stores.createdAt))
            .limit(input.limit)
            .offset(input.offset);

        // Get queue counts for each store
        const storesWithQueue = await Promise.all(
            result.map(async (store) => {
                const queueCount = await db
                    .select({ count: count() })
                    .from(tickets)
                    .where(
                        and(
                            eq(tickets.storeId, store.id),
                            eq(tickets.status, "waiting")
                        )
                    );

                return {
                    ...store,
                    queueCount: queueCount[0]?.count || 0,
                };
            })
        );

        return storesWithQueue;
    });

/**
 * Get store by ID - Fetch detailed store information including:
 * - Store details and services offered
 * - Current queue length and wait time
 * - Currently serving ticket number
 */
export const getStore = os
    .use(authMiddleware)
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
        const store = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, input.id), eq(stores.isActive, true)))
            .limit(1);

        if (!store.length) {
            throw new Error("Store not found");
        }

        // Get services
        const services = await db
            .select()
            .from(storeServices)
            .where(eq(storeServices.storeId, input.id));

        // Get queue count
        const queueCount = await db
            .select({ count: count() })
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.id),
                    eq(tickets.status, "waiting")
                )
            );

        // Get current serving ticket
        const currentTicket = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.id),
                    eq(tickets.status, "serving")
                )
            )
            .limit(1);

        // Calculate estimated wait time
        const queueLength = queueCount[0]?.count || 0;
        const estimatedWaitTime = await calculateWaitTime(input.id, queueLength);

        return {
            ...store[0],
            services,
            queueCount: queueLength,
            currentTicket: currentTicket[0]?.ticketNumber || null,
            estimatedWaitTime,
        };
    });

/**
 * Create store - Register a new store/business (vendor only)
 * Creates a store associated with the authenticated user as owner
 */
export const createStore = os
    .use(authMiddleware)
    .input(z.object({
        name: z.string().min(1).max(200),
        category: z.enum(["Doctor", "Saloon", "Car Wash"]),
        description: z.string().optional(),
        address: z.string().min(1),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        imageUrl: z.string().url().optional(),
        openTime: z.string().default("10:00"),
        closeTime: z.string().default("20:00"),
        deposit: z.number().min(0).default(0),
        defaultServiceTime: z.number().min(1).default(5),
    }))
    .handler(async ({ input, context }) => {
        const result = await db.insert(stores).values({
            ownerId: context.user.id,
            name: input.name,
            category: input.category,
            description: input.description,
            address: input.address,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            phone: input.phone,
            email: input.email,
            imageUrl: input.imageUrl,
            openTime: input.openTime,
            closeTime: input.closeTime,
            deposit: input.deposit,
            defaultServiceTime: input.defaultServiceTime,
            isOpen: true,
            isActive: true,
        }).returning();

        return result[0];
    });

/**
 * Update store - Modify store details (only store owner can update)
 * Allows updating name, description, hours, deposit amount, etc.
 */
export const updateStore = os
    .use(authMiddleware)
    .input(z.object({
        id: z.number(),
        name: z.string().min(1).max(200).optional(),
        category: z.enum(["Doctor", "Saloon", "Car Wash"]).optional(),
        description: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        imageUrl: z.string().url().optional(),
        openTime: z.string().optional(),
        closeTime: z.string().optional(),
        deposit: z.number().min(0).optional(),
        defaultServiceTime: z.number().min(1).optional(),
        isOpen: z.boolean().optional(),
    }))
    .handler(async ({ input, context }) => {
        // Verify ownership
        const store = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, input.id), eq(stores.ownerId, context.user.id)))
            .limit(1);

        if (!store.length) {
            throw new Error("Store not found or unauthorized");
        }

        const { id, ...updates } = input;
        const result = await db
            .update(stores)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(stores.id, id))
            .returning();

        return result[0];
    });

/**
 * Toggle store status - Open or close the store for new customers
 * When closed, customers cannot join the queue
 * Only store owner can toggle status
 */
export const toggleStoreStatus = os
    .use(authMiddleware)
    .input(z.object({
        id: z.number(),
        isOpen: z.boolean(),
    }))
    .handler(async ({ input, context }) => {
        // Verify ownership
        const store = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, input.id), eq(stores.ownerId, context.user.id)))
            .limit(1);

        if (!store.length) {
            throw new Error("Store not found or unauthorized");
        }

        const result = await db
            .update(stores)
            .set({ isOpen: input.isOpen, updatedAt: new Date() })
            .where(eq(stores.id, input.id))
            .returning();

        return result[0];
    });

/**
 * Get my stores - Fetch all stores owned by the authenticated vendor
 * Returns only active stores, ordered by creation date
 */
export const getMyStores = os
    .use(authMiddleware)
    .handler(async ({ context }) => {
        const result = await db
            .select()
            .from(stores)
            .where(and(eq(stores.ownerId, context.user.id), eq(stores.isActive, true)))
            .orderBy(desc(stores.createdAt));

        return result;
    });

/**
 * Add service - Add a service/offering to a store
 * Stores can offer multiple services (e.g., haircut, shave, etc.)
 * Only store owner can add services
 */
export const addService = os
    .use(authMiddleware)
    .input(z.object({
        storeId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string().optional(),
    }))
    .handler(async ({ input, context }) => {
        // Verify ownership
        const store = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, input.storeId), eq(stores.ownerId, context.user.id)))
            .limit(1);

        if (!store.length) {
            throw new Error("Store not found or unauthorized");
        }

        const result = await db.insert(storeServices).values({
            storeId: input.storeId,
            name: input.name,
            description: input.description,
            price: input.price,
        }).returning();

        return result[0];
    });

/**
 * Remove service - Delete a service from a store
 * Verifies ownership through store-service relationship
 * Only store owner can remove services
 */
export const removeService = os
    .use(authMiddleware)
    .input(z.object({
        serviceId: z.number(),
    }))
    .handler(async ({ input, context }) => {
        // Verify ownership through store
        const service = await db
            .select({
                id: storeServices.id,
                ownerId: stores.ownerId,
            })
            .from(storeServices)
            .innerJoin(stores, eq(storeServices.storeId, stores.id))
            .where(eq(storeServices.id, input.serviceId))
            .limit(1);

        if (!service.length || !service[0] || service[0].ownerId !== context.user.id) {
            throw new Error("Service not found or unauthorized");
        }

        await db.delete(storeServices).where(eq(storeServices.id, input.serviceId));

        return { success: true };
    });
