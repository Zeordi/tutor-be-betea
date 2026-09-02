import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL = [
  {
    group: "Session Alerts",
    items: [
      { label: "Session reminders", desc: "30 min before session", on: true },
      { label: "Check-in confirmed", desc: "When tutor arrives", on: true },
      { label: "Session completed", desc: "Post-session summary", on: true },
    ],
  },
  {
    group: "Payments",
    items: [
      { label: "Payment received", desc: "Deposit & withdrawals", on: true },
      { label: "Milestone released", desc: "Escrow updates", on: true },
      { label: "Invoice available", desc: "Monthly invoices", on: false },
    ],
  },
  {
    group: "Safety",
    items: [
      { label: "Geofence alerts", desc: "Location check-in/out", on: true },
      { label: "SOS confirmed", desc: "Emergency alerts sent", on: true },
    ],
  },
];

export default function NotificationSettingsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [groups, setGroups] = useState(INITIAL);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  const toggle = (gi: number, ii: number) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i !== gi
          ? g
          : {
              ...g,
              items: g.items.map((item, j) =>
                j === ii ? { ...item, on: !item.on } : item
              ),
            }
      )
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Notification Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {groups.map((g, gi) => (
          <View key={g.group} style={{ marginBottom: 16 }}>
            <Text style={[styles.section, { color: sub }]}>{g.group.toUpperCase()}</Text>
            <View style={[styles.card, { backgroundColor: card }]}>
              {g.items.map((item, ii) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.row, ii > 0 && { borderTopWidth: 1, borderTopColor: border }]}
                  onPress={() => toggle(gi, ii)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>{item.label}</Text>
                    <Text style={{ color: sub, fontSize: 11 }}>{item.desc}</Text>
                  </View>
                  <View
                    style={[
                      styles.toggle,
                      { backgroundColor: item.on ? primary : "#CBD5E1" },
                    ]}
                  >
                    <View
                      style={[
                        styles.knob,
                        { marginLeft: item.on ? 18 : 2 },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
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
  content: { padding: 16, paddingBottom: 40 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8 },
  card: { borderRadius: 16, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
  },
  knob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
  },
});