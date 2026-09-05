import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const APPS = [
  {
    id: "1",
    title: "Grade 12 Physics Tutor",
    parent: "Yeshi H.",
    area: "Bole",
    rate: "500 ETB/hr",
    status: "Shortlisted",
    when: "2h ago",
  },
  {
    id: "2",
    title: "Mathematics Grade 9",
    parent: "Abebe G.",
    area: "Kazanchis",
    rate: "400 ETB/hr",
    status: "Hired",
    when: "1d ago",
  },
  {
    id: "3",
    title: "Chemistry – Grade 11",
    parent: "Hiwot T.",
    area: "Arat Kilo",
    rate: "450 ETB/hr",
    status: "Pending",
    when: "2d ago",
  },
  {
    id: "4",
    title: "University Calculus",
    parent: "Girma B.",
    area: "Sidist Kilo",
    rate: "600 ETB/hr",
    status: "Declined",
    when: "5d ago",
  },
];

const TABS = ["All", "Pending", "Shortlisted", "Hired", "Declined"];

export default function MyApplicationsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState("All");

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  const statusStyle = (s: string) => {
    if (s === "Hired") return { bg: "#D1FAE5", fg: "#047857" };
    if (s === "Shortlisted") return { bg: "#CCFBF1", fg: "#0F766E" };
    if (s === "Declined") return { bg: "#FEE2E2", fg: "#DC2626" };
    return { bg: isDark ? "#1E293B" : "#F1F5F9", fg: sub };
  };

  const list =
    tab === "All" ? APPS : APPS.filter((a) => a.status === tab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: text }]}>My Applications</Text>
          <Text style={{ color: sub, fontSize: 11 }}>8 applications · 3 active</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 48 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tabChip,
              {
                backgroundColor: tab === t ? primary : isDark ? "#112240" : "#F1F5F9",
              },
            ]}
          >
            <Text
              style={{
                color: tab === t ? "#fff" : sub,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {list.map((a) => {
          const st = statusStyle(a.status);
          return (
            <View
              key={a.id}
              style={[styles.card, { backgroundColor: card, borderColor: border }]}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.job, { color: text }]}>{a.title}</Text>
                <View style={[styles.pill, { backgroundColor: st.bg }]}>
                  <Text style={{ color: st.fg, fontWeight: "800", fontSize: 10 }}>
                    {a.status}
                  </Text>
                </View>
              </View>
              <Text style={{ color: sub, fontSize: 11, marginTop: 4 }}>
                📍 {a.area} · {a.rate} · Applied {a.when}
              </Text>
              <Text style={{ color: sub, fontSize: 10, marginTop: 2 }}>
                Parent: {a.parent}
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
                <Text
                  style={{
                    color: primary,
                    fontSize: 11,
                    fontWeight: "700",
                    marginTop: 8,
                  }}
                >
                  ✓ Parent is reviewing your profile
                </Text>
              )}
              {a.status === "Pending" && (
                <TouchableOpacity
                  style={[styles.outline, { borderColor: border }]}
                  onPress={() => router.push(`/(teacher)/job/${a.id}`)}
                >
                  <Text style={{ color: sub, fontWeight: "700", fontSize: 12 }}>
                    View job
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
        {list.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
            No applications in this tab
          </Text>
        )}
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
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 6,
  },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "flex-start",
  },
  job: { fontSize: 13, fontWeight: "800", flex: 1 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  btn: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  outline: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },
});