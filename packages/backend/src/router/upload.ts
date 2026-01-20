/**
 * File Upload Router
 *
 * Handles file uploads by saving to disk and serving via static file handler
 * Files are stored in the uploads/ directory and served at /uploads/ path
 */

import { z } from "zod";
import { os } from "@orpc/server";
import { authMiddleware } from "../middleware/auth";
import { randomUUID } from "crypto";

/**
 * Upload image to disk
 * Saves the file to uploads/ directory and returns the public URL
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

        // Extract base64 data
        const base64Data = input.dataUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate unique filename to prevent conflicts
        const fileExtension = input.filename.split('.').pop() || 'png';
        const uniqueFilename = `${randomUUID()}.${fileExtension}`;
        const filePath = `uploads/${uniqueFilename}`;

        // Save file to disk
        await Bun.write(Bun.file(filePath), buffer);

        // Return the public URL (served by the static file handler)
        return {
            url: `/uploads/${uniqueFilename}`,
            filename: input.filename,
        };
    });
