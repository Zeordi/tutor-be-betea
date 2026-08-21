import { createHash, randomBytes } from "crypto";

/**
 * Derives a stable 32-byte key from the master ENCRYPTION_KEY
 * stored in environment variables.
 */
export function getVaultKey(): Buffer {
  const masterKey = process.env.ENCRYPTION_KEY;

  if (!masterKey || masterKey.length < 32) {
    throw new Error(
      "ENCRYPTION_KEY must be set and at least 32 characters long",
    );
  }

  // SHA-256 ensures we always get a 32-byte key
  return createHash("sha256").update(masterKey).digest();
}

export function generateIV(): Buffer {
  return randomBytes(12); // 96-bit IV recommended for GCM
}
