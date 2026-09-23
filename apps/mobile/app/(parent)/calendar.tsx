import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type Contract = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  teacher: { fullName: string };
  student: { studentName: string };
};

export default function AvailabilityCalendarScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiRequest<Contract[]>(paths.contractsParent)
      .then((data) => {
        if (!cancelled) setContracts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setContracts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const bg = colors.bg ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.sub ?? (isDark ? "#94A3B8" : "#64748B");
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: text }]}>Sessions</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: text }]}>Sessions</Text>
          <Text style={{ color: sub, fontSize: 10 }}>{contracts.length} active sessions</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {contracts.length === 0 ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: border, alignItems: "center", paddingVertical: 32 }]}>
            <Text style={{ color: sub, fontSize: 14, textAlign: "center" }}>No sessions scheduled yet</Text>
            <Text style={{ color: sub, fontSize: 11, marginTop: 4, textAlign: "center" }}>
              Your active and upcoming sessions will appear here.
            </Text>
          </View>
        ) : (
          contracts.map((c) => {
            const start = new Date(c.startDate);
            const end = new Date(c.endDate);
            const dateLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
            const timeLabel = start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
            return (
              <View key={c.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
                <View style={styles.rowBetween}>
                  <Text style={{ color: text, fontWeight: "800", fontSize: 14 }}>{c.student.studentName}</Text>
                  <View style={[styles.pill, { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9" }]}>
                    <Text style={{ color: sub, fontSize: 10, fontWeight: "700" }}>{c.status}</Text>
                  </View>
                </View>
                <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
                  📅 {dateLabel} · {timeLabel}
                </Text>
                <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>
                  Tutor: {c.teacher.fullName}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "800" },
  content: { padding: 14, paddingBottom: 40, gap: 10 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
});