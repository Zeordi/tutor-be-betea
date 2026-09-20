import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Badge = {
  id: string;
  badgeType: string;
  issuedAt: string;
};

const BADGE_META: Record<string, { title: string; description: string; color: string; icon: string }> = {
  NATIONAL_ID: { title: "National ID Verified", description: "Fayda ID checked by TBB board", color: "#0D9488", icon: "🛡️" },
  DEGREE: { title: "Degree Verified by Board", description: "University certificate approved", color: "#0284C7", icon: "🎓" },
  GOLD: { title: "Gold Top 1%", description: "Top rated in your subject this quarter", color: "#D97706", icon: "🥇" },
  ELITE: { title: "Elite Tutor", description: "50+ completed sessions with 4.8+", color: "#7C3AED", icon: "⭐" },
};

export default function BadgesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [badges, setBadges] = useState<Badge[]>([]);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    apiRequest<Badge[]>(paths.badgesTeacher("me"))
      .then((data) => {
        if (!cancelled) setBadges(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load badges");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const earned = badges.length;
  const total = Object.keys(BADGE_META).length;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>My Trust Badges</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>My Trust Badges</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity onPress={() => { setError(""); setLoading(true); apiRequest<Badge[]>(paths.badgesTeacher("me")).then((data) => setBadges(Array.isArray(data) ? data : [])).catch((e) => setError(e.message)).finally(() => setLoading(false)); }} style={{ backgroundColor: primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const allBadges = Object.entries(BADGE_META).map(([type, meta]) => ({
    id: type,
    ...meta,
    earned: badges.some((b) => b.badgeType === type),
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>My Trust Badges</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={[styles.summary, { backgroundColor: primary }]}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
            Public profile shows
          </Text>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 4 }}>
            {earned} / {total}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 }}>
            Badges only — never raw ID or degree documents
          </Text>
        </View>

        {allBadges.map((b) => (
          <View
            key={b.id}
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
              <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>{b.description}</Text>
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