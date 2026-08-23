import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for AES-GCM

export interface EncryptedPayload {
  ciphertext: string; // base64
  iv: string;         // base64
  tag: string;        // base64 auth tag
}

/**
 * Retrieves the 32-byte master key from environment variables with dev fallback.
 */
export function getVaultKey(): Buffer {
  const secret = process.env.VAULT_MASTER_KEY || process.env.ENCRYPTION_KEY;
  if (!secret) {
    // 32-byte default key for local development
    return Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex");
  }
  return secret.length === 64 ? Buffer.from(secret, "hex") : Buffer.from(secret.padEnd(32, "0").slice(0, 32));
}

/**
 * Generates a cryptographically random initialization vector (IV).
 */
export function generateIV(): Buffer {
  return randomBytes(IV_LENGTH);
}

/**
 * Encrypts a Buffer (file content) using AES-256-GCM.
 * Only the encrypted result is stored in the Document Vault.
 */
export function encryptBuffer(data: Buffer): EncryptedPayload {
  const key = getVaultKey();
  const iv = generateIV();

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

/**
 * Decrypts data previously encrypted with encryptBuffer.
 * Should only be called by authorized admin/verification services.
 */
export function decryptToBuffer(payload: EncryptedPayload): Buffer {
  const key = getVaultKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}