import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeacherAnalyticsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#2563EB";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>Analytics</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", marginBottom: 6 }}>No analytics yet</Text>
        <Text style={{ color: sub, fontSize: 12, textAlign: "center", lineHeight: 18 }}>
          Analytics will appear here after you complete sessions and receive reviews.
        </Text>
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
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metric: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
  },
  card: { borderRadius: 16, padding: 14 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 10 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barBg: { height: 6, borderRadius: 99, overflow: "hidden" },
  barFill: { height: 6, borderRadius: 99, backgroundColor: "#0D9488" },
  forecast: {
    backgroundColor: "#0F766E",
    borderRadius: 18,
    padding: 16,
  },
  forecastLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  forecastValue: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 4 },
  forecastSub: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 4 },
});
