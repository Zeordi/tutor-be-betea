/**
 * Video classroom helper (LiveKit / Daily.co ready).
 * Wire LIVEKIT_URL + token endpoint when video goes live.
 */

export interface VideoRoomConfig {
  roomName: string;
  token: string;
  serverUrl: string;
}

import { apiRequest, paths } from "@/lib/api";

/** Fetch a short-lived room token from API */
export async function createVideoSession(
  contractId: string,
): Promise<VideoRoomConfig> {
  return apiRequest<VideoRoomConfig>(paths.videoSession, {
    method: "POST",
    body: JSON.stringify({ contractId }),
  });
}

/** Placeholder until LiveKit native SDK is installed */
export function isVideoEnabled(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_LIVEKIT_URL);
}

export function getLiveKitUrl(): string {
  return process.env.EXPO_PUBLIC_LIVEKIT_URL || "";
}