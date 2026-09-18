import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type Tab = "All" | "SESSIONS" | "ESCROW" | "CHAT" | "SYSTEM" | "PAYMENT";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsFeedScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Notification[]>([]);
  const [tab, setTab] = useState<Tab>("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Notification[]>(paths.notifications)
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load notifications");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;
  const data = tab === "All" ? items : items.filter((n) => n.type === tab);

  const markRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await apiRequest(paths.notificationRead(id), { method: "POST" });
    } catch {
      // best-effort
    }
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await apiRequest(paths.notificationsReadAll, { method: "POST" });
    } catch {
      // best-effort
    }
  };

  const catIcon = (cat: string) => {
    const m: Record<string, string> = {
      SESSIONS: "📅",
      ESCROW: "🔒",
      CHAT: "💬",
      SYSTEM: "🛡️",
      PAYMENT: "💳",
    };
    return m[cat] || "🔔";
  };

  const tabs: Tab[] = ["All", "SESSIONS", "ESCROW", "CHAT", "SYSTEM", "PAYMENT"];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, flex: 1, marginLeft: 10 }]}>
            Notifications
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, flex: 1, marginLeft: 10 }]}>
            Notifications
          </Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: colors.text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<Notification[]>(paths.notifications)
                .then((d) => setItems(Array.isArray(d) ? d : []))
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, flex: 1, marginLeft: 10 }]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabs, { borderBottomColor: colors.border }]}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      >
        {tabs.map((t) => {
          const active = tab === t;
          const count = t === "All" ? items.filter((n) => !n.read).length : items.filter((n) => n.type === t && !n.read).length;
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
                opacity: item.read ? 0.85 : 1,
              },
            ]}
            onPress={() => !item.read && markRead(item.id)}
          >
            <View style={[styles.iconBox, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}>
              <Text style={{ fontSize: 18 }}>{catIcon(item.type)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13 }}>
                  {item.title}
                </Text>
                <Text style={{ color: colors.sub, fontSize: 10 }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={{ color: colors.sub, fontSize: 11, marginTop: 3, lineHeight: 16 }}>
                {item.body}
              </Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
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
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
