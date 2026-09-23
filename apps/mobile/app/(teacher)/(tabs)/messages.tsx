import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { apiRequest, paths } from "@/lib/api";

type Conversation = {
  id: string;
  otherUser: { id: string; fullName: string; avatarUrl: string | null };
  lastMessage: { body: string; createdAt: string } | null;
  unreadCount: number;
};

export default function TeacherMessagesScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiRequest<Conversation[]>(paths.chatConversations)
      .then((data) => {
        if (!cancelled) setConversations(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setConversations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: text }]}>Messages</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Text style={[styles.title, { color: text }]}>Messages</Text>
        <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>
          Protected by Anti-Poaching Shield
        </Text>
      </View>

      {conversations.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: sub, textAlign: "center", lineHeight: 18 }}>
            Your session conversations will appear here.
          </Text>
          <Text style={{ color: sub, fontSize: 10, textAlign: "center", marginTop: 8, opacity: 0.7 }}>
            Start a conversation from a contract or parent profile.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: card, borderColor: border }]}
              onPress={() => router.push(`/(shared)/chat/${item.id}`)}
            >
              <View style={styles.avatar}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>
                  {(item.otherUser.fullName || "T")[0]}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>{item.otherUser.fullName}</Text>
                  {item.lastMessage && (
                    <Text style={{ color: sub, fontSize: 10 }}>
                      {new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  )}
                </View>
                <Text style={{ color: sub, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                  {item.lastMessage?.body || "No messages yet"}
                </Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: primary }]}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>{item.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: "800" },
  card: { borderRadius: 16, padding: 14, borderWidth: 1, flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginLeft: 8 },
});