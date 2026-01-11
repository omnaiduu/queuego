/**
 * Password Hashing Utilities
 * 
 * Simple SHA-256 hashing for passwords.
 */

/**
 * Hash a password using SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    const computedHash = await hashPassword(password);
    return computedHash === storedHash;
}
