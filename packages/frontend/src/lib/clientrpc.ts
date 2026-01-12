import { createORPCClient, type InferClientErrorUnion } from '@orpc/client'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { RPCLink } from '@orpc/client/fetch'
import type { router } from '../../../backend/src/router'
import type { RouterClient } from '@orpc/server'

/**
 * Get the RPC endpoint URL based on environment.
 * Development: Frontend (port 3000) connects to Backend (port 4000)
 * Production: Same origin (backend serves the built frontend)
 */
const getRPCUrl = () => {
    // Development: Frontend (3000) → Backend (4000) on localhost
    if (import.meta.env.DEV) {
        return 'http://127.0.0.1:4000/rpc'
    }

    // Production: Use same origin as the current page
    return typeof window !== 'undefined' ? `${window.location.origin}/rpc` : '/rpc'
}

/**
 * Create RPC link with fetch configuration.
 * Includes credentials to send cookies with every request for authentication.
 */
const link = new RPCLink({
    url: getRPCUrl(),
    fetch: (input, init) =>
        fetch(input, {
            ...init,
            credentials: 'include', // Required for cookies/sessions
        }),
})

/**
 * Typed oRPC client for making API calls to the backend.
 * Provides full type safety based on backend router definition.
 */
export const orpcClient: RouterClient<typeof router> = createORPCClient(link)

/**
 * TanStack Query utilities for the oRPC client.
 * Provides React Query hooks (useQuery, useMutation) with full type safety.
 */
export const orpc = createTanstackQueryUtils(orpcClient)

/**
 * Union type of all possible errors from the API.
 * Used for global error handling and type-safe error checking.
 */
export type AllErrors = InferClientErrorUnion<typeof orpcClient>
