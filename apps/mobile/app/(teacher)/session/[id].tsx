import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import {
  evaluateSessionGeofence,
  GEOFENCE_RADIUS_METERS,
  type GeofenceStatus,
} from "@/lib/geo";
import {
  enqueueAttendance,
  flushAttendanceQueue,
  getPendingOfflineCount,
} from "@/lib/offline";

function makeId() {
  return `off_\( {Date.now()}_ \){Math.random().toString(36).slice(2, 10)}`;
}

export default function TeacherSessionCheckInScreen() {
  const { id: contractId } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [geo, setGeo] = useState<GeofenceStatus | null>(null);
  const [openSession, setOpenSession] = useState<any | null>(null);
  const [pendingOffline, setPendingOffline] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  // Temporary default home location (Addis). Replace with contract home coords from API later.
  const parentLat = 9.03;
  const parentLng = 38.74;

  const load = async () => {
    try {
      const logs = await api.get(`/attendance/contract/${contractId}`);
      const open = (logs || []).find((l: any) => !l.checkOutTime) || null;
      setOpenSession(open);
      setPendingOffline(await getPendingOfflineCount());
    } catch {
      // offline / empty is fine
    }
  };

  useEffect(() => {
    load();
  }, [contractId]);

  const refreshGeo = async () => {
    try {
      setLoading(true);
      const status = await evaluateSessionGeofence(parentLat, parentLng);
      setGeo(status);
    } catch (e: any) {
      Alert.alert("Location error", e.message || "Could not read GPS");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const status = await evaluateSessionGeofence(parentLat, parentLng);
      setGeo(status);

      if (!status.current) {
        throw new Error("Could not get current location");
      }

      try {
        // try sync any old offline items first
        await flushAttendanceQueue();

        const data = await api.post("/attendance/check-in", {
          contractId,
          latitude: status.current.latitude,
          longitude: status.current.longitude,
          parentLat,
          parentLng,
        });

        setOpenSession(data);
        setMessage(
          status.isVerified
            ? `Checked in • ${status.distanceMeters}m (within ${GEOFENCE_RADIUS_METERS}m)`
            : `Checked in • ${status.distanceMeters}m away — parent confirmation required`,
        );

        if (!status.isVerified) {
          Alert.alert(
            "Outside geofence",
            `You are ${status.distanceMeters}m away. Parent confirmation will be required.`,
          );
        } else {
          Alert.alert("Success", "Checked in within geofence.");
        }
      } catch (onlineError: any) {
        // Network / API failure → offline queue
        await enqueueAttendance({
          id: makeId(),
          contractId: String(contractId),
          type: "CHECK_IN",
          latitude: status.current.latitude,
          longitude: status.current.longitude,
          distanceMeters: status.distanceMeters,
          isVerifiedGeofence: status.isVerified,
          createdAt: new Date().toISOString(),
        });

        setPendingOffline(await getPendingOfflineCount());
        setMessage("Saved offline. Will sync when internet returns.");
        Alert.alert(
          "Saved offline",
          onlineError?.message ||
            "No connection. Check-in stored on device and will sync later.",
        );
      }

      await load();
    } catch (e: any) {
      Alert.alert("Check-in failed", e.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const status = await evaluateSessionGeofence(parentLat, parentLng);
      setGeo(status);

      if (!status.current) {
        throw new Error("Could not get current location");
      }

      try {
        await flushAttendanceQueue();

        const data = await api.post("/attendance/check-out", {
          contractId,
          latitude: status.current.latitude,
          longitude: status.current.longitude,
        });

        setOpenSession(null);
        setMessage("Checked out successfully");
        Alert.alert("Success", "Session checked out.");
        return data;
      } catch (onlineError: any) {
        await enqueueAttendance({
          id: makeId(),
          contractId: String(contractId),
          type: "CHECK_OUT",
          latitude: status.current.latitude,
          longitude: status.current.longitude,
          distanceMeters: status.distanceMeters,
          isVerifiedGeofence: status.isVerified,
          createdAt: new Date().toISOString(),
        });

        setPendingOffline(await getPendingOfflineCount());
        setMessage("Check-out saved offline. Will sync later.");
        Alert.alert(
          "Saved offline",
          onlineError?.message || "No connection. Check-out stored on device.",
        );
      } finally {
        await load();
      }
    } catch (e: any) {
      Alert.alert("Check-out failed", e.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOffline = async () => {
    try {
      setLoading(true);
      const result = await flushAttendanceQueue();
      setPendingOffline(await getPendingOfflineCount());
      Alert.alert(
        "Sync complete",
        `Synced: ${result.synced} • Failed: ${result.failed}`,
      );
      await load();
    } catch (e: any) {
      Alert.alert("Sync failed", e.message || "Try again when online");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Session Check-in</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          You must be within {GEOFENCE_RADIUS_METERS}m of the parent’s registered
          location for automatic verification.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Geofence</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
            {geo
              ? `${geo.distanceMeters}m away • ${
                  geo.isVerified ? "Verified" : "Needs parent confirmation"
                }`
              : "Location not read yet"}
          </Text>
          <Pressable
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={refreshGeo}
            disabled={loading}
          >
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              Refresh GPS
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Session</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
            {openSession
              ? `Open since ${new Date(openSession.checkInTime).toLocaleString()}`
              : "No open session"}
          </Text>
          {pendingOffline > 0 && (
            <Text style={{ color: "#b45309", marginTop: 8, fontWeight: "600" }}>
              {pendingOffline} offline event(s) waiting to sync
            </Text>
          )}
        </View>

        {message && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text }}>{message}</Text>
          </View>
        )}

        {!openSession ? (
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={handleCheckIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Check In Now</Text>
            )}
          </Pressable>
        ) : (
          <Pressable
            style={[styles.primaryBtn, { backgroundColor: "#0f766e" }]}
            onPress={handleCheckOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Check Out</Text>
            )}
          </Pressable>
        )}

        {pendingOffline > 0 && (
          <Pressable
            style={[styles.secondaryBtn, { borderColor: colors.border, marginTop: 12 }]}
            onPress={handleSyncOffline}
            disabled={loading}
          >
            <Text style={{ color: colors.text, fontWeight: "700" }}>
              Sync offline attendance
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { marginTop: 8, lineHeight: 22, fontSize: 14 },
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  primaryBtn: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
});