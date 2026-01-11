# Drizzle ORM Setup Guide

This backend uses **Drizzle ORM** with **SQLite** and **Bun** for database management.

## 📁 Folder Structure

```
backend/
├── src/
│   └── db/
│       ├── index.ts          # Database connection
│       ├── migrate.ts         # Migration runner script
│       └── schema/            # Database schemas
│           ├── index.ts       # Export all schemas
│           └── users.ts       # Example users table
├── drizzle/                   # Generated migrations (auto-created)
├── drizzle.config.ts          # Drizzle Kit configuration
└── sqlite.db                  # SQLite database file (auto-created)
```

## 🚀 Quick Start

### 1. Define Your Schema

Create table definitions in `src/db/schema/`:

```typescript
// src/db/schema/tasks.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false),
});
```

Export it in `src/db/schema/index.ts`:
```typescript
export * from "./users";
export * from "./tasks";  // Add your new schema
```

### 2. Generate Migration

Run this command to create a migration based on your schema:

```bash
bun run db:generate
```

This creates SQL files in the `drizzle/` folder.

### 3. Run Migration

Apply migrations to your database:

```bash
bun run db:migrate
```

### 4. Use the Database

Import and use in your code:

```typescript
import { db } from "./db";
import { users } from "./db/schema";

// Insert data
await db.insert(users).values({
  name: "John Doe",
  email: "john@example.com",
});

// Query data
const allUsers = await db.select().from(users);
console.log(allUsers);
```

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `bun run db:generate` | Generate new migration from schema changes |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:studio` | Open Drizzle Studio (visual database browser) |

## 🔄 Typical Workflow

1. **Modify schema** in `src/db/schema/`
2. **Generate migration**: `bun run db:generate`
3. **Review migration** in `drizzle/` folder
4. **Apply migration**: `bun run db:migrate`
5. **Use in code**: Import from `src/db` and `src/db/schema`

## 💡 Tips

- The `sqlite.db` file is gitignored and auto-created on first use
- Keep one table per file in the `schema/` folder for organization
- Always review generated migrations before running them
- Use Drizzle Studio (`bun run db:studio`) to visually inspect your database

## 📚 Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle with Bun Guide](https://orm.drizzle.team/docs/get-started/bun-sqlite-new)
- [SQLite Column Types](https://orm.drizzle.team/docs/column-types/sqlite)
