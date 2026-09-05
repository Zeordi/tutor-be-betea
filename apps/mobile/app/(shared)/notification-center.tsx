import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS = ["All", "Sessions", "Escrow", "Chat", "System"] as const;

const ITEMS = [
  { title: "Tutor checked in", body: "Selamawit is at your location", time: "2m", tab: "Sessions", unread: true },
  { title: "Escrow released", body: "675 ETB milestone confirmed", time: "1h", tab: "Escrow", unread: true },
  { title: "New message", body: "Yes, I'm available for algebra", time: "2h", tab: "Chat", unread: false },
  { title: "New application", body: "3 tutors applied to your job", time: "3h", tab: "System", unread: false },
];

export default function NotificationCenterScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const primary = "#0D9488";

  const filtered = ITEMS.filter((n) => tab === "All" || n.tab === tab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Notifications</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.chip,
              { backgroundColor: tab === t ? primary : isDark ? "#1E3A5F" : "#F1F5F9" },
            ]}
          >
            <Text style={{ color: tab === t ? "#fff" : sub, fontWeight: "800", fontSize: 12 }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
        {filtered.map((n, i) => (
          <View key={i} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
                {n.unread && <View style={[styles.dot, { backgroundColor: primary }]} />}
                <Text style={{ color: text, fontWeight: "800", fontSize: 13, flex: 1 }}>{n.title}</Text>
              </View>
              <Text style={{ color: sub, fontSize: 11 }}>{n.time}</Text>
            </View>
            <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>{n.body}</Text>
          </View>
        ))}
        {filtered.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>No notifications</Text>
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
  tabs: { maxHeight: 48, paddingHorizontal: 12, paddingTop: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginRight: 8 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4 },
});