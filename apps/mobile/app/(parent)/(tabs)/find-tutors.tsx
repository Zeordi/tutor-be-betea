import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type Teacher = {
  id: string;
  fullName: string;
  hourlyRate: number;
  teacherProfile: {
    rating: number;
    subCity: string | null;
    isVerified: boolean;
    degreeVerified: boolean;
    badgeLevel: string;
    subjects: string[];
  } | null;
};

const FILTERS = ["All", "Math", "Physics", "Chemistry", "English"];

export default function FindTutorsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [active, setActive] = useState(0);
  const [q, setQ] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Teacher[]>(paths.teachers)
      .then((data) => {
        if (!cancelled) setTeachers(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load tutors");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filtered = teachers.filter((t) => {
    const tp = t.teacherProfile;
    const sub = tp?.subjects?.join(" ") || "";
    const mustVerified = verifiedOnly && (!tp?.isVerified || !tp?.degreeVerified);
    if (mustVerified) return false;
    if (active > 0 && !sub.toLowerCase().includes(FILTERS[active].toLowerCase())) return false;
    if (q && !t.fullName.toLowerCase().includes(q.toLowerCase()) && !sub.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Find Tutors</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Loading tutors…</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Find Tutors</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Text style={{ fontSize: 32 }}>⚠️</Text>
          <Text style={{ color: colors.foreground, fontWeight: "700", textAlign: "center" }}>{error}</Text>
          <Pressable onPress={() => window.location.reload()} style={[styles.retry, { backgroundColor: colors.primary }]}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Find Tutors</Text>
        <View style={[styles.search, { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9" }]}>
          <Text>🔍</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search subjects, names..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {FILTERS.map((f, i) => (
            <Pressable
              key={f}
              onPress={() => setActive(i)}
              style={[
                styles.chip,
                {
                  backgroundColor: active === i ? colors.primary : isDark ? "#1E3A5F" : "#F1F5F9",
                },
              ]}
            >
              <Text style={{ color: active === i ? "#fff" : colors.mutedForeground, fontSize: 12, fontWeight: "700" }}>
                {f}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => setVerifiedOnly((v) => !v)}
            style={[
              styles.chip,
              {
                backgroundColor: verifiedOnly ? colors.primary : isDark ? "#1E3A5F" : "#F1F5F9",
              },
            ]}
          >
            <Text style={{ color: verifiedOnly ? "#fff" : colors.mutedForeground, fontSize: 12, fontWeight: "700" }}>
              🛡️ Verified only
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
          {filtered.length} tutors nearby
        </Text>

        {filtered.map((t) => {
          const tp = t.teacherProfile;
          const sub = tp?.subjects?.slice(0, 2).join(" · ") || "Tutor";
          const dist = tp?.subCity || "";
          return (
            <Pressable
              key={t.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
            >
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: "#fff", fontWeight: "800" }}>
                    {t.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.name, { color: colors.foreground }]}>{t.fullName}</Text>
                    <Text style={{ color: colors.primary, fontWeight: "800" }}>{t.hourlyRate} ETB/hr</Text>
                  </View>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{sub}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                    ⭐ {tp?.rating?.toFixed(1) || "—"} · 📍 {dist || "—"}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {tp?.isVerified && <MiniBadge text="🛡️ ID" />}
                    {tp?.degreeVerified && <MiniBadge text="🎓 Degree" />}
                    {tp?.badgeLevel === "GOLD" && <MiniBadge text="🥇 Gold" gold />}
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <Pressable
                  style={[styles.btn, { backgroundColor: colors.primary, flex: 1 }]}
                  onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
                >
                  <Text style={styles.btnText}>Book</Text>
                </Pressable>
                <Pressable
                  style={[styles.btnOutline, { borderColor: colors.primary, flex: 1 }]}
                  onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
                >
                  <Text style={[styles.btnOutlineText, { color: colors.primary }]}>Profile</Text>
                </Pressable>
              </View>
            </Pressable>
          );
        })}

        {filtered.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ fontSize: 32 }}>🔍</Text>
            <Text style={[styles.name, { color: colors.foreground, marginTop: 8 }]}>No tutors found</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 13, textAlign: "center", marginTop: 4 }}>
              Try adjusting filters or search nearby areas.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function MiniBadge({ text, gold }: { text: string; gold?: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: gold ? "#FEF3C7" : "#CCFBF1",
      }}
    >
      <Text style={{ fontSize: 10, fontWeight: "700", color: gold ? "#92400E" : "#0F766E" }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
  search: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, marginRight: 8 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "700" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  btn: { paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  btnOutline: { paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, alignItems: "center" },
  btnOutlineText: { fontWeight: "700", fontSize: 13 },
  retry: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
