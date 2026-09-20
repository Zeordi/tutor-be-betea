import { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Session = {
  id: string;
  studentName: string;
  subject: string;
  nextSessionAt: string;
};

export default function TeacherCalendarScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<any[]>([]);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    apiRequest<any[]>(paths.contractsTeacher)
      .then((data) => {
        if (!cancelled) setContracts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load calendar");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const sessions: Session[] = useMemo(() => {
    return contracts
      .filter((c) => c.nextSessionAt)
      .map((c) => ({
        id: c.id,
        studentName: c.studentName || c.parentName || "Student",
        subject: c.subject,
        nextSessionAt: c.nextSessionAt,
      }));
  }, [contracts]);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const DATES = [2, 3, 4, 5, 6, 7, 8];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={[styles.title, { color: text }]}>Calendar</Text>
          <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>June 2025</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={[styles.title, { color: text }]}>Calendar</Text>
          <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>June 2025</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity onPress={() => { setError(""); setLoading(true); apiRequest<any[]>(paths.contractsTeacher).then((data) => setContracts(Array.isArray(data) ? data : [])).catch((e) => setError(e.message)).finally(() => setLoading(false)); }} style={{ backgroundColor: primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Calendar</Text>
        <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>June 2025</Text>
      </View>

      <View style={styles.weekStrip}>
        {DAYS.map((d, i) => {
          const active = i === 0;
          const hasSession = sessions.some((s) => {
            const d = new Date(s.nextSessionAt).getDay();
            return d === (i + 1) % 7;
          });
          return (
            <View
              key={d}
              style={[
                styles.dayCell,
                active && { backgroundColor: primary },
              ]}
            >
              <Text style={{ color: active ? "#fff" : sub, fontSize: 9, fontWeight: "700" }}>
                {d}
              </Text>
              <Text style={{ color: active ? "#fff" : text, fontWeight: "900", fontSize: 13 }}>
                {DATES[i]}
              </Text>
              {hasSession && (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: active ? "#fff" : primary },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.section, { color: sub }]}>
          THIS WEEK — {sessions.length} SESSIONS
        </Text>
        {sessions.map((s, i) => {
          const date = new Date(s.nextSessionAt);
          const day = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1] || "Mon";
          const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <TouchableOpacity key={s.id} style={[styles.card, { backgroundColor: card }]} onPress={() => router.push(`/(teacher)/session/${s.id}`)}>
              <View style={styles.timeCol}>
                <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>{day}</Text>
                <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>{time}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: border }]} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "800" }}>{s.studentName}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{s.subject}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {sessions.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 20 }}>No upcoming sessions</Text>
        )}
        <TouchableOpacity style={[styles.addSlot, { borderColor: primary }]}>
          <Text style={{ color: primary, fontWeight: "800" }}>+ Add Available Slot</Text>
        </TouchableOpacity>
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
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontWeight: "800", flex: 1 },
  weekStrip: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
    gap: 2,
  },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4, marginBottom: 4 },
  card: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeCol: { width: 56, alignItems: "center" },
  divider: { width: 1, height: 36 },
  addSlot: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
});