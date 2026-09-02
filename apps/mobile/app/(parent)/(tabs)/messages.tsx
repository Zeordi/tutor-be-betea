import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const MOCK_CHATS = [
  {
    id: "room-1",
    name: "Selamawit Tadesse",
    last: "Yes, I'm available! We can cover algebra.",
    time: "2m",
    online: true,
    unread: 2,
  },
  {
    id: "room-2",
    name: "Bereket Solomon",
    last: "Session confirmed for Thursday.",
    time: "1h",
    online: false,
    unread: 0,
  },
  {
    id: "room-3",
    name: "Tigist Haile",
    last: "Progress report submitted.",
    time: "Yesterday",
    online: true,
    unread: 0,
  },
];

export default function MessagesScreen() {
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
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: card }]}
            onPress={() => router.push(`/(shared)/chat/${item.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </Text>
              {item.online && <View style={styles.onlineDot} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.name, { color: text }]} numberOfLines={1}>
                  {item.name}
                </Text>
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
        ListEmptyComponent={
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
            No conversations yet
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: "800" },
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  onlineDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#fff",
  },
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