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

import { createUser, findUser, listUsers, updateProfile } from "./users";
import { register, login, logout, getCurrentUser } from "./auth";
import {
    listStores,
    getStore,
    createStore,
    updateStore,
    toggleStoreStatus,
    getMyStores,
    addService,
    removeService,
} from "./stores";
import {
    createTicket,
    getTicket,
    cancelTicket,
    getMyActiveTickets,
    getMyTicketHistory,
    callNextTicket,
    skipTicket,
    completeCurrentTicket,
    getStoreQueue,
} from "./tickets";
import { uploadImage } from "./upload";

/**
 * Main application router
 * Organizes procedures into logical namespaces
 */
export const router = {
    users: {
        list: listUsers,
        find: findUser,
        create: createUser,
        updateProfile: updateProfile,
    },
    auth: {
        register,
        login,
        logout,
        getCurrentUser,
    },
    stores: {
        list: listStores,
        get: getStore,
        create: createStore,
        update: updateStore,
        toggleStatus: toggleStoreStatus,
        getMy: getMyStores,
        addService,
        removeService,
    },
    tickets: {
        create: createTicket,
        get: getTicket,
        cancel: cancelTicket,
        getMyActive: getMyActiveTickets,
        getMyHistory: getMyTicketHistory,
        callNext: callNextTicket,
        skip: skipTicket,
        complete: completeCurrentTicket,
        getStoreQueue: getStoreQueue,
    },
    upload: {
        image: uploadImage,
    },
};

/**
 * Export the router type for use in the client
 * This enables end-to-end type safety
 */
export type AppRouter = typeof router;
