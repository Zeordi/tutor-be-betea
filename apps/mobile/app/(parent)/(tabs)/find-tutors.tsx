import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type Tutor = {
  id: string;
  fullName: string;
  subjects: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  distanceText?: string;
  isIdVerified?: boolean;
  isEduVerified?: boolean;
  badgeTier?: string;
};

const FILTERS = ["All", "Math", "Physics", "Chemistry", "English"];

export default function FindTutorsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [activeFilter, setActiveFilter] = useState(0);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const headerBg = isDark ? "#0F1B2D" : "#FFFFFF";

  const loadTutors = useCallback(async () => {
    try {
      setLoading(true);
      const filter = activeFilter === 0 ? subject : FILTERS[activeFilter];
      const params = new URLSearchParams({
        lat: "9.0108",
        lng: "38.7615",
        maxDistanceKm: "10",
      });
      if (filter && filter !== "All") params.append("subjects", filter);

      const res = await fetch(
        `\( {process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000"}/matching/tutors? \){params}`
      );
      let data = await res.json();
      if (!Array.isArray(data)) data = [];
      setTutors(data);
    } catch {
      // Figma-style fallback for offline / empty API
      setTutors([
        {
          id: "1",
          fullName: "Selamawit Tadesse",
          subjects: ["Mathematics", "Physics"],
          rating: 4.9,
          totalReviews: 128,
          hourlyRate: 450,
          distanceText: "1.2 km",
          isIdVerified: true,
          isEduVerified: true,
          badgeTier: "GOLD",
        },
        {
          id: "2",
          fullName: "Bereket Solomon",
          subjects: ["Physics", "Chemistry"],
          rating: 4.8,
          totalReviews: 86,
          hourlyRate: 500,
          distanceText: "2.1 km",
          isIdVerified: true,
          isEduVerified: true,
        },
        {
          id: "3",
          fullName: "Tigist Haile",
          subjects: ["Mathematics", "Stats"],
          rating: 4.7,
          totalReviews: 54,
          hourlyRate: 380,
          distanceText: "3.4 km",
          isIdVerified: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [subject, activeFilter]);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  const renderTutor = ({ item }: { item: Tutor }) => (
    <View style={[styles.card, { backgroundColor: card }]}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={styles.avatar}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>
            {item.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.rowBetween}>
            <Text style={[styles.name, { color: text }]} numberOfLines={1}>
              {item.fullName}
            </Text>
            <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>
              {item.hourlyRate} ETB/hr
            </Text>
          </View>
          <Text style={{ color: sub, fontSize: 11 }} numberOfLines={1}>
            {item.subjects?.join(" · ")}
          </Text>
          <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>
            ★ {item.rating?.toFixed?.(1) ?? item.rating} · 📍 {item.distanceText || "Nearby"}
          </Text>
          <View style={styles.badgeRow}>
            {item.isIdVerified && <Text style={styles.badge}>🛡️ ID</Text>}
            {item.isEduVerified && <Text style={styles.badge}>🎓 Degree</Text>}
            {item.badgeTier?.includes("GOLD") && <Text style={styles.badge}>🥇 Gold</Text>}
          </View>
        </View>
      </View>
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: primary }]}
          onPress={() => router.push(`/(parent)/tutor/${item.id}`)}
        >
          <Text style={styles.primaryBtnText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.outlineBtn, { borderColor: primary }]}
          onPress={() => router.push(`/(parent)/tutor/${item.id}`)}
        >
          <Text style={[styles.outlineBtnText, { color: primary }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <Text style={[styles.title, { color: text }]}>Find Tutors</Text>
        <View style={[styles.searchRow, { backgroundColor: isDark ? "#112240" : "#F1F5F9" }]}>
          <Text>🔍</Text>
          <TextInput
            placeholder="Search subjects, names..."
            placeholderTextColor={sub}
            value={subject}
            onChangeText={setSubject}
            onSubmitEditing={loadTutors}
            style={[styles.searchInput, { color: text }]}
          />
        </View>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(f) => f}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 10 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(index)}
              style={[
                styles.chip,
                {
                  backgroundColor: activeFilter === index ? primary : isDark ? "#112240" : "#F1F5F9",
                },
              ]}
            >
              <Text
                style={{
                  color: activeFilter === index ? "#fff" : sub,
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={primary} />
        </View>
      ) : (
        <FlatList
          data={tutors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, gap: 10 }}
          renderItem={renderTutor}
          ListEmptyComponent={
            <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
              No tutors found nearby
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 13 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99 },
  card: { borderRadius: 18, padding: 14 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  name: { fontSize: 13, fontWeight: "800", flex: 1 },
  badgeRow: { flexDirection: "row", gap: 4, marginTop: 4, flexWrap: "wrap" },
  badge: {
    fontSize: 9,
    backgroundColor: "#F0FDFA",
    color: "#0F766E",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    overflow: "hidden",
    fontWeight: "700",
  },
  btnRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  primaryBtn: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  outlineBtn: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1 },
  outlineBtnText: { fontWeight: "800", fontSize: 12 },
});