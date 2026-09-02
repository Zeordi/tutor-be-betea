import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const SESSIONS = [
  { date: "Mon, Jun 2", time: "4:00–5:30 PM", tutor: "Selamawit Tadesse", subject: "Mathematics", hours: 1.5, amount: 675, status: "Completed" },
  { date: "Thu, May 30", time: "3:00–4:30 PM", tutor: "Selamawit Tadesse", subject: "Physics", hours: 1.5, amount: 675, status: "Completed" },
  { date: "Mon, May 27", time: "4:00–5:00 PM", tutor: "Bereket Solomon", subject: "Chemistry", hours: 1, amount: 500, status: "Completed" },
  { date: "Fri, May 24", time: "5:00–6:00 PM", tutor: "Tigist Haile", subject: "Statistics", hours: 1, amount: 380, status: "Cancelled" },
];

export default function SessionHistoryScreen() {
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
        <View>
          <Text style={[styles.title, { color: text }]}>Session History</Text>
          <Text style={{ color: sub, fontSize: 11 }}>24 sessions · Filtered: All</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {SESSIONS.map((s, i) => (
          <View key={i} style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.rowBetween}>
              <Text style={{ color: sub, fontSize: 11 }}>{s.date} · {s.time}</Text>
              <Text
                style={{
                  color: s.status === "Completed" ? primary : "#EF4444",
                  fontSize: 11,
                  fontWeight: "800",
                }}
              >
                {s.status}
              </Text>
            </View>
            <Text style={[styles.subject, { color: text }]}>
              {s.subject} with {s.tutor}
            </Text>
            <View style={styles.rowBetween}>
              <Text style={{ color: sub, fontSize: 11 }}>{s.hours}h · Bole, Addis Ababa</Text>
              <Text style={{ color: text, fontWeight: "800" }}>{s.amount} ETB</Text>
            </View>
          </View>
        ))}
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
  title: { fontSize: 16, fontWeight: "800" },
  content: { padding: 16, gap: 8 },
  card: { borderRadius: 16, padding: 14 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  subject: { fontSize: 13, fontWeight: "800", marginTop: 4 },
});