import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function TeacherHomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
        <Text style={styles.heroSub}>Teacher dashboard</Text>
        <Text style={styles.heroName}>Hana Bekele</Text>
        <View style={styles.connects}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }}>24</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Connects · Standard</Text>
        </View>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        <View style={styles.kpiRow}>
          {[
            ["Today", "2 sessions"],
            ["Earnings", "18,400 ETB"],
            ["Rating", "4.9"],
          ].map(([a, b]) => (
            <View key={a} style={[styles.kpi, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{a}</Text>
              <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 14 }}>{b}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push("/(teacher)/(tabs)/jobs")}
        >
          <Text style={[styles.section, { color: colors.mutedForeground }]}>AVAILABLE JOBS</Text>
          <Text style={{ color: colors.foreground, fontWeight: "700" }}>Grade 10 Math · Bole</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>450 ETB/hr · 2 Connects to apply</Text>
        </Pressable>

        <Pressable
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push("/(teacher)/progress/submit")}
        >
          <Text style={[styles.section, { color: colors.mutedForeground }]}>ACTION NEEDED</Text>
          <Text style={{ color: colors.foreground, fontWeight: "700" }}>Submit progress report</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Kidane · Math · Due today</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 20, paddingTop: 24 },
  heroSub: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  heroName: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 4 },
  connects: {
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 12,
  },
  kpiRow: { flexDirection: "row", gap: 8 },
  kpi: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 6 },
});