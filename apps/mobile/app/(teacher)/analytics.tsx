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
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Analytics</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {[
            ["💰", "Total Earned", "12,800 ETB", "+18%"],
            ["📚", "Sessions", "32", "+5"],
            ["⭐", "Avg Rating", "4.9", "+0.1"],
            ["👁️", "Profile Views", "284", "+34%"],
          ].map(([icon, label, value, delta]) => (
            <View key={label} style={[styles.metric, { backgroundColor: card }]}>
              <Text style={{ fontSize: 16 }}>{icon}</Text>
              <Text style={{ color: text, fontWeight: "900", fontSize: 16, marginTop: 4 }}>
                {value}
              </Text>
              <Text style={{ color: sub, fontSize: 11 }}>{label}</Text>
              <Text style={{ color: primary, fontSize: 10, fontWeight: "700", marginTop: 2 }}>
                {delta} vs last month
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.section, { color: sub }]}>SESSIONS BY SUBJECT</Text>
          {[
            ["Mathematics", 18, 56],
            ["Physics", 10, 31],
            ["Statistics", 4, 13],
          ].map(([s, n, pct]) => (
            <View key={String(s)} style={{ marginBottom: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: text, fontSize: 12 }}>{s}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>
                  {n} sessions ({pct}%)
                </Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: isDark ? "#1E3A5F" : "#E2E8F0" }]}>
                <View style={[styles.barFill, { width: `${pct}%` as any }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.forecast}>
          <Text style={styles.forecastLabel}>📈 EARNINGS FORECAST</Text>
          <Text style={styles.forecastValue}>14,400 ETB</Text>
          <Text style={styles.forecastSub}>
            Estimated next month based on current bookings
          </Text>
        </View>
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