# Authentication Setup

## Overview
Simple cookie-based authentication with SHA-256 password hashing. No sessions table - auth token stored in HttpOnly cookie.

## Cookie Configuration
```typescript
{
  httpOnly: true,
  secure: false,        // false for local HTTP dev
  sameSite: 'lax',      // 'lax' works for same-site dev (127.0.0.1)
  maxAge: 7 * 24 * 60 * 60,  // 7 days
  path: '/',
}
```

## Auth Token Format
`userId:randomUUID` - e.g., `10:56233a32-ec46-46d2-b8f1-9d715ec11846`

## Password Hashing
Simple SHA-256 (no salt, no PBKDF2) - stored as hex string.

```typescript
import { hashPassword, verifyPassword } from '../lib/password'

const hash = await hashPassword('password123')
const valid = await verifyPassword('password123', hash)
```

## Protected Routes Pattern
```typescript
import { authMiddleware } from '../middleware/auth'

export const protectedProcedure = authMiddleware
    .input(z.object({ ... }))
    .handler(async ({ input, context }) => {
        // context.user is available here (id, email, name)
        const userId = context.user.id
        // ... your logic
    })
```

## Setting/Deleting Cookies
```typescript
import { setCookie, deleteCookie } from '@orpc/server/helpers'
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins'

// Base procedure with response headers
const authBase = os.$context<ResponseHeadersPluginContext>()

// Set cookie
setCookie(context.resHeaders, 'auth_token', token, COOKIE_OPTIONS)

// Delete cookie (logout)
deleteCookie(context.resHeaders, 'auth_token', { path: '/' })
```

## CORS Setup
Allow both `localhost` and `127.0.0.1` for local dev:
```typescript
new CORSPlugin({
    origin: (origin) => {
        const allowed = ['http://localhost:3000', 'http://127.0.0.1:3000']
        return origin && allowed.includes(origin) ? origin : false
    },
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposeHeaders: ['Set-Cookie'],
    credentials: true,
})
```

## Required Plugins
```typescript
new RequestHeadersPlugin(),  // Enables context.reqHeaders
new ResponseHeadersPlugin(), // Enables context.resHeaders
```

## Auth Routes
- `POST /auth/register` - Create account + set cookie
- `POST /auth/login` - Authenticate + set cookie
- `POST /auth/logout` - Delete cookie (requires auth)
- `POST /auth/getCurrentUser` - Get user info (requires auth)

## Frontend Integration
Client must send cookies with every request:
```typescript
fetch: (input, init) => fetch(input, { ...init, credentials: 'include' })
```

## Database Schema
```typescript
export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    passwordHash: text('password_hash').notNull().default(''),
})
```
