import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type AttendanceLog = {
  id: string;
  checkInTime: string;
  checkOutTime?: string | null;
  distanceMeters?: number | null;
  isVerifiedGeofence?: boolean;
  requiresManualConfirm?: boolean;
  parentConfirmed?: boolean;
};

export default function ParentSessionScreen() {
  const router = useRouter();
  const { id: contractId } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    if (!contractId) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<AttendanceLog[]>(paths.attendanceByContract(String(contractId)));
      setLogs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [contractId]);

  const confirmAttendance = async (attendanceId: string) => {
    setConfirmingId(attendanceId);
    try {
      await apiRequest(paths.attendanceConfirm(attendanceId), {
        method: "POST",
        body: JSON.stringify({}),
      });
      Alert.alert("Confirmed", "Session attendance confirmed.");
      await load();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Confirm failed");
    } finally {
      setConfirmingId(null);
    }
  };

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: sub }}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: text }]}>Session attendance</Text>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        {error ? (
          <View style={[styles.banner, { backgroundColor: "#FEE2E2", borderColor: "#FECACA" }]}>
            <Text style={{ fontWeight: "700", color: "#991B1B" }}>{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : logs.length === 0 ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: colors.border }]}>
            <Text style={{ color: sub }}>No sessions yet. Attendance will show after tutor check-in.</Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={[styles.card, { backgroundColor: card, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: sub }]}>
                {new Date(log.checkInTime).toLocaleString()}
              </Text>
              <Text style={{ color: text, marginTop: 4 }}>
                Geofence: {log.isVerifiedGeofence ? "Verified ✅" : "Not verified"}
                {log.requiresManualConfirm ? " · ⚠️ Manual confirm required" : ""}
              </Text>
              <Text style={{ color: sub, marginTop: 2 }}>
                Distance: {Number(log.distanceMeters ?? 0).toLocaleString()}m
              </Text>
              <Text style={{ color: sub, marginTop: 2 }}>
                Parent confirmed: {log.parentConfirmed ? "Yes ✅" : "No"}
              </Text>
              {!log.parentConfirmed && log.checkOutTime && (
                <Pressable
                  style={[styles.cta, { backgroundColor: primary }]}
                  disabled={confirmingId === log.id}
                  onPress={() => confirmAttendance(log.id)}
                >
                  <Text style={styles.ctaText}>
                    {confirmingId === log.id ? "Confirming…" : "Confirm session"}
                  </Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: "800" },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  banner: { borderRadius: 12, borderWidth: 1, padding: 12 },
  cta: { marginTop: 12, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
