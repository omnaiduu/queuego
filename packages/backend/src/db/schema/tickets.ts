/**
 * Tickets/Queue Schema
 * 
 * Defines the ticket and queue management structure
 */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { stores } from "./stores";
import { users } from "./users";

export const tickets = sqliteTable("tickets", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

    ticketNumber: integer("ticket_number").notNull(), // The display number shown to users
    secretCode: text("secret_code").notNull(), // OTP/PIN for verification

    // Status: waiting, called, serving, completed, cancelled, no_show
    status: text("status").notNull().default("waiting"),

    // Position tracking
    position: integer("position"), // Current position in queue (null if not in active queue)

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    calledAt: integer("called_at", { mode: "timestamp" }),
    servedAt: integer("served_at", { mode: "timestamp" }),
    completedAt: integer("completed_at", { mode: "timestamp" }),
    cancelledAt: integer("cancelled_at", { mode: "timestamp" }),

    // Deposit info
    depositAmount: integer("deposit_amount").notNull().default(0),
    depositRefunded: integer("deposit_refunded", { mode: "boolean" }).notNull().default(false),
});

// Track service times for wait time calculation
export const serviceHistory = sqliteTable("service_history", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    ticketId: integer("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
    serviceTimeMinutes: integer("service_time_minutes").notNull(), // Actual time taken to serve
    completedAt: integer("completed_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
