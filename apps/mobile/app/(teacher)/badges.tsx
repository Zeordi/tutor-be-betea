import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const BADGES = [
  {
    icon: "🛡️",
    title: "National ID Verified",
    sub: "Fayda ID checked by TBB board",
    earned: true,
    color: "#0D9488",
  },
  {
    icon: "🎓",
    title: "Degree Verified by Board",
    sub: "University certificate approved",
    earned: true,
    color: "#0284C7",
  },
  {
    icon: "🥇",
    title: "Gold Top 1%",
    sub: "Top rated in your subject this quarter",
    earned: true,
    color: "#D97706",
  },
  {
    icon: "⭐",
    title: "Elite Tutor",
    sub: "50+ completed sessions with 4.8+",
    earned: false,
    color: "#7C3AED",
  },
  {
    icon: "📍",
    title: "Local Hero",
    sub: "Most sessions in your sub-city",
    earned: false,
    color: "#059669",
  },
];

export default function BadgesScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  const earned = BADGES.filter((b) => b.earned).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>
          My Trust Badges
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.summary, { backgroundColor: primary }]}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
            Public profile shows
          </Text>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 4 }}>
            {earned} / {BADGES.length}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 }}>
            Badges only — never raw ID or degree documents
          </Text>
        </View>

        {BADGES.map((b) => (
          <View
            key={b.title}
            style={[
              styles.card,
              {
                backgroundColor: card,
                borderColor: b.earned ? b.color + "55" : border,
                opacity: b.earned ? 1 : 0.75,
              },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" },
              ]}
            >
              <Text style={{ fontSize: 22 }}>{b.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>
                {b.title}
              </Text>
              <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>{b.sub}</Text>
              <Text
                style={{
                  color: b.earned ? "#059669" : "#D97706",
                  fontSize: 11,
                  fontWeight: "700",
                  marginTop: 6,
                }}
              >
                {b.earned ? "✓ Earned" : "Locked — keep tutoring"}
              </Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.cta, { borderColor: primary }]}
          onPress={() => router.push("/(teacher)/verification")}
        >
          <Text style={{ color: primary, fontWeight: "800", fontSize: 13 }}>
            Manage verification documents →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  summary: { borderRadius: 18, padding: 18 },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cta: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
});