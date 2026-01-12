/**
 * Tickets Router
 * 
 * Handles all ticket/queue management procedures
 */

import { z } from "zod";
import { os } from "@orpc/server";
import { db } from "../db";
import { tickets, stores, serviceHistory } from "../db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";
import { calculateWaitTime, generateSecretCode } from "../lib/queue";
import { WhatsApp } from "../lib/messageClass";

/**
 * Create ticket - Join a store's queue
 * Validates:
 * - Store exists and is open
 * - User doesn't have an existing active ticket
 * Generates ticket number, assigns position, sends WhatsApp notification
 */
export const createTicket = os
    .use(authMiddleware)
    .input(z.object({
        storeId: z.number(),
    }))
    .handler(async ({ input, context }) => {
        // Check if store exists and is open
        const store = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, input.storeId), eq(stores.isActive, true)))
            .limit(1);

        if (!store.length || !store[0]) {
            throw new Error("Store not found");
        }

        if (!store[0].isOpen) {
            throw new Error("Store is currently closed");
        }

        // Check if user already has an active ticket for this store
        const existingTicket = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.userId, context.user.id),
                    sql`${tickets.status} IN ('waiting', 'called', 'serving')`
                )
            )
            .limit(1);

        if (existingTicket.length > 0) {
            throw new Error("You already have an active ticket for this store");
        }

        // Get the next ticket number
        const lastTicket = await db
            .select()
            .from(tickets)
            .where(eq(tickets.storeId, input.storeId))
            .orderBy(desc(tickets.ticketNumber))
            .limit(1);

        const nextTicketNumber = lastTicket.length > 0 && lastTicket[0] ? lastTicket[0].ticketNumber + 1 : 1;

        // Get current queue position
        const queueCount = await db
            .select({ count: count() })
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.status, "waiting")
                )
            );

        const position = queueCount[0]?.count || 0;

        // Create the ticket
        const result = await db.insert(tickets).values({
            storeId: input.storeId,
            userId: context.user.id,
            ticketNumber: nextTicketNumber,
            secretCode: generateSecretCode(),
            status: "waiting",
            position: position + 1,
            depositAmount: store[0].deposit,
        }).returning();

        const ticket = result[0];

        // Calculate wait time
        const waitTime = await calculateWaitTime(input.storeId, position);

        // Send WhatsApp notification for ticket booking
        try {
            const whatsapp = new WhatsApp(
                "917666235448",
                process.env.WHATSAPP_PHONE_ID || "",
                process.env.WHATSAPP_TOKEN || ""
            );
            await whatsapp.sendTextMessage(
                `🎫 *Ticket Booked!*\n\n` +
                `Store: ${store[0]!.name}\n` +
                `Ticket #: ${ticket!.ticketNumber}\n` +
                `Position: ${position + 1}\n` +
                `Est. Wait: ~${waitTime} mins\n` +
                `Secret Code: ${ticket!.secretCode}\n\n` +
                `We'll notify you when it's your turn!`
            );
        } catch (error) {
            console.error("WhatsApp notification error:", error);
        }

        return {
            ...ticket,
            estimatedWaitTime: waitTime,
        };
    });

/**
 * Get ticket - Fetch ticket details with live queue position
 * Returns:
 * - Ticket information and status
 * - Store details
 * - Number of people ahead in queue
 * - Current wait time estimate
 * - Currently serving ticket number
 */
export const getTicket = os
    .use(authMiddleware)
    .input(z.object({ id: z.number() }))
    .handler(async ({ input, context }) => {
        const ticket = await db
            .select({
                ticket: tickets,
                store: stores,
            })
            .from(tickets)
            .innerJoin(stores, eq(tickets.storeId, stores.id))
            .where(and(eq(tickets.id, input.id), eq(tickets.userId, context.user.id)))
            .limit(1);

        if (!ticket.length || !ticket[0]) {
            throw new Error("Ticket not found");
        }

        // Get current position in queue
        const aheadCount = await db
            .select({ count: count() })
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, ticket[0].ticket.storeId),
                    eq(tickets.status, "waiting"),
                    sql`${tickets.ticketNumber} < ${ticket[0].ticket.ticketNumber}`
                )
            );

        // Get currently serving ticket
        const currentlyServing = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, ticket[0].ticket.storeId),
                    eq(tickets.status, "serving")
                )
            )
            .limit(1);

        // Calculate wait time
        const position = aheadCount[0]?.count || 0;
        const waitTime = await calculateWaitTime(ticket[0].ticket.storeId, position);

        return {
            ...ticket[0].ticket,
            store: ticket[0].store,
            currentlyServing: currentlyServing[0]?.ticketNumber || null,
            peopleAhead: position,
            estimatedWaitTime: waitTime,
        };
    });

