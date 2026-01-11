/**
 * Database Connection Setup
 * 
 * This file creates and exports the database connection using Bun's built-in SQLite module.
 * The connection is used throughout the application to interact with the database.
 */

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

// Create SQLite database connection
// The database file will be created at the backend root: sqlite.db
const sqlite = new Database("sqlite.db");

// Create Drizzle ORM instance with the SQLite connection
export const db = drizzle(sqlite);
