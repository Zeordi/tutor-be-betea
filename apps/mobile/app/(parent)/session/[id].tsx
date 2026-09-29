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
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: sub }}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: text }]}>Session attendance</Text>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        {error ? (
          <View style={[styles.banner, { backgroundColor: isDark ? "rgba(220,38,38,0.2)" : "#FEE2E2", borderColor: isDark ? "rgba(220,38,38,0.35)" : "#FECACA" }]}>
            <Text style={{ color: isDark ? "#FCA5A5" : "#991B1B", fontWeight: "700" }}>{error}</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : logs.length === 0 ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <Text style={{ fontSize: 32 }}>📅</Text>
            <Text style={[styles.emptyTitle, { color: text, marginTop: 8 }]}>No sessions yet</Text>
            <Text style={{ color: sub, fontSize: 12, textAlign: "center", marginTop: 4 }}>
              Attendance will show after tutor check-in.
            </Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
              <Text style={[styles.label, { color: sub }]}>
                {new Date(log.checkInTime).toLocaleString()}
              </Text>
              <View style={[styles.chipRow, { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9" }]}>
                <Text style={{ color: text, fontSize: 12 }}>
                  Geofence: {log.isVerifiedGeofence ? "Verified ✅" : "Not verified"}
                </Text>
                {log.requiresManualConfirm && (
                  <View style={[styles.chip, { backgroundColor: isDark ? "rgba(245,158,11,0.2)" : "#FEF3C7" }]}>
                    <Text style={{ color: isDark ? "#FCD34D" : "#D97706", fontSize: 10, fontWeight: "700" }}>Manual confirm</Text>
                  </View>
                )}
              </View>
              <Text style={{ color: sub, marginTop: 6 }}>
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
  chipRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, padding: 8, borderRadius: 12 },
  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  banner: { borderRadius: 12, borderWidth: 1, padding: 12 },
  emptyTitle: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  cta: { marginTop: 12, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
