export function validateOfflineId(offlineId?: string): boolean {
  if (!offlineId) return true;
  if (!offlineId.startsWith("off_") || offlineId.length < 10) {
    return false;
  }
  return true;
}

export function validateClientCreatedAt(clientCreatedAt?: string): boolean {
  if (!clientCreatedAt) return true;
  const ageMs = Date.now() - new Date(clientCreatedAt).getTime();
  if (ageMs > 24 * 60 * 60 * 1000) {
    return false;
  }
  return true;
}
