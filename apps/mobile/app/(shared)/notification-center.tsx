import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

const TABS = ["All", "Sessions", "Escrow", "Chat", "System"] as const;

type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: string;
};

export default function NotificationCenterScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const primary = "#0D9488";

  const load = async () => {
    let cancelled = false;
    setLoading(true);
    try {
      const data = await apiRequest<Notification[]>(paths.notifications);
      if (!cancelled) setNotifications(Array.isArray(data) ? data : []);
    } catch {
      // keep UI
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = notifications.filter((n) => {
    if (tab === "All") return true;
    return n.type === tab.toUpperCase();
  });
  const unreadCount = notifications.filter((n) => !n.read).length;

  const iconFor = (type: string) => {
    if (type === "SESSIONS") return "📍";
    if (type === "ESCROW") return "💰";
    if (type === "CHAT") return "💬";
    if (type === "SYSTEM") return "📋";
    return "🔔";
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: primary }]}>
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>{unreadCount}</Text>
          </View>
        )}
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
            <Text style={{ color: tab === t ? "#fff" : sub, fontWeight: "800", fontSize: 12 }}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 40 }}>
          {filtered.map((n) => (
            <View
              key={n.id}
              style={[
                styles.card,
                {
                  backgroundColor: card,
                  borderColor: n.read ? border : primary + "55",
                },
              ]}
            >
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9" },
                    ]}
                  >
                    <Text style={{ fontSize: 16 }}>{iconFor(n.type)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      {!n.read && <View style={[styles.dot, { backgroundColor: primary }]} />}
                      <Text style={{ color: text, fontWeight: "800", fontSize: 13, flex: 1 }}>
                        {n.title}
                      </Text>
                    </View>
                    <Text style={{ color: sub, fontSize: 12, marginTop: 3 }}>{n.body}</Text>
                  </View>
                </View>
                <Text style={{ color: sub, fontSize: 11 }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
              No notifications in this category
            </Text>
          )}
        </ScrollView>
      )}
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
  title: { fontSize: 16, fontWeight: "800", flex: 1 },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  tabs: { maxHeight: 48, paddingHorizontal: 12, paddingTop: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginRight: 8 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
});