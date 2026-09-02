import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const APPS = [
  { title: "Grade 12 Physics Tutor", area: "Bole", rate: "500 ETB/hr", status: "Shortlisted", when: "2h ago" },
  { title: "Mathematics Grade 9", area: "Kazanchis", rate: "400 ETB/hr", status: "Hired", when: "1d ago" },
  { title: "Chemistry – Grade 11", area: "Arat Kilo", rate: "450 ETB/hr", status: "Pending", when: "2d ago" },
  { title: "University Calculus", area: "Sidist Kilo", rate: "600 ETB/hr", status: "Declined", when: "5d ago" },
];

export default function MyApplicationsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  const statusColor = (s: string) => {
    if (s === "Hired") return primary;
    if (s === "Shortlisted") return "#0EA5E9";
    if (s === "Declined") return "#EF4444";
    return sub;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: text }]}>My Applications</Text>
          <Text style={{ color: sub, fontSize: 11 }}>8 applications · 3 active</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {APPS.map((a) => (
          <View key={a.title} style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.job, { color: text }]}>{a.title}</Text>
              <Text style={{ color: statusColor(a.status), fontWeight: "800", fontSize: 11 }}>
                {a.status}
              </Text>
            </View>
            <Text style={{ color: sub, fontSize: 11, marginTop: 4 }}>
              📍 {a.area} · {a.rate} · Applied {a.when}
            </Text>
            {a.status === "Hired" && (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: primary }]}
                onPress={() => router.push("/(teacher)/(tabs)/contracts")}
              >
                <Text style={styles.btnText}>View Contract →</Text>
              </TouchableOpacity>
            )}
            {a.status === "Shortlisted" && (
              <Text style={{ color: primary, fontSize: 11, fontWeight: "700", marginTop: 8 }}>
                ✓ Parent is reviewing your profile
              </Text>
            )}
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
  content: { padding: 16, gap: 10 },
  card: { borderRadius: 16, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  job: { fontSize: 13, fontWeight: "800", flex: 1 },
  btn: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
});