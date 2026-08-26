import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";

const QUEUE_KEY = "offline_attendance_queue";

export interface OfflineAttendancePayload {
  id: string; // local uuid
  contractId: string;
  type: "CHECK_IN" | "CHECK_OUT";
  latitude: number;
  longitude: number;
  distanceMeters: number;
  isVerifiedGeofence: boolean;
  createdAt: string; // ISO
  signature?: string; // optional HMAC later
}

async function readQueue(): Promise<OfflineAttendancePayload[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as OfflineAttendancePayload[];
  } catch {
    return [];
  }
}

async function writeQueue(items: OfflineAttendancePayload[]) {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

/** Save attendance when offline */
export async function enqueueAttendance(
  payload: OfflineAttendancePayload,
): Promise<void> {
  const queue = await readQueue();
  queue.push(payload);
  await writeQueue(queue);
}

/** Flush queued attendance when back online */
export async function flushAttendanceQueue(): Promise<{
  synced: number;
  failed: number;
}> {
  const queue = await readQueue();
  if (!queue.length) return { synced: 0, failed: 0 };

  const remaining: OfflineAttendancePayload[] = [];
  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    try {
      const endpoint =
        item.type === "CHECK_IN"
          ? "/attendance/check-in"
          : "/attendance/check-out";

      await api.post(endpoint, {
        contractId: item.contractId,
        latitude: item.latitude,
        longitude: item.longitude,
        distanceMeters: item.distanceMeters,
        isVerifiedGeofence: item.isVerifiedGeofence,
        clientCreatedAt: item.createdAt,
        offlineId: item.id,
      });
      synced += 1;
    } catch {
      remaining.push(item);
      failed += 1;
    }
  }

  await writeQueue(remaining);
  return { synced, failed };
}

export async function getPendingOfflineCount(): Promise<number> {
  const queue = await readQueue();
  return queue.length;
}