/**
 * Image Compression Utility
 * 
 * Compresses images in the browser before upload
 * Uses browser-image-compression library
 */

import imageCompression from 'browser-image-compression';

/**
 * Compress an image file
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum file size in MB (default: 1)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default: 1920)
 * @returns Compressed file
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: file.type,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Convert file to base64 data URL
 * @param file - The file to convert
 * @returns Base64 data URL string
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image and convert to base64
 * @param file - The image file
 * @param maxSizeMB - Maximum file size in MB
 * @param maxWidthOrHeight - Maximum dimension
 * @returns Base64 data URL string
 */
export async function compressImageToBase64(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<string> {
  const compressed = await compressImage(file, maxSizeMB, maxWidthOrHeight);
  return fileToDataURL(compressed);
}

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum allowed file size in MB
 * @returns true if valid, throws error otherwise
 */
export function validateImageFile(file: File, maxSizeMB: number = 10): boolean {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed');
  }

  return true;
}
