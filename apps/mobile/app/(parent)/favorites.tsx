import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const SAVED = [
  { id: "1", name: "Selamawit Tadesse", sub: "Math · Physics", rate: 450, rating: 4.9, idOk: true, gold: true },
  { id: "2", name: "Bereket Solomon", sub: "Physics · Chem", rate: 500, rating: 4.8, idOk: true, gold: false },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
          Saved Tutors
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
        {SAVED.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
          >
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>{t.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800" }}>{t.name}</Text>
              <Text style={{ color: sub, fontSize: 12 }}>{t.sub}</Text>
              <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>
                ⭐ {t.rating} · {t.rate} ETB/hr
                {t.idOk ? " · 🛡️" : ""}
                {t.gold ? " · 🥇" : ""}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {SAVED.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
            No saved tutors yet. Heart a profile to pin it here.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});