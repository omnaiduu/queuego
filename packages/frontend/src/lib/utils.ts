import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes.
 * Combines clsx for conditional classes and tailwind-merge to handle conflicts.
 * 
 * @param inputs - Class names, objects, or arrays of class names
 * @returns Merged and deduplicated class string
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500')
 * cn('px-4 py-2', 'px-2') // Result: 'py-2 px-2' (later value wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
