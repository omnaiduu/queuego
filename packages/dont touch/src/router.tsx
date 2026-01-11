// src/router.tsx
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'
import { isDefinedError } from '@orpc/client'
import type { AllErrors } from './lib/orpc-client'
// Extract all possible error types from the router


export function getRouter() {
    const queryClient = new QueryClient()

    const router = createRouter({
        routeTree,
        context: { queryClient },
        scrollRestoration: true,
        defaultPreload: 'intent',
    })

    // Set up global error handler after router is created
    queryClient.setDefaultOptions({
        queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error) => {
                // Don't retry on UNAUTHORIZED errors
                const err = error as AllErrors
                if (isDefinedError(err) && err.code === 'UNAUTHORIZED') {
                    console.log('Not retrying due to UNAUTHORIZED error')
                    router.navigate({ to: '/login' })
                    return false
                }
                return failureCount < 3
            },
        },
        mutations: {
            retry: (failureCount, error) => {
                // Don't retry on UNAUTHORIZED errors
                const err = error as AllErrors
                if (isDefinedError(err) && err.code === 'UNAUTHORIZED') {
                    console.log('Not retrying due to UNAUTHORIZED error')
                    router.navigate({ to: '/login' })
                    return false
                }
                return failureCount < 1
            },
        },
    })

    setupRouterSsrQueryIntegration({
        router,
        queryClient,
    })

    return router
}
