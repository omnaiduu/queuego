import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '../lib/clientrpc'
import { LogoutButton } from '../components/LogoutButton'
import { User, Mail } from 'lucide-react'

/** Protected route example - requires authentication to access */
export const Route = createFileRoute('/protected')({
    component: ProtectedPage,
})

/**
 * Protected page component - automatically redirects to login if user is not authenticated.
 * The redirect is handled by router.tsx global error handler for UNAUTHORIZED errors.
 */
function ProtectedPage() {
    // Fetch current user - will trigger redirect to /login if unauthorized
    const { data, isLoading, isError } = useQuery(orpc.auth.getCurrentUser.queryOptions())

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-6 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    // Show error message if unable to fetch user data
    if (isError || !data?.user) {
        return (
            <div className="min-h-screen bg-background p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Error Loading User</h2>
                    <p className="text-muted-foreground">Please try logging in again.</p>
                </div>
            </div>
        )
    }

    const user = data.user

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Protected Page</h1>
                    <LogoutButton />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-muted-foreground">Welcome back!</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">User ID</p>
                                <p className="font-medium">{user.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            This page is protected and requires authentication. If you weren't logged in,
                            you would have been automatically redirected to the login page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
