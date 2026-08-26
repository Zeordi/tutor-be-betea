import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
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

  const [homeLat, setHomeLat] = useState<number | null>(null);
  const [homeLng, setHomeLng] = useState<number | null>(null);

  const load = async () => {
    try {
      const [contract, logs] = await Promise.all([
        api.get(`/contracts/${contractId}`),
        api.get(`/attendance/contract/${contractId}`),
      ]);

      if (contract?.sessionLatitude != null && contract?.sessionLongitude != null) {
        setHomeLat(Number(contract.sessionLatitude));
        setHomeLng(Number(contract.sessionLongitude));
      }

      const open = (logs || []).find((l: any) => !l.checkOutTime) || null;
      setOpenSession(open);
      setPendingOffline(await getPendingOfflineCount());
    } catch {
      // offline ok
      setPendingOffline(await getPendingOfflineCount());
    }
  };

  useEffect(() => {
    load();
  }, [contractId]);

  const refreshGeo = async () => {
    if (homeLat == null || homeLng == null) {
      Alert.alert(
        "No home location",
        "This contract has no session location yet. Ask the parent to set it.",
      );
      return;
    }
    try {
      setLoading(true);
      const status = await evaluateSessionGeofence(homeLat, homeLng);
      setGeo(status);
    } catch (e: any) {
      Alert.alert("Location error", e.message || "Could not read GPS");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (homeLat == null || homeLng == null) {
      Alert.alert("Missing location", "Parent session location is not set.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const status = await evaluateSessionGeofence(homeLat, homeLng);
      setGeo(status);
      if (!status.current) throw new Error("Could not get current location");

      const offlineId = makeId();
      const clientCreatedAt = new Date().toISOString();

      try {
        await flushAttendanceQueue();

        const data = await api.post("/attendance/check-in", {
          contractId,
          latitude: status.current.latitude,
          longitude: status.current.longitude,
          parentLat: homeLat,
          parentLng: homeLng,
          offlineId,
          clientCreatedAt,
          distanceMeters: status.distanceMeters,
          isVerifiedGeofence: status.isVerified,
        });

        setOpenSession(data);
        setMessage(data.message || "Checked in");
        Alert.alert(
          status.isVerified ? "Success" : "Outside geofence",
          data.message ||
            (status.isVerified
              ? "Checked in within geofence"
              : `You are ${status.distanceMeters}m away`),
        );
      } catch (onlineError: any) {
        await enqueueAttendance({
          id: offlineId,
          contractId: String(contractId),
          type: "CHECK_IN",
          latitude: status.current.latitude,
          longitude: status.current.longitude,
          distanceMeters: status.distanceMeters,
          isVerifiedGeofence: status.isVerified,
          createdAt: clientCreatedAt,
        });
        setPendingOffline(await getPendingOfflineCount());
        setMessage("Saved offline. Will sync when internet returns.");
        Alert.alert(
          "Saved offline",
          onlineError?.message || "Check-in stored on device.",
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
    if (homeLat == null || homeLng == null) return;

    try {
      setLoading(true);
      const status = await evaluateSessionGeofence(homeLat, homeLng);
      setGeo(status);
      if (!status.current) throw new Error("Could not get current location");

      const offlineId = makeId();
      const clientCreatedAt = new Date().toISOString();

      try {
        await flushAttendanceQueue();
        await api.post("/attendance/check-out", {
          contractId,
          latitude: status.current.latitude,
          longitude: status.current.longitude,
          offlineId,
          clientCreatedAt,
        });
        setOpenSession(null);
        setMessage("Checked out successfully");
        Alert.alert("Success", "Session checked out.");
      } catch (onlineError: any) {
        await enqueueAttendance({
          id: offlineId,
          contractId: String(contractId),
          type: "CHECK_OUT",
          latitude: status.current.latitude,
          longitude: status.current.longitude,
          distanceMeters: status.distanceMeters,
          isVerifiedGeofence: status.isVerified,
          createdAt: clientCreatedAt,
        });
        setPendingOffline(await getPendingOfflineCount());
        setMessage("Check-out saved offline.");
        Alert.alert("Saved offline", onlineError?.message || "Will sync later.");
      }

      await load();
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
      Alert.alert("Sync complete", `Synced: ${result.synced} • Failed: ${result.failed}`);
      await load();
    } catch (e: any) {
      Alert.alert("Sync failed", e.message || "Try again when online");
    } finally {
      setLoading(false);
    }
  };

  const mapReady = homeLat != null && homeLng != null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Session Check-in</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Stay within {GEOFENCE_RADIUS_METERS}m of the parent home location.
        </Text>

        {mapReady ? (
          <View style={styles.mapWrap}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: homeLat!,
                longitude: homeLng!,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: homeLat!, longitude: homeLng! }}
                title="Session home"
              />
              <Circle
                center={{ latitude: homeLat!, longitude: homeLng! }}
                radius={GEOFENCE_RADIUS_METERS}
                strokeColor="rgba(15,118,110,0.9)"
                fillColor="rgba(15,118,110,0.15)"
              />
              {geo?.current && (
                <Marker
                  coordinate={geo.current}
                  title="You"
                  pinColor={geo.isVerified ? "green" : "orange"}
                />
              )}
            </MapView>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.textSecondary }}>
              No session coordinates on this contract yet.
            </Text>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Geofence</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
            {geo
              ? `${geo.distanceMeters}m • ${
                  geo.isVerified ? "Verified" : "Needs parent confirmation"
                }`
              : "Location not read yet"}
          </Text>
          <Pressable
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={refreshGeo}
            disabled={loading}
          >
            <Text style={{ color: colors.text, fontWeight: "600" }}>Refresh GPS</Text>
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
  content: { padding: 16, flex: 1 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { marginTop: 6, marginBottom: 10, fontSize: 14, lineHeight: 20 },
  mapWrap: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  map: { flex: 1 },
  card: { marginTop: 12, padding: 14, borderRadius: 16 },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  primaryBtn: {
    marginTop: 20,
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