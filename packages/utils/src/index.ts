// ==========================================
// CRYPTO & HELPER UTILITIES
// ==========================================

/**
 * Simple random ID generator (not for security-critical use)
 */
export function generateId(length = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep utility for retries / testing
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==========================================
// FORMAT UTILITIES
// ==========================================

/**
 * Format currency for Ethiopia (ETB)
 */
export function formatETB(amount: number): string {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format relative time (e.g. "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((past.getTime() - now.getTime()) / 1000);

  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "seconds"],
    [60, "minutes"],
    [24, "hours"],
    [7, "days"],
    [4.34524, "weeks"],
    [12, "months"],
    [Number.POSITIVE_INFINITY, "years"],
  ];

  let duration = diffInSeconds;
  for (const [amount, unit] of divisions) {
    if (Math.abs(duration) < amount) {
      return rtf.format(Math.round(duration), unit);
    }
    duration /= amount;
  }
  return rtf.format(Math.round(duration), "years");
}

/**
 * Mask phone number for privacy (e.g. 0911****67)
 */
export function maskPhone(phone: string): string {
  if (phone.length < 8) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-2);
}