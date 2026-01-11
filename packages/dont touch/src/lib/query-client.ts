// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute - prevents immediate refetching
                retry: (failureCount, error: any) => {
                    // Don't retry on auth errors
                    if (error?.code === 'UNAUTHORIZED') {
                        return false
                    }
                    return failureCount < 3
                },
            },
            mutations: {
                retry: (failureCount, error: any) => {
                    // Don't retry on auth errors
                    if (error?.code === 'UNAUTHORIZED') {
                        return false
                    }
                    return failureCount < 1
                },
                onError: (error: any) => {
                    // Global error handler for mutations
                    if (error?.code === 'UNAUTHORIZED') {
                        // Redirect to login on unauthorized
                        window.location.href = '/login'
                    }
                },
            },
        },
    })
}
