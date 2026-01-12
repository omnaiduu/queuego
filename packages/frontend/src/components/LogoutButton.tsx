import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { orpc } from "../lib/clientrpc"
import { isDefinedError } from "@orpc/client"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"

/**
 * Logout button component - Handles user logout with cache clearing.
 * Redirects to login page after successful logout.
 */
export function LogoutButton() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Logout mutation - calls API and handles cleanup
    const logoutMutation = useMutation({
        ...orpc.auth.logout.mutationOptions(),
        onSuccess: () => {
            // Clear all cached query data on successful logout
            queryClient.clear()
            // Redirect user to login page
            navigate({ to: '/login' })
        },
        onError: (err) => {
            console.error('Logout failed:', isDefinedError(err) ? err.message : 'Unknown error')
            // Even if API call fails, clear cache and redirect for security
            queryClient.clear()
            navigate({ to: '/login' })
        }
    })

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => logoutMutation.mutate({})}
            disabled={logoutMutation.isPending}
            className="flex items-center gap-2"
        >
            <LogOut className="w-4 h-4" />
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
    )
}
