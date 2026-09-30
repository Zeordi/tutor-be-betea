import { useEffect, useState, useMemo } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";
import FiltersBottomSheet, { FiltersValue } from "@/components/FiltersBottomSheet";

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

const DEFAULT_FILTERS: FiltersValue = {
  subjects: [],
  grade: null,
  maxRate: 1000,
  distance: "Any",
  gender: "Any",
  sessionStyle: "Any",
  verifiedOnly: false,
};

export default function FindTutorsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [q, setQ] = useState("");
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersValue>(DEFAULT_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);

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

  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => t.teacherProfile?.subjects?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [teachers]);

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const tp = t.teacherProfile;
      const sub = tp?.subjects?.join(" ") || "";

      if (q) {
        const qLower = q.toLowerCase();
        const nameMatch = t.fullName.toLowerCase().includes(qLower);
        const subMatch = sub.toLowerCase().includes(qLower);
        if (!nameMatch && !subMatch) return false;
      }

      if (activeSubject && !tp?.subjects?.some((s) => s.toLowerCase() === activeSubject.toLowerCase())) {
        return false;
      }

      if (filters.subjects.length > 0) {
        const hasSubject = filters.subjects.some((s) => tp?.subjects?.some((ts) => ts.toLowerCase() === s.toLowerCase()));
        if (!hasSubject) return false;
      }

      if (t.hourlyRate > filters.maxRate) return false;

      if (filters.verifiedOnly && (!tp?.isVerified || !tp?.degreeVerified)) return false;

      return true;
    });
  }, [teachers, q, activeSubject, filters]);

  const retry = () => {
    setError("");
    setLoading(true);
    apiRequest<Teacher[]>(paths.teachers)
      .then((data) => setTeachers(data || []))
      .catch((err) => setError(err.message || "Failed to load tutors"))
      .finally(() => setLoading(false));
  };

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
          <Pressable onPress={retry} style={[styles.retry, { backgroundColor: colors.primary }]}>
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
        <View style={[styles.search, { backgroundColor: isDark ? colors.surface2 : colors.muted }]}>
          <Text>🔍</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search subjects, names..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          <Pressable onPress={() => setFilterVisible(true)} style={styles.filterBtn}>
            <Text style={{ fontSize: 18 }}>🎛️</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          <Pressable
            onPress={() => setActiveSubject(null)}
            style={[
              styles.chip,
              {
                backgroundColor: activeSubject === null ? colors.primary : isDark ? colors.surface2 : colors.muted,
              },
            ]}
          >
            <Text style={{ color: activeSubject === null ? "#fff" : colors.mutedForeground, fontSize: 12, fontWeight: "700" }}>
              All
            </Text>
          </Pressable>
          {allSubjects.map((s) => (
            <Pressable
              key={s}
              onPress={() => setActiveSubject(s)}
              style={[
                styles.chip,
                {
                  backgroundColor: activeSubject === s ? colors.primary : isDark ? colors.surface2 : colors.muted,
                },
              ]}
            >
              <Text style={{ color: activeSubject === s ? "#fff" : colors.mutedForeground, fontSize: 12, fontWeight: "700" }}>
                {s}
              </Text>
            </Pressable>
          ))}
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
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>
                    {t.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.name, { color: colors.foreground }]}>{t.fullName}</Text>
                    <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>{t.hourlyRate} ETB/hr</Text>
                  </View>
                  <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{sub}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                    ⭐ {tp?.rating?.toFixed(1) || "—"} · 📍 {dist || "—"}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {tp?.isVerified && <MiniBadge text="🛡️ ID" colors={colors} isDark={isDark} />}
                    {tp?.degreeVerified && <MiniBadge text="🎓 Degree" colors={colors} isDark={isDark} />}
                    {tp?.badgeLevel === "GOLD" && <MiniBadge text="🥇 Gold" gold colors={colors} isDark={isDark} />}
                    {tp?.badgeLevel === "ELITE" && <MiniBadge text="⭐ Elite" elite colors={colors} isDark={isDark} />}
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

      <FiltersBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        resultCount={filtered.length}
      />
    </View>
  );
}

function MiniBadge({ text, gold, elite, colors, isDark }: { text: string; gold?: boolean; elite?: boolean; colors: any; isDark: boolean }) {
  let bg = "#E0F2FE";
  let color = "#0369A1";
  if (gold) { bg = "#FEF3C7"; color = "#92400E"; }
  else if (elite) { bg = "#7C3AED"; color = "#fff"; }
  else if (isDark) { bg = "rgba(13,148,136,0.2)"; color = colors.primary; }
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
      <Text style={{ fontSize: 10, fontWeight: "700", color }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
  search: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  filterBtn: { padding: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, marginRight: 8 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "700" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  btn: { paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  btnOutline: { paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, alignItems: "center" },
  btnOutlineText: { fontWeight: "700", fontSize: 13 },
  retry: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
