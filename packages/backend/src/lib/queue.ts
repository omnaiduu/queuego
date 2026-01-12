/**
 * Wait Time Calculator
 * 
 * Implements the adaptive wait time calculation algorithm
 * W = N × [(0.7 × T_recent) + (0.3 × T_default)]
 */

import { db } from "../db";
import { serviceHistory, stores } from "../db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Calculate estimated wait time for a store
 * @param storeId - The store ID
 * @param queuePosition - Position in queue (number of people ahead)
 * @returns Estimated wait time in minutes
 */
export async function calculateWaitTime(storeId: number, queuePosition: number): Promise<number> {
    if (queuePosition === 0) return 0;

    // Get store's default service time
    const store = await db.select().from(stores).where(eq(stores.id, storeId)).limit(1);
    if (!store.length || !store[0]) throw new Error("Store not found");

    const defaultServiceTime = store[0].defaultServiceTime;

    // Get the last 3 completed service times
    const recentServices = await db
        .select()
        .from(serviceHistory)
        .where(eq(serviceHistory.storeId, storeId))
        .orderBy(desc(serviceHistory.completedAt))
        .limit(3);

    let recentAverage = defaultServiceTime;

    if (recentServices.length > 0) {
        const sum = recentServices.reduce((acc, s) => acc + s.serviceTimeMinutes, 0);
        recentAverage = sum / recentServices.length;
    }

    // Apply the formula: W = N × [(0.7 × T_recent) + (0.3 × T_default)]
    const weightedAverage = (0.7 * recentAverage) + (0.3 * defaultServiceTime);
    const estimatedWaitTime = Math.round(queuePosition * weightedAverage);

    return estimatedWaitTime;
}

/**
 * Generate a random 4-digit secret code for ticket verification
 */
export function generateSecretCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
