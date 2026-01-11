# oRPC Setup Guide

This backend uses **oRPC** (OpenAPI Remote Procedure Call) for building type-safe RPC APIs that follow the OpenAPI specification.

## 📁 Folder Structure

```
backend/
├── src/
│   ├── router/
│   │   ├── index.ts           # Main router (combines all procedures)
│   │   └── users.ts            # User procedures (example)
│   └── index.ts                # Server setup with oRPC handler
```

## 🎯 What is oRPC?

oRPC combines Remote Procedure Call (RPC) with OpenAPI, giving you:
- **Type-safe** API calls with full TypeScript support
- **Schema validation** using Zod
- **Auto-completion** in your IDE
- **OpenAPI compatibility** for documentation

## 🚀 Quick Start

### 1. Define a Procedure

Create procedures in `src/router/`:

```typescript
// src/router/tasks.ts
import { os } from "@orpc/server";
import * as z from "zod";

export const createTask = os
  .input(
    z.object({
      title: z.string().min(1),
      completed: z.boolean().default(false),
    })
  )
  .handler(async ({ input }) => {
    // Your logic here
    return { id: 1, ...input };
  });
```

### 2. Add to Router

Export it in `src/router/index.ts`:

```typescript
import { createTask } from "./tasks";

export const router = {
  users: { /* existing */ },
  tasks: {
    create: createTask,
  },
};
```

### 3. Use from Client

Create a client (frontend or another service):

```typescript
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { AppRouter } from "./router";

const link = new RPCLink({
  url: "http://localhost:4000",
});

const client = createORPCClient<AppRouter>(link);

// Type-safe calls with auto-completion
const task = await client.tasks.create({
  title: "Buy groceries",
  completed: false,
});
```

## 🔧 Key Concepts

### Procedures
A procedure is a function that can be called remotely:
- **Input validation** with Zod schemas
- **Handler** function with your business logic
- **Output** is automatically typed

### Router
The router organizes procedures into namespaces:
```typescript
router = {
  users: { list, find, create },
  tasks: { list, find, create },
}
```

### Schema Validation
Using Zod for type-safe validation:
```typescript
.input(
  z.object({
    email: z.string().email(),
    age: z.number().min(18),
  })
)
```

## 📡 Server Features

The server (`src/index.ts`) includes:
- **CORS Plugin** - For cross-origin requests
- **Error Logging** - Automatic error interceptor
- **404 Handling** - For non-matching procedures

## 🛠️ Common Patterns

### With Database
```typescript
import { db } from "../db";
import { users } from "../db/schema";

export const getUser = os
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    const [user] = await db
      .select()
      .from(users)
      .where((t) => t.id === input.id);
    
    return user;
  });
```

### With Authentication
```typescript
import { ORPCError, os } from "@orpc/server";

export const createPost = os
  .use(({ context, next }) => {
    const user = parseAuthToken(context.headers.authorization);
    
    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }
    
    return next({ context: { user } });
  })
  .input(/* ... */)
  .handler(async ({ input, context }) => {
    // context.user is now available
  });
```

## 💡 Tips

- Keep one feature per file in `router/` folder
- Always validate input with Zod schemas
- Use TypeScript strict mode for best experience
- Procedures are automatically exposed via HTTP POST

## 🔗 Resources

- [oRPC Documentation](https://orpc.dev)
- [Zod Documentation](https://zod.dev)
- [Example procedures](../src/router/users.ts)
