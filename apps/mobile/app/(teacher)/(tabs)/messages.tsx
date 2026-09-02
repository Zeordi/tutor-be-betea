import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const CHATS = [
  {
    id: "room-1",
    name: "Yeshi Haile",
    last: "Can we move tomorrow's session to 5pm?",
    time: "5m",
    unread: 1,
  },
  {
    id: "room-2",
    name: "Abebe Girma",
    last: "Progress report received, thank you!",
    time: "2h",
    unread: 0,
  },
];

export default function TeacherMessagesScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Text style={[styles.title, { color: text }]}>Messages</Text>
        <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>
          Protected by Anti-Poaching Shield
        </Text>
      </View>
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: card }]}
            onPress={() => router.push(`/(shared)/chat/${item.id}`)}
          >
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={styles.avatarText}>
                {item.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.name, { color: text }]}>{item.name}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{item.time}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={{ color: sub, fontSize: 12, flex: 1 }} numberOfLines={1}>
                  {item.last}
                </Text>
                {item.unread > 0 && (
                  <View style={[styles.badge, { backgroundColor: primary }]}>
                    <Text style={styles.badgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: "800" },
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  name: { fontSize: 14, fontWeight: "800", flex: 1 },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
});