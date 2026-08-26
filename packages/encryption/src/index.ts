import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

export function getVaultKey(): Buffer {
  const secret = process.env.VAULT_MASTER_KEY || process.env.ENCRYPTION_KEY;
  const isProd = process.env.NODE_ENV === "production";

  if (!secret) {
    if (isProd) {
      throw new Error(
        "VAULT_MASTER_KEY or ENCRYPTION_KEY must be set in production",
      );
    }
    console.warn(
      "[SECURITY] Using development fallback vault key. Never use this in production.",
    );
    return Buffer.from(
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      "hex",
    );
  }

  return secret.length === 64
    ? Buffer.from(secret, "hex")
    : Buffer.from(secret.padEnd(32, "0").slice(0, 32));
}

export function generateIV(): Buffer {
  return randomBytes(IV_LENGTH);
}

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

export function decryptToBuffer(payload: EncryptedPayload): Buffer {
  const key = getVaultKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}