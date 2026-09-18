const WEAK_SECRET_PATTERNS = [
  "dev-secret",
  "changeme",
  "secret",
  "password",
  "123456",
  "admin",
];

function isWeakSecret(secret: string): boolean {
  const lower = secret.toLowerCase();
  return (
    WEAK_SECRET_PATTERNS.some((p) => lower.includes(p)) ||
    secret.length < 16
  );
}

export function validateCriticalSecrets(): void {
  const isProd = process.env.NODE_ENV === "production";

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.trim() === "") {
    if (isProd) {
      throw new Error("DATABASE_URL must be set in production");
    }
    console.warn("[BOOT] DATABASE_URL is not set");
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || isWeakSecret(jwtSecret)) {
    if (isProd) {
      throw new Error(
        "JWT_SECRET must be set and strong (>=16 chars, not a known weak value) in production",
      );
    }
    console.warn("[BOOT] JWT_SECRET is missing or weak");
  }

  const vaultKey = process.env.VAULT_MASTER_KEY || process.env.ENCRYPTION_KEY;
  if (!vaultKey) {
    if (isProd) {
      throw new Error(
        "VAULT_MASTER_KEY or ENCRYPTION_KEY must be set in production",
      );
    }
    console.warn("[BOOT] VAULT_MASTER_KEY/ENCRYPTION_KEY is not set");
  } else if (vaultKey.length !== 64 && vaultKey.length < 32) {
    if (isProd) {
      throw new Error(
        "VAULT_MASTER_KEY/ENCRYPTION_KEY must be 64-char hex or >=32 chars in production",
      );
    }
    console.warn("[BOOT] VAULT_MASTER_KEY/ENCRYPTION_KEY is too short");
  }
}
