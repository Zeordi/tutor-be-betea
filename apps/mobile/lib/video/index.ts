/**
 * Video classroom helper (LiveKit / Daily.co ready).
 * Wire LIVEKIT_URL + token endpoint when video goes live.
 */

export interface VideoRoomConfig {
  roomName: string;
  token: string;
  serverUrl: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

/** Fetch a short-lived room token from API */
export async function createVideoSession(
  contractId: string,
  authToken: string,
): Promise<VideoRoomConfig> {
  const res = await fetch(`${API_URL}/video/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ contractId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create video session");
  }

  return res.json();
}

/** Placeholder until LiveKit native SDK is installed */
export function isVideoEnabled(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_LIVEKIT_URL);
}

export function getLiveKitUrl(): string {
  return process.env.EXPO_PUBLIC_LIVEKIT_URL || "";
}