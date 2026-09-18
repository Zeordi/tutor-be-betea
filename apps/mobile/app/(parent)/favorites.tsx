import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type SavedTeacher = {
  id: string;
  teacher: {
    id: string;
    fullName: string;
    teacherProfile: {
      hourlyRate: number;
      rating: number;
      subCity: string | null;
    } | null;
  };
};

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedTeacher[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<SavedTeacher[]>(paths.favorites)
      .then((data) => {
        if (!cancelled) setSaved(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load favorites");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Saved Tutors
          </Text>
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
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Saved Tutors
          </Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<SavedTeacher[]>(paths.favorites)
                .then((data) => setSaved(Array.isArray(data) ? data : []))
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            style={[styles.retryBtn, { backgroundColor: primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
          Saved Tutors
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
        {saved.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
            No saved tutors yet. Heart a profile to pin it here.
          </Text>
        )}
        {saved.map((t) => {
          const tp = t.teacher.teacherProfile;
          const rate = tp?.hourlyRate || 0;
          const rating = tp?.rating || 0;
          const city = tp?.subCity || "—";
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.card, { backgroundColor: card, borderColor: border }]}
              onPress={() => router.push(`/(parent)/tutor/${t.teacher.id}`)}
            >
              <View style={[styles.avatar, { backgroundColor: primary }]}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>
                  {t.teacher.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "800" }}>{t.teacher.fullName}</Text>
                <Text style={{ color: sub, fontSize: 12 }}>{city}</Text>
                <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>
                  ⭐ {rating.toFixed(1)} · {rate} ETB/hr
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
