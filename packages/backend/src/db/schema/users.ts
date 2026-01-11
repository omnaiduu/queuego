/**
 * Example Schema: Users Table
 * 
 * This is an example schema showing how to define database tables.
 * You can modify, rename, or delete this file based on your needs.
 */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Users table definition
 * 
 * Columns:
 * - id: Auto-incrementing primary key
 * - name: User's full name
 * - email: User's email address (unique)
 * - createdAt: Timestamp when the user was created
 */
export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull().default(''),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
