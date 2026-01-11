/**
 * App Router
 * 
 * This is the main router that combines all procedure routes.
 * Add new routes here as your application grows.
 * 
 * Example usage:
 *   router.users.list({ limit: 10 })
 *   router.users.find({ id: 1 })
 *   router.auth.login({ email, password })
 */

import { createUser, findUser, listUsers } from "./users";
import { register, login, logout, getCurrentUser } from "./auth";

/**
 * Main application router
 * Organizes procedures into logical namespaces
 */
export const router = {
    users: {
        list: listUsers,
        find: findUser,
        create: createUser,
    },
    auth: {
        register,
        login,
        logout,
        getCurrentUser,
    },
};

/**
 * Export the router type for use in the client
 * This enables end-to-end type safety
 */
export type AppRouter = typeof router;
