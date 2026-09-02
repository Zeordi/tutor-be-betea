import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

type TutorProfile = {
  id: string;
  fullName: string;
  subjects: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  bio?: string;
  isIdVerified?: boolean;
  isEduVerified?: boolean;
  badgeTier?: string;
  sessionsCompleted?: number;
  punctuality?: number;
};

export default function TutorProfileScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `\( {process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000"}/teachers/ \){id}/public`
        );
        if (res.ok) {
          const data = await res.json();
          setTutor(data);
        } else {
          throw new Error("fallback");
        }
      } catch {
        setTutor({
          id: String(id),
          fullName: "Selamawit Tadesse",
          subjects: ["Mathematics", "Physics"],
          rating: 4.9,
          totalReviews: 128,
          hourlyRate: 450,
          bio: "MSc Mathematics from AAU. 7 years teaching experience. Specializes in Grade 9–12 Ethiopian National Exam prep.",
          isIdVerified: true,
          isEduVerified: true,
          badgeTier: "GOLD",
          sessionsCompleted: 128,
          punctuality: 98,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator color={primary} />
      </View>
    );
  }

  if (!tutor) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <Text style={{ color: sub }}>Tutor not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ color: "#fff", fontSize: 16 }}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
                {tutor.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </Text>
            </View>
            <View style={styles.iconActions}>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: card }]}>
                <Text>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: card }]}>
                <Text>❤️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.name, { color: text }]}>{tutor.fullName}</Text>
          <Text style={{ color: sub, fontSize: 13, marginBottom: 8 }}>
            {tutor.subjects?.join(" · ")} · Grade 9–12
          </Text>

          <View style={styles.badgeRow}>
            {tutor.isIdVerified && <Text style={styles.badge}>🛡️ National ID Verified</Text>}
            {tutor.isEduVerified && <Text style={styles.badge}>🎓 Degree Verified</Text>}
            {tutor.badgeTier?.includes("GOLD") && <Text style={styles.badge}>🥇 Gold Top 1%</Text>}
          </View>

          <View style={[styles.stats, { backgroundColor: card }]}>
            {[
              ["⭐", tutor.rating?.toFixed?.(1) ?? "4.9", "Rating"],
              ["📚", String(tutor.sessionsCompleted ?? 128), "Sessions"],
              ["⏰", `${tutor.punctuality ?? 98}%`, "Punctual"],
              ["🔁", "94%", "Rehire"],
            ].map(([icon, val, label]) => (
              <View key={label as string} style={styles.statItem}>
                <Text>{icon}</Text>
                <Text style={{ color: primary, fontWeight: "800", fontSize: 13 }}>{val}</Text>
                <Text style={{ color: sub, fontSize: 9 }}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={{ color: text, fontSize: 13, lineHeight: 20 }}>
              {tutor.bio || "Verified tutor on Tutor Be Betea."}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={[styles.sectionLabel, { color: sub }]}>RATES</Text>
            {[
              ["Single Session", `${tutor.hourlyRate} ETB/hr`],
              ["5-Session Pack", "2,000 ETB"],
              ["Monthly (20hrs)", "7,500 ETB"],
            ].map(([n, p]) => (
              <View key={n} style={styles.rateRow}>
                <Text style={{ color: sub, fontSize: 12 }}>{n}</Text>
                <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>{p}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: isDark ? "#0F1B2D" : "#FFFFFF", borderTopColor: isDark ? "#1E3A5F" : "#E2E8F0" }]}>
        <TouchableOpacity style={[styles.footerPrimary, { backgroundColor: primary }]}>
          <Text style={styles.footerPrimaryText}>📅 Book Session</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerSecondary, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : "#F0FDFA" }]}>
          <Text style={[styles.footerSecondaryText, { color: primary }]}>💬 Message</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: {
    height: 96,
    backgroundColor: "#0F766E",
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingHorizontal: 14,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 16, marginTop: -32 },
  avatarWrap: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  iconActions: { flexDirection: "row", gap: 8, marginBottom: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 20, fontWeight: "900" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  badge: {
    fontSize: 10,
    backgroundColor: "#F0FDFA",
    color: "#0F766E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    overflow: "hidden",
    fontWeight: "700",
  },
  stats: {
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    marginBottom: 12,
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  card: { borderRadius: 18, padding: 14, marginBottom: 12 },
  sectionLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 8 },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
  },
  footerPrimary: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  footerPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  footerSecondary: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  footerSecondaryText: { fontWeight: "800", fontSize: 13 },
});