/**
 * Cancel ticket - Leave the queue (user-initiated)
 * Allows cancellation when ticket is in waiting, called, or serving status
 * Updates ticket status and adjusts queue positions
 */
export const cancelTicket = os
    .use(authMiddleware)
    .input(z.object({ id: z.number() }))
    .handler(async ({ input, context }) => {
        const ticket = await db
            .select()
            .from(tickets)
            .where(and(eq(tickets.id, input.id), eq(tickets.userId, context.user.id)))
            .limit(1);

        if (!ticket.length || !ticket[0]) {
            throw new Error("Ticket not found");
        }

        // Allow cancelling while waiting, called, or even serving so users can leave the queue
        if (!["waiting", "called", "serving"].includes(ticket[0].status)) {
            throw new Error("Cannot cancel this ticket");
        }

        const result = await db
            .update(tickets)
            .set({
                status: "cancelled",
                // Ensure completion timestamp exists for history views
                completedAt: new Date(),
                cancelledAt: new Date(),
            })
            .where(eq(tickets.id, input.id))
            .returning();

        return result[0];
    });

/**
 * Get my active tickets - Fetch all active tickets for the current user
 * Returns tickets in waiting, called, or serving status
 * Includes real-time position, wait time, and currently serving number
 */
export const getMyActiveTickets = os
    .use(authMiddleware)
    .handler(async ({ context }) => {
        const activeTickets = await db
            .select({
                ticket: tickets,
                store: stores,
            })
            .from(tickets)
            .innerJoin(stores, eq(tickets.storeId, stores.id))
            .where(
                and(
                    eq(tickets.userId, context.user.id),
                    sql`${tickets.status} IN ('waiting', 'called', 'serving')`
                )
            )
            .orderBy(desc(tickets.createdAt));

        // Get additional info for each ticket
        const ticketsWithInfo = await Promise.all(
            activeTickets.map(async (item) => {
                // Get position
                const aheadCount = await db
                    .select({ count: count() })
                    .from(tickets)
                    .where(
                        and(
                            eq(tickets.storeId, item.ticket.storeId),
                            eq(tickets.status, "waiting"),
                            sql`${tickets.ticketNumber} < ${item.ticket.ticketNumber}`
                        )
                    );

                // Get currently serving
                const currentlyServing = await db
                    .select()
                    .from(tickets)
                    .where(
                        and(
                            eq(tickets.storeId, item.ticket.storeId),
                            eq(tickets.status, "serving")
                        )
                    )
                    .limit(1);

                const position = aheadCount[0]?.count || 0;
                const waitTime = await calculateWaitTime(item.ticket.storeId, position);

                return {
                    ...item.ticket,
                    store: item.store,
                    currentlyServing: currentlyServing[0]?.ticketNumber || null,
                    peopleAhead: position,
                    estimatedWaitTime: waitTime,
                };
            })
        );

        return ticketsWithInfo;
    });

/**
 * Get my ticket history - Fetch past tickets (completed, cancelled, no-show)
 * Supports pagination with limit and offset
 * Ordered by creation date (newest first)
 */
export const getMyTicketHistory = os
    .use(authMiddleware)
    .input(z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
    }))
    .handler(async ({ input, context }) => {
        const history = await db
            .select({
                ticket: tickets,
                store: stores,
            })
            .from(tickets)
            .innerJoin(stores, eq(tickets.storeId, stores.id))
            .where(
                and(
                    eq(tickets.userId, context.user.id),
                    sql`${tickets.status} IN ('completed', 'cancelled', 'no_show')`
                )
            )
            .orderBy(desc(tickets.createdAt))
            .limit(input.limit)
            .offset(input.offset);

        return history.map(item => ({
            ...item.ticket,
            store: item.store,
        }));
    });

/**
 * Call next ticket - Vendor action to call the next customer in queue
 * Updates the ticket status from "waiting" to "called"
 * Sends WhatsApp notification to the customer
 * Only store owner can call tickets
 */
