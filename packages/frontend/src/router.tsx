import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

/**
 * Creates and configures the application router with integrated query client.
 * 
 * This function sets up:
 * - TanStack Router for client-side navigation
 * - TanStack Query for data fetching and caching
 * - Global error handling for authentication
 * - SSR query integration
 * 
 * @returns Configured router instance
 */
export function getRouter() {
  // Create a new query client to manage server state and caching
  const queryClient = new QueryClient()

  // Initialize the router with route configuration
  const router = createRouter({
    routeTree, // Auto-generated route tree from file-based routing
    context: { queryClient }, // Make query client available to all routes
    scrollRestoration: true, // Restore scroll position on navigation
    defaultPreloadStaleTime: 0 // Disable preloading by default
  })

  /**
   * Configure global query and mutation behavior.
   * 
   * This sets up automatic error handling for authentication failures.
   * When an UNAUTHORIZED error occurs, the user is redirected to the login page.
   */
  queryClient.setDefaultOptions({
    queries: {
      staleTime: 60 * 1000, // Consider data fresh for 1 minute
      retry: (failureCount, error) => {
        // Handle UNAUTHORIZED errors by redirecting to login
        if (error && typeof error === 'object' && 'code' in error) {
          const err = error as any
          if (err.code === 'UNAUTHORIZED') {
            router.navigate({ to: "/login" })
            return false // Don't retry after redirect
          }
        }
        // Retry other errors up to 3 times
        return failureCount < 3
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        // Handle UNAUTHORIZED errors by redirecting to login
        if (error && typeof error === 'object' && 'code' in error) {
          const err = error as any
          if (err.code === 'UNAUTHORIZED') {
            router.navigate({ to: "/login" })
            return false // Don't retry after redirect
          }
        }
        // Retry mutations once on failure
        return failureCount < 1
      },
    },
  })

  // Enable server-side rendering support for queries
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
