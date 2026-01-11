// lib/orpc-client.ts
import { createORPCClient, type InferClientErrorUnion } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import type { router } from 'backend/router'
import type { RouterClient } from '@orpc/server'

// Configure RPC link to communicate with backend
const link = new RPCLink({
    url: 'http://127.0.0.1:4000',
    headers: () => ({
        'Content-Type': 'application/json',
    }),
    fetch: (input, init) => {
        // Add credentials: 'include' to enable cookies
        return fetch(input, { ...init, credentials: 'include' })
    },
})

// Create type-safe oRPC client
export const orpcClient: RouterClient<typeof router> = createORPCClient(link)
export type AllErrors = InferClientErrorUnion<typeof orpcClient>;
// Create TanStack Query utilities for type-safe queries/mutations
export const orpc = createTanstackQueryUtils(orpcClient)


