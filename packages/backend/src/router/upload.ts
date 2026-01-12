/**
 * File Upload Router
 * 
 * Handles file uploads (stores as base64 for simplicity)
 * In production, you would upload to S3 or similar service
 */

import { z } from "zod";
import { os } from "@orpc/server";
import { authMiddleware } from "../middleware/auth";

/**
 * Upload image as base64
 * Returns the data URL to be stored in the database
 */
export const uploadImage = os
    .use(authMiddleware)
    .input(z.object({
        dataUrl: z.string(), // base64 data URL
        filename: z.string(),
    }))
    .handler(async ({ input }) => {
        // Validate it's a data URL
        if (!input.dataUrl.startsWith('data:image/')) {
            throw new Error('Invalid image data');
        }

        // In a real application, you would:
        // 1. Extract the base64 data
        // 2. Upload to S3/Cloudinary/etc
        // 3. Return the public URL

        // For now, we'll just return the data URL
        // This stores the image in the database as base64
        return {
            url: input.dataUrl,
            filename: input.filename,
        };
    });
