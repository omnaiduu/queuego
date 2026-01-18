/**
 * Drizzle Kit Configuration
 * 
 * This configuration file tells Drizzle Kit where to find your schemas
 * and where to generate migrations.
 */

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    // SQLite database dialect
    dialect: "sqlite",

    // Path to your schema files
    schema: "./src/db/schema/index.ts",

    // Directory where migrations will be generated
    out: "./drizzle",

    // Database connection details
    dbCredentials: {
        url: "sqlite.db",
    },
});
