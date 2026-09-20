import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type Teacher = {
  id: string;
  fullName: string;
  email: string;
  teacherProfile: {
    hourlyRate: number;
    hourlyRateOnline?: number;
    hourlyRateGroup?: number;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    idVerified: boolean;
    degreeVerified: boolean;
    badgeLevel: string;
    subCity: string | null;
    subjects: string[];
    gradeLevels: string[];
    bioEn: string | null;
    tagline: string | null;
  } | null;
};

export default function TutorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Teacher>(paths.teacher(id))
      .then((data) => {
        if (!cancelled) setTeacher(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load tutor");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const toggleFavorite = async () => {
    if (!id || !teacher) return;
    try {
      if (favorited) {
        await apiRequest(paths.favorite(teacher.id), { method: "DELETE" });
        setFavorited(false);
      } else {
        await apiRequest(paths.favorite(teacher.id), { method: "POST", body: JSON.stringify({ teacherId: teacher.id }) });
        setFavorited(true);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Favorite action failed");
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.cover, { backgroundColor: colors.primaryDark }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ color: "#fff", fontSize: 16 }}>←</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Loading profile…</Text>
        </View>
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.cover, { backgroundColor: colors.primaryDark }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ color: "#fff", fontSize: 16 }}>←</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Text style={{ fontSize: 32 }}>⚠️</Text>
          <Text style={{ color: colors.foreground, fontWeight: "700", textAlign: "center" }}>{error || "Tutor not found"}</Text>
          <Pressable onPress={() => router.back()} style={[styles.retry, { backgroundColor: colors.primary }]}>
            <Text style={styles.retryText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const tp = teacher.teacherProfile;
  const initials = teacher.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const subjects = tp?.subjects?.join(", ") || "General";
  const grades = tp?.gradeLevels?.join(", ") || "";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.cover, { backgroundColor: colors.primaryDark }]}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ color: "#fff", fontSize: 16 }}>←</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: -36 }}>
          <View style={styles.headerRow}>
            <View style={[styles.avatarLg, { backgroundColor: colors.primary, borderColor: colors.background }]}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{initials}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              <Pressable
                style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/(shared)/chat/${teacher.id}`)}
              >
                <Text>💬</Text>
              </Pressable>
              <Pressable
                style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={toggleFavorite}
              >
                <Text>{favorited ? "❤️" : "🤍"}</Text>
              </Pressable>
            </View>
          </View>

          <Text style={[styles.name, { color: colors.foreground }]}>{teacher.fullName}</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, marginBottom: 8 }}>
            {subjects} {grades && `· Grade ${grades}`}
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {tp?.idVerified && <Pill text="🛡️ National ID Verified" solid />}
            {tp?.degreeVerified && <Pill text="🎓 Degree Verified" />}
            {tp?.badgeLevel === "GOLD" && <Pill text="🥇 Gold Top 1%" gold />}
            {tp?.badgeLevel === "ELITE" && <Pill text="⭐ Elite" elite />}
          </View>

          <View style={[styles.stats, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              [tp?.rating?.toFixed(1) || "—", "⭐", "Rating"],
              [String(tp?.reviewCount || 0), "📚", "Sessions"],
              [tp?.subCity || "—", "📍", "Area"],
            ].map(([v, icon, label]) => (
              <View key={String(label)} style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ fontSize: 14 }}>{icon}</Text>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 14 }}>{v}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>{label}</Text>
              </View>
            ))}
          </View>

          {tp?.bioEn && (
            <View style={[styles.block, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 20 }}>{tp.bioEn}</Text>
            </View>
          )}

          <View style={[styles.block, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.section, { color: colors.mutedForeground }]}>RATES (ETB/hr)</Text>
            {[
              ["Home Visit", String(tp?.hourlyRate ?? 0)],
              ...(tp?.hourlyRateOnline ? [["Online", String(tp.hourlyRateOnline)]] : []),
              ...(tp?.hourlyRateGroup ? [["Group", String(tp.hourlyRateGroup)]] : []),
            ].map(([n, p]) => (
              <View key={n} style={styles.rateRow}>
                <Text style={{ color: colors.foreground, fontSize: 13 }}>{n}</Text>
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>{p} ETB</Text>
              </View>
            ))}
          </View>

          <View style={[styles.video, { backgroundColor: isDark ? "#1E3A5F" : "#E2E8F0" }]}>
            <Text style={{ fontSize: 28 }}>▶️</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 6 }}>Intro video</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable style={[styles.cta, { backgroundColor: colors.primary, flex: 1 }]}>
          <Text style={styles.ctaText}>📅 Book Session</Text>
        </Pressable>
        <Pressable
          style={[styles.ctaSoft, { backgroundColor: isDark ? "#134E4A" : "#F0FDFA", flex: 1 }]}
          onPress={() => router.push(`/(shared)/chat/${teacher.id}`)}
        >
          <Text style={[styles.ctaSoftText, { color: colors.primary }]}>💬 Message</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Pill({ text, solid, gold, elite }: { text: string; solid?: boolean; gold?: boolean; elite?: boolean }) {
  let bg = "#E0F2FE";
  let color = "#0369A1";
  if (solid) { bg = "#0D9488"; color = "#fff"; }
  else if (gold) { bg = "#FEF3C7"; color = "#92400E"; }
  else if (elite) { bg = "#7C3AED"; color = "#fff"; }
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  cover: { height: 100 },
  backBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  avatarLg: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 22, fontWeight: "800", marginTop: 8 },
  stats: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  block: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 12 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 8 },
  rateRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  video: {
    height: 140,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
  cta: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  ctaSoft: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  ctaSoftText: { fontWeight: "800", fontSize: 14 },
  retry: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
