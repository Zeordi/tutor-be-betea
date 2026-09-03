import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";

type Tab = "All" | "Sessions" | "Escrow" | "Chat" | "System";

const TABS: Tab[] = ["All", "Sessions", "Escrow", "Chat", "System"];

const NOTIFS = [
  {
    id: "1",
    tab: "Sessions" as Tab,
    icon: "📅",
    title: "Session reminder",
    body: "Mathematics with Hana Bekele starts in 2 hours (4:00 PM, Sarbet).",
    time: "12m",
    unread: true,
  },
  {
    id: "2",
    tab: "Escrow" as Tab,
    icon: "💰",
    title: "Escrow released",
    body: "450 ETB released to tutor after verified attendance for Session 17.",
    time: "1h",
    unread: true,
  },
  {
    id: "3",
    tab: "Chat" as Tab,
    icon: "💬",
    title: "New message",
    body: "Hana Bekele: “Homework feedback is ready for Liya.”",
    time: "3h",
    unread: true,
  },
  {
    id: "4",
    tab: "System" as Tab,
    icon: "🛡️",
    title: "Trust Badge update",
    body: "Your tutor’s Degree Verified badge was reconfirmed by the board.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "5",
    tab: "Sessions" as Tab,
    icon: "✅",
    title: "Check-in confirmed",
    body: "Geofenced check-in within 150m · Session marked attended.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "6",
    tab: "Escrow" as Tab,
    icon: "⏳",
    title: "Payment held in escrow",
    body: "3,600 ETB package payment secured. Released per milestone.",
    time: "2d",
    unread: false,
  },
];

export default function NotificationsFeedScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [tab, setTab] = useState<Tab>("All");

  const data = tab === "All" ? NOTIFS : NOTIFS.filter((n) => n.tab === tab);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, flex: 1, marginLeft: 10 }]}>
          Notifications
        </Text>
        <TouchableOpacity onPress={() => router.push("/(parent)/notification-settings")}>
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabs, { borderBottomColor: colors.border }]}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      >
        {TABS.map((t) => {
          const active = tab === t;
          const count = t === "All" ? NOTIFS.filter((n) => n.unread).length : NOTIFS.filter((n) => n.tab === t && n.unread).length;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tabChip,
                {
                  backgroundColor: active ? colors.primary : isDark ? "#1e293b" : "#f1f5f9",
                },
              ]}
            >
              <Text style={{ color: active ? "#fff" : colors.sub, fontWeight: "700", fontSize: 12 }}>
                {t}
              </Text>
              {count > 0 && (
                <View style={[styles.dot, { backgroundColor: active ? "#fff" : "#ef4444" }]}>
                  <Text style={{ color: active ? colors.primary : "#fff", fontSize: 9, fontWeight: "800" }}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14, paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={{ color: colors.sub, textAlign: "center", marginTop: 40 }}>
            No notifications in this category
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: item.unread ? 1 : 0.85,
              },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13 }}>
                  {item.title}
                </Text>
                <Text style={{ color: colors.sub, fontSize: 10 }}>{item.time}</Text>
              </View>
              <Text style={{ color: colors.sub, fontSize: 11, marginTop: 3, lineHeight: 16 }}>
                {item.body}
              </Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  tabs: { maxHeight: 52, borderBottomWidth: 1, paddingVertical: 8 },
  tabChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  dot: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  card: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0d9488",
    marginTop: 6,
  },
});