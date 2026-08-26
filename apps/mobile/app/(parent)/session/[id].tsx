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
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";

export default function ParentSessionScreen() {
  const { id: contractId } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/attendance/contract/${contractId}`);
      setLogs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not load attendance");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [contractId]),
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      >
        <Text style={[styles.title, { color: colors.text }]}>Live Session</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
          Contract: {contractId}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Geofence rule
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 6, lineHeight: 20 }}>
            Teacher must check in within 150m of your registered home location.
            Outside sessions need your confirmation.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Current status
          </Text>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 12 }} />
          ) : open ? (
            <>
              <Text style={{ color: colors.text, marginTop: 8, fontWeight: "600" }}>
                Teacher is checked in
              </Text>
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                Since {new Date(open.checkInTime).toLocaleString()}
              </Text>
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                Distance: {Number(open.distanceMeters)}m •{" "}
                {open.isVerifiedGeofence ? "Geofence verified" : "Needs confirmation"}
              </Text>
            </>
          ) : (
            <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
              Waiting for teacher check-in
            </Text>
          )}
        </View>

        {latestClosed && !latestClosed.parentConfirmed && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Awaiting your confirmation
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
              {new Date(latestClosed.checkInTime).toLocaleString()} →{" "}
              {new Date(latestClosed.checkOutTime).toLocaleString()}
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
              Distance: {Number(latestClosed.distanceMeters)}m •{" "}
              {latestClosed.isVerifiedGeofence ? "Verified" : "Outside geofence"}
            </Text>

            <Pressable
              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
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

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent attendance
        </Text>

        {logs.length === 0 && !loading ? (
          <Text style={{ color: colors.textSecondary }}>No sessions yet.</Text>
        ) : (
          logs.slice(0, 8).map((log) => (
            <View
              key={log.id}
              style={[styles.row, { backgroundColor: colors.surface }]}
            >
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                {new Date(log.checkInTime).toLocaleDateString()}
              </Text>
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                {log.checkOutTime
                  ? `Out: ${new Date(log.checkOutTime).toLocaleTimeString()}`
                  : "In progress"}
              </Text>
              <Text style={{ color: colors.textSecondary, marginTop: 2 }}>
                {Number(log.distanceMeters)}m •{" "}
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
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700" },
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  primaryBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});