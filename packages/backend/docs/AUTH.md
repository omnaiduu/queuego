

## Use Auth Middleware

**Protected routes** - Use `authMiddleware`:
```typescript
import { authMiddleware } from '../middleware/auth'

export const myProtectedRoute = authMiddleware
    .input(z.object({ ... }))
    .handler(async ({ input, context }) => {
        // context.user available: { id, email, name }
    })
```

