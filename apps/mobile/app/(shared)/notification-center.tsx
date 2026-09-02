import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS = [
  { title: "Tutor checked in", body: "Selamawit is at your location", time: "2m", type: "session" },
  { title: "Escrow released", body: "675 ETB milestone confirmed", time: "1h", type: "payment" },
  { title: "New application", body: "3 tutors applied to your job", time: "3h", type: "job" },
];

export default function NotificationCenterScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Notifications</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
        {ITEMS.map((n, i) => (
          <View key={i} style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.rowBetween}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>{n.title}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>{n.time}</Text>
            </View>
            <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>{n.body}</Text>
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
  card: { borderRadius: 14, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
});