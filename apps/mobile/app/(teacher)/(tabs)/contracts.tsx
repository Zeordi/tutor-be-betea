import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const CONTRACTS = [
  {
    id: "c1",
    parent: "Yeshi Haile",
    student: "Kidane M.",
    subject: "Mathematics",
    grade: "10",
    sessions: "24 done / 40 total",
    monthly: "9,000",
    next: "Today 4:00 PM",
    milestone: "3/4",
    status: "Active",
  },
  {
    id: "c2",
    parent: "Abebe Girma",
    student: "Liya A.",
    subject: "Physics",
    grade: "11",
    sessions: "6 done / 20 total",
    monthly: "10,000",
    next: "Thu 3:00 PM",
    milestone: "1/3",
    status: "Active",
  },
  {
    id: "c3",
    parent: "Hanna Bekele",
    student: "Yonatan T.",
    subject: "Chemistry",
    grade: "12",
    sessions: "0 done / 16 total",
    monthly: "11,000",
    next: "Mon 5:00 PM",
    milestone: "0/2",
    status: "Pending",
  },
];

export default function ActiveContractsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const surface = isDark ? "#1E293B" : "#F8FAFC";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>
          Active Contracts
        </Text>
        <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>
          3 active · 2 pending start
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, gap: 10, paddingBottom: 100 }}>
        {CONTRACTS.map((c) => (
          <View
            key={c.id}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
          >
            <View style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: primary }]}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>
                  {c.student[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>
                  {c.student} (Gr.{c.grade})
                </Text>
                <Text style={{ color: sub, fontSize: 11 }}>
                  {c.subject} · Parent: {c.parent}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      c.status === "Active" ? "#CCFBF1" : "#FEF3C7",
                  },
                ]}
              >
                <Text
                  style={{
                    color: c.status === "Active" ? "#0F766E" : "#D97706",
                    fontSize: 10,
                    fontWeight: "700",
                  }}
                >
                  {c.status}
                </Text>
              </View>
            </View>

            <View style={styles.grid}>
              {[
                [`${c.monthly} ETB/mo`, "💰"],
                [c.sessions, "📚"],
                [`Milestone ${c.milestone}`, "⏳"],
                [c.next, "📅"],
              ].map(([v, icon]) => (
                <View
                  key={String(v)}
                  style={[styles.gridItem, { backgroundColor: surface }]}
                >
                  <Text style={{ fontSize: 13 }}>{icon}</Text>
                  <Text
                    style={{
                      color: text,
                      fontSize: 10,
                      fontWeight: "700",
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {v}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: primary }]}
                onPress={() => router.push(`/(teacher)/session/${c.id}`)}
              >
                <Text style={styles.primaryText}>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineBtn, { borderColor: border }]}
                onPress={() => router.push(`/(shared)/chat/${c.id}`)}
              >
                <Text style={{ color: sub, fontWeight: "700", fontSize: 12 }}>
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineBtn, { borderColor: primary }]}
                onPress={() => router.push(`/(teacher)/contract/${c.id}`)}
              >
                <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>
                  Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  gridItem: {
    width: "47%",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actions: { flexDirection: "row", gap: 8 },
  primaryBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  outlineBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },
});