import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, User, Mail } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { orpc, orpcClient } from '@/lib/orpc-client'

export const Route = createFileRoute('/protected')({
    // Server-side auth check with beforeLoad
    beforeLoad: async ({ location }) => {
        try {
            await orpcClient.auth.getCurrentUser({})
        } catch (error: any) {
            // Redirect to login on auth error
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            })
        }
    },
    component: ProtectedPage,
})

function ProtectedPage() {
    // Client-side user data
    const { data: userData, isLoading } = useQuery(
        orpc.auth.getCurrentUser.queryOptions({
            input: {},
        })
    )

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground">Loading protected content...</p>
                </div>
            </div>
        )
    }

    const user = userData?.user

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 lg:pb-8">
            <header className="bg-background px-4 md:px-8 py-6 sticky top-0 z-10 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Protected Route</h1>
                        <p className="text-sm text-muted-foreground">You must be authenticated to see this</p>
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-8 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto space-y-6">
                {/* Success Banner */}
                <div className="bg-green-500 dark:bg-green-600 text-white rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">✅ Authentication Working!</h2>
                            <p className="text-green-50">
                                You're seeing this page because you are successfully authenticated. This route is
                                protected and will redirect unauthenticated users to the login page.
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Your Authenticated User Info
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">User ID</p>
                                <p className="font-mono font-semibold">{user?.id}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Name</p>
                                <p className="font-semibold">{user?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Email</p>
                                <p className="font-semibold break-all">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auth Flow Info */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-lg font-bold mb-4">🎯 How This Works</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex gap-3">
                            <span className="text-primary font-bold">1.</span>
                            <p>
                                <strong>Route Protection:</strong> The <code className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">beforeLoad</code> hook
                                checks authentication before rendering
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-primary font-bold">2.</span>
                            <p>
                                <strong>Auto Redirect:</strong> Unauthenticated users are automatically redirected
                                to <code className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">/login</code>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-primary font-bold">3.</span>
                            <p>
                                <strong>Cookie Auth:</strong> Your session is stored in a secure HttpOnly cookie
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-primary font-bold">4.</span>
                            <p>
                                <strong>Global Error Handling:</strong> 401 errors anywhere trigger login redirect
                            </p>
                        </div>
                    </div>
                </div>

                {/* Test Actions */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-6 md:p-8">
                    <h3 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-100">
                        🧪 Test Authentication
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <p>✅ Try logging out from the Profile page</p>
                        <p>✅ Try accessing this page while logged out (will redirect)</p>
                        <p>✅ Check your browser cookies - you'll see <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">auth_token</code></p>
                        <p>✅ All protected routes will use the same pattern</p>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    )
}
