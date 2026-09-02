import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const SAVED = [
  { id: "1", name: "Selamawit Tadesse", sub: "Math · Physics · Grade 9–12", rate: 450, rating: 4.9 },
  { id: "2", name: "Bereket Solomon", sub: "Physics · Chemistry", rate: 500, rating: 4.8 },
];

export default function FavoritesScreen() {
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Saved Tutors</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {SAVED.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.card, { backgroundColor: card }]}
            onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
          >
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={styles.avatarText}>
                {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: text }]}>{t.name}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>{t.sub}</Text>
              <Text style={{ color: primary, fontWeight: "800", marginTop: 4 }}>
                ⭐ {t.rating} · {t.rate} ETB/hr
              </Text>
            </View>
            <Text style={{ fontSize: 18 }}>❤️</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontWeight: "800" },
  content: { padding: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  name: { fontSize: 14, fontWeight: "800" },
});