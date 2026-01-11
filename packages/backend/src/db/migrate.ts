/**
 * Database Migration Script
 * 
 * This script runs all pending database migrations.
 * Run this script whenever you create new migrations or deploy to a new environment.
 * 
 * Usage: bun run db:migrate
 */

import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

// Create database connection for migration
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

// Run all migrations from the drizzle folder
console.log("🔄 Running migrations...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("✅ Migrations complete!");
