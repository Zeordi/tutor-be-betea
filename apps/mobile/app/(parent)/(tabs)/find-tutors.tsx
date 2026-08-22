// apps/mobile/app/(parent)/(tabs)/find-tutors.tsx
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput, Switch } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

type Tutor = {
  id: string;
  fullName: string;
  subjects: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  distanceText: string;
  badgeTier: string;
  isIdVerified: boolean;
  isEduVerified: boolean;
};

export default function FindTutorsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [subject, setSubject] = useState("");
  const [maxDistance, setMaxDistance] = useState("15");
  const [onlyVerified, setOnlyVerified] = useState(true);

  const loadTutors = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        lat: "9.03",
        lng: "38.74",
        maxDistanceKm: maxDistance || "15",
      });

      if (subject.trim()) {
        params.append("subjects", subject.trim());
      }

      const res = await fetch(
        `\( {process.env.EXPO_PUBLIC_API_URL}/matching/tutors? \){params.toString()}`
      );

      let data = await res.json();

      if (!Array.isArray(data)) data = [];

      // Client-side verified filter (backend can also support this later)
      if (onlyVerified) {
        data = data.filter((t: Tutor) => t.isIdVerified);
      }

      setTutors(data);
    } catch (error) {
      console.error(error);
      setTutors([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [subject, maxDistance, onlyVerified]);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Find Tutors</Text>
        <Text style={{ color: colors.textSecondary }}>Verified teachers near you</Text>
      </View>

      {/* Filters */}
      <View style={[styles.filters, { backgroundColor: colors.surface }]}>
        <View style={styles.filterRow}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.filterInput, { color: colors.text }]}
            placeholder="Subject (e.g. Mathematics)"
            placeholderTextColor={colors.textSecondary}
            value={subject}
            onChangeText={setSubject}
            onSubmitEditing={loadTutors}
          />
        </View>

        <View style={styles.filterRow}>
          <Ionicons name="locate" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.filterInput, { color: colors.text }]}
            placeholder="Max distance (km)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={maxDistance}
            onChangeText={setMaxDistance}
            onSubmitEditing={loadTutors}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={{ color: colors.text, fontSize: 14 }}>Only Verified Tutors</Text>
          <Switch
            value={onlyVerified}
            onValueChange={setOnlyVerified}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <Pressable
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
          onPress={loadTutors}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </Pressable>
      </View>

      {/* List */}
      {loading ? (
        <View style={{ padding: 16 }}>
          <LoadingSkeleton height={110} />
          <LoadingSkeleton height={110} />
          <LoadingSkeleton height={110} />
        </View>
      ) : (
        <FlatList
          data={tutors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadTutors();
          }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.card, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/(parent)/tutor/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: colors.text }]}>{item.fullName}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                    {item.subjects?.slice(0, 3).join(" • ")}
                  </Text>
                </View>
                <Text style={[styles.price, { color: colors.primary }]}>
                  ETB {item.hourlyRate}/hr
                </Text>
              </View>

              <View style={styles.badges}>
                {item.isIdVerified && (
                  <Text style={styles.badge}>🛡️ ID Verified</Text>
                )}
                {item.isEduVerified && (
                  <Text style={styles.badge}>🎓 Degree</Text>
                )}
                {item.badgeTier === "GOLD_ELITE" && (
                  <Text style={styles.badge}>🥇 Gold</Text>
                )}
              </View>

              <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8 }}>
                ★ {Number(item.rating).toFixed(1)} ({item.totalReviews}) • {item.distanceText}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No tutors found"
              description="Try increasing the distance or removing some filters."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  filters: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  applyButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: { color: "#fff", fontWeight: "700" },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: { fontSize: 16, fontWeight: "700" },
  price: { fontWeight: "700", fontSize: 15 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  badge: {
    fontSize: 12,
    backgroundColor: "rgba(15, 118, 110, 0.12)",
    color: "#0F766E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
  },
});
