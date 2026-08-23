import { createHmac } from "crypto";

export interface AuditEntryInput {
  logId: string;
  adminId: string;
  actionType: string;
  statePayload: Record<string, unknown>;
  timestamp: string; // ISO
  previousHash: string;
}

/**
 * Creates the current hash for an audit log entry.
 * Formula:
 * HMAC-SHA256(LogID || AdminID || ActionType || StatePayloadJSON || Timestamp || PrevHash)
 */
export function createAuditHash(input: AuditEntryInput): string {
  const secret = process.env.AUDIT_HMAC_SECRET || process.env.ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("AUDIT_HMAC_SECRET or ENCRYPTION_KEY must be set");
  }

  const payload = [
    input.logId,
    input.adminId,
    input.actionType,
    JSON.stringify(input.statePayload),
    input.timestamp,
    input.previousHash,
  ].join("|");

  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verifies that a stored hash matches the expected chain.
 */
export function verifyAuditHash(
  input: AuditEntryInput,
  storedHash: string,
): boolean {
  const calculated = createAuditHash(input);
  return calculated === storedHash;
}