import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const SESSIONS = [
  { id: "s1", student: "Kidane", subject: "Math", when: "Oct 12 · 4:00 PM", tutor: "Selamawit", status: "Completed", amount: "675 ETB" },
  { id: "s2", student: "Meron", subject: "English", when: "Oct 10 · 3:00 PM", tutor: "Bereket", status: "Completed", amount: "500 ETB" },
  { id: "s3", student: "Kidane", subject: "Physics", when: "Oct 8 · 5:00 PM", tutor: "Selamawit", status: "Disputed", amount: "675 ETB" },
];

export default function SessionHistoryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
          Session History
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 14, gap: 10 }}>
        {SESSIONS.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push(`/(parent)/session/${s.id}`)}
          >
            <View style={styles.row}>
              <Text style={{ color: text, fontWeight: "800", flex: 1 }}>
                {s.student} · {s.subject}
              </Text>
              <Text
                style={{
                  color: s.status === "Disputed" ? "#DC2626" : "#059669",
                  fontWeight: "800",
                  fontSize: 11,
                }}
              >
                {s.status}
              </Text>
            </View>
            <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
              {s.when} · {s.tutor}
            </Text>
            <Text style={{ color: primary, fontWeight: "800", marginTop: 6 }}>{s.amount}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  row: { flexDirection: "row", alignItems: "center" },
});