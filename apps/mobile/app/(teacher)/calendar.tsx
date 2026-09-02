import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [2, 3, 4, 5, 6, 7, 8];
const SESSIONS = [
  { day: "Mon", time: "4:00 PM", student: "Kidane M.", sub: "Mathematics" },
  { day: "Wed", time: "3:00 PM", student: "Liya A.", sub: "Physics" },
  { day: "Fri", time: "5:00 PM", student: "Kidane M.", sub: "Algebra" },
  { day: "Sat", time: "10:00 AM", student: "Meron H.", sub: "English" },
];

export default function TeacherCalendarScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Calendar</Text>
        <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>June 2025</Text>
      </View>

      <View style={styles.weekStrip}>
        {DAYS.map((d, i) => {
          const active = i === 0;
          const hasSession = SESSIONS.some((s) => s.day === d);
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
          MONDAY, JUNE 2 — {SESSIONS.length} SESSIONS THIS WEEK
        </Text>
        {SESSIONS.map((s, i) => (
          <View key={i} style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.timeCol}>
              <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>{s.day}</Text>
              <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>{s.time}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: border }]} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800" }}>{s.student}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>{s.sub}</Text>
            </View>
          </View>
        ))}
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