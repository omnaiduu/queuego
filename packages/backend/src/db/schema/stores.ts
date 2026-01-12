/**
 * Stores Schema
 * 
 * Defines the stores/vendors table structure
 */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const stores = sqliteTable("stores", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ownerId: integer("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(), // Medical, Beauty, Food, etc.
    description: text("description"),

    // Location
    address: text("address").notNull(),
    city: text("city"),
    state: text("state"),
    zipCode: text("zip_code"),
    latitude: text("latitude"),
    longitude: text("longitude"),

    // Contact
    phone: text("phone"),
    email: text("email"),

    // Image
    imageUrl: text("image_url"),

    // Operating Hours
    openTime: text("open_time").notNull().default("10:00"), // HH:MM format
    closeTime: text("close_time").notNull().default("20:00"),

    // Queue Settings
    deposit: integer("deposit").notNull().default(0), // Deposit amount in cents/paise
    defaultServiceTime: integer("default_service_time").notNull().default(5), // in minutes
    isOpen: integer("is_open", { mode: "boolean" }).notNull().default(true),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),

    // Stats
    rating: text("rating").default("0"), // stored as text to avoid float precision issues
    totalReviews: integer("total_reviews").notNull().default(0),

    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const storeServices = sqliteTable("store_services", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    price: text("price"), // stored as text to avoid precision issues
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