export const callNextTicket = os
    .use(authMiddleware)
    .input(z.object({ storeId: z.number() }))
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

        // Get the next waiting ticket
        const nextTicket = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.status, "waiting")
                )
            )
            .orderBy(tickets.ticketNumber)
            .limit(1);

        if (!nextTicket.length || !nextTicket[0]) {
            throw new Error("No tickets in queue");
        }

        // Mark any currently serving ticket as completed
        const currentlyServing = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.status, "serving")
                )
            )
            .limit(1);

        if (currentlyServing.length > 0 && currentlyServing[0]) {
            const servedAt = currentlyServing[0].servedAt || new Date();
            const serviceTime = Math.round((Date.now() - servedAt.getTime()) / 60000); // minutes

            await db
                .update(tickets)
                .set({
                    status: "completed",
                    completedAt: new Date(),
                })
                .where(eq(tickets.id, currentlyServing[0].id));

            // Record service time
            await db.insert(serviceHistory).values({
                storeId: input.storeId,
                ticketId: currentlyServing[0].id,
                serviceTimeMinutes: Math.max(1, serviceTime),
            });
        }

        // Call the next ticket
        const result = await db
            .update(tickets)
            .set({
                status: "serving",
                calledAt: new Date(),
                servedAt: new Date(),
            })
            .where(eq(tickets.id, nextTicket[0].id))
            .returning();

        // Send WhatsApp notification - It's their turn!
        try {
            const whatsapp = new WhatsApp(
                "917666235448",
                process.env.WHATSAPP_PHONE_ID || "",
                process.env.WHATSAPP_TOKEN || ""
            );
            await whatsapp.sendTextMessage(
                `🔔 *IT'S YOUR TURN!*\n\n` +
                `Store: ${store[0]!.name}\n` +
                `Ticket #: ${result[0]!.ticketNumber}\n` +
                `Secret Code: ${result[0]!.secretCode}\n\n` +
                `⚡ Please proceed to the counter now!`
            );
        } catch (error) {
            console.error("WhatsApp notification error:", error);
        }

        return result[0];
    });

/**
 * Skip ticket - Mark a ticket as no-show (vendor action)
 * Used when a customer doesn't show up when called
 * Updates status to "no_show" and removes from queue
 * Only store owner can skip tickets
 */
export const skipTicket = os
    .use(authMiddleware)
    .input(z.object({
        storeId: z.number(),
        ticketId: z.number(),
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

        const result = await db
            .update(tickets)
            .set({
                status: "no_show",
                completedAt: new Date(),
            })
            .where(
                and(
                    eq(tickets.id, input.ticketId),
                    eq(tickets.storeId, input.storeId)
                )
            )
            .returning();

        return result[0];
    });

/**
 * Complete current ticket - Mark the currently serving ticket as completed
 * Records the actual service time for wait time calculations
 * Moves the ticket out of the active queue
 * Only store owner can complete tickets
 */
export const completeCurrentTicket = os
    .use(authMiddleware)
    .input(z.object({ storeId: z.number() }))
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

        // Get currently serving ticket
        const currentlyServing = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.status, "serving")
                )
            )
            .limit(1);

        if (!currentlyServing.length || !currentlyServing[0]) {
            throw new Error("No ticket currently being served");
        }

        const ticket = currentlyServing[0];
        const servedAt = ticket.servedAt || new Date();
        const serviceTime = Math.round((Date.now() - servedAt.getTime()) / 60000); // minutes

        // Mark as completed
        const result = await db
            .update(tickets)
            .set({
                status: "completed",
                completedAt: new Date(),
            })
            .where(eq(tickets.id, ticket.id))
            .returning();

        // Send WhatsApp notification - Service completed
        try {
            const whatsapp = new WhatsApp(
                "917666235448",
                process.env.WHATSAPP_PHONE_ID || "",
                process.env.WHATSAPP_TOKEN || ""
            );
            await whatsapp.sendTextMessage(
                `✅ *Service Completed!*\n\n` +
                `Store: ${store[0]!.name}\n` +
                `Ticket #: ${ticket.ticketNumber}\n` +
                `Service Time: ${serviceTime} mins\n\n` +
                `Thank you for using QueueGo! 🙏\n` +
                `We hope to see you again soon.`
            );
        } catch (error) {
            console.error("WhatsApp notification error:", error);
        }

        // Record service time
        await db.insert(serviceHistory).values({
            storeId: input.storeId,
            ticketId: ticket.id,
            serviceTimeMinutes: Math.max(1, serviceTime),
        });

        return result[0];
    });

/**
 * Get store queue - Fetch queue status for vendor dashboard
 * Returns:
 * - Currently serving ticket number
 * - Next ticket in line
 * - Total queue length
 * - List of all waiting tickets
 * Only store owner can view queue details
 */
export const getStoreQueue = os
    .use(authMiddleware)
    .input(z.object({ storeId: z.number() }))
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

        // Get currently serving
        const serving = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.status, "serving")
                )
            )
            .limit(1);

        // Get waiting tickets
        const waiting = await db
            .select()
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.status, "waiting")
                )
            )
            .orderBy(tickets.ticketNumber);

        // Get queue count
        const queueCount = await db
            .select({ count: count() })
            .from(tickets)
            .where(
                and(
                    eq(tickets.storeId, input.storeId),
                    eq(tickets.status, "waiting")
                )
            );

        return {
            currentTicket: serving[0]?.ticketNumber || null,
            nextTicket: waiting[0]?.ticketNumber || null,
            queueLength: queueCount[0]?.count || 0,
            waitingTickets: waiting,
        };
    });
