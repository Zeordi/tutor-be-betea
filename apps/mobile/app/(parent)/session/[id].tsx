import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";

export default function ParentSessionScreen() {
  const { id: contractId } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const router = useRouter();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const headerBg = isDark ? "#0F1B2D" : "#FFFFFF";

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/attendance/contract/${contractId}`);
      setLogs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      // keep empty — UI still shows Figma-style status cards
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [contractId])
  );

  const open = logs.find((l) => !l.checkOutTime) || null;
  const latestClosed = logs.find((l) => l.checkOutTime) || null;

  const confirmAttendance = async (attendanceId: string) => {
    try {
      setConfirmingId(attendanceId);
      await api.post(`/attendance/${attendanceId}/confirm`, {});
      Alert.alert("Confirmed", "Session confirmed successfully.");
      await load();
    } catch (e: any) {
      Alert.alert("Confirm failed", e.message || "Please try again");
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: text }]}>Live Session</Text>
          <Text style={{ color: sub, fontSize: 11 }}>Contract · {String(contractId).slice(0, 8)}…</Text>
        </View>
        <View style={[styles.livePill, { backgroundColor: open ? "#10B981" : "#94A3B8" }]}>
          <Text style={styles.livePillText}>{open ? "LIVE" : "IDLE"}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      >
        {/* Geofence map-style card — Figma */}
        <View style={[styles.mapCard, { backgroundColor: isDark ? "rgba(13,148,136,0.12)" : "#F0FDFA" }]}>
          <View style={styles.geoRing}>
            <View style={styles.geoDot} />
          </View>
          <Text style={{ color: text, fontWeight: "800", fontSize: 13, marginTop: 8 }}>
            150m Geofence
          </Text>
          <Text style={{ color: sub, fontSize: 11, textAlign: "center", marginTop: 4 }}>
            Teacher must check in within 150m of your home location
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.cardTitle, { color: text }]}>Current status</Text>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 12 }} color={primary} />
          ) : open ? (
            <>
              <Text style={{ color: text, marginTop: 8, fontWeight: "700" }}>
                Teacher is checked in
              </Text>
              <Text style={{ color: sub, marginTop: 4, fontSize: 12 }}>
                Since {new Date(open.checkInTime).toLocaleString()}
              </Text>
              <Text style={{ color: sub, marginTop: 4, fontSize: 12 }}>
                Distance: {Number(open.distanceMeters)}m ·{" "}
                {open.isVerifiedGeofence ? "✅ Geofence verified" : "⚠️ Needs confirmation"}
              </Text>
            </>
          ) : (
            <Text style={{ color: sub, marginTop: 8, fontSize: 13 }}>
              Waiting for teacher check-in
            </Text>
          )}
        </View>

        {latestClosed && !latestClosed.parentConfirmed && (
          <View style={[styles.card, { backgroundColor: card, borderColor: "#F59E0B", borderWidth: 1 }]}>
            <Text style={[styles.cardTitle, { color: text }]}>Awaiting your confirmation</Text>
            <Text style={{ color: sub, marginTop: 6, fontSize: 12 }}>
              {new Date(latestClosed.checkInTime).toLocaleString()} →{" "}
              {new Date(latestClosed.checkOutTime).toLocaleString()}
            </Text>
            <Text style={{ color: sub, marginTop: 4, fontSize: 12 }}>
              Distance: {Number(latestClosed.distanceMeters)}m ·{" "}
              {latestClosed.isVerifiedGeofence ? "Verified" : "Outside geofence"}
            </Text>
            <Pressable
              style={[styles.primaryBtn, { backgroundColor: primary }]}
              onPress={() => confirmAttendance(latestClosed.id)}
              disabled={confirmingId === latestClosed.id}
            >
              {confirmingId === latestClosed.id ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryBtnText}>Confirm session</Text>
              )}
            </Pressable>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: text }]}>Recent attendance</Text>
        {logs.length === 0 && !loading ? (
          <Text style={{ color: sub }}>No sessions yet.</Text>
        ) : (
          logs.slice(0, 8).map((log) => (
            <View key={log.id} style={[styles.row, { backgroundColor: card }]}>
              <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>
                {new Date(log.checkInTime).toLocaleDateString()}
              </Text>
              <Text style={{ color: sub, marginTop: 4, fontSize: 12 }}>
                {log.checkOutTime
                  ? `Out: ${new Date(log.checkOutTime).toLocaleTimeString()}`
                  : "In progress"}
              </Text>
              <Text style={{ color: sub, marginTop: 2, fontSize: 12 }}>
                {Number(log.distanceMeters)}m ·{" "}
                {log.parentConfirmed
                  ? "Parent confirmed"
                  : log.isVerifiedGeofence
                    ? "Geofence OK"
                    : "Needs confirm"}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  livePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  livePillText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  content: { padding: 16, paddingBottom: 40 },
  mapCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 12,
  },
  geoRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "rgba(13,148,136,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  geoDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#0D9488",
  },
  card: { marginTop: 4, padding: 16, borderRadius: 18, marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: "800" },
  sectionTitle: { marginTop: 18, marginBottom: 10, fontSize: 14, fontWeight: "800" },
  row: { padding: 14, borderRadius: 14, marginBottom: 8 },
  primaryBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});