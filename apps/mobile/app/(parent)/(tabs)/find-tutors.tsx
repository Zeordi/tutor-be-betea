import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Switch,
  Dimensions,
  Animated,
} from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Circle } from "react-native-maps";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

const { width } = Dimensions.get("window");

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
  latitude: number;
  longitude: number;
};

export default function FindTutorsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  // Filters & Search
  const [subject, setSubject] = useState("");
  const [maxDistance, setMaxDistance] = useState("10");
  const [onlyVerified, setOnlyVerified] = useState(true);

  // Addis Ababa Center (Meskel Square default)
  const userCoordinates = { latitude: 9.0108, longitude: 38.7615 };
  const mapRef = useRef<MapView>(null);

  const loadTutors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: String(userCoordinates.latitude),
        lng: String(userCoordinates.longitude),
        maxDistanceKm: maxDistance || "10",
      });

      if (subject.trim()) {
        params.append("subjects", subject.trim());
      }

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000"}/matching/tutors?${params.toString()}`
      );

      let data = await res.json();
      if (!Array.isArray(data)) data = [];

      if (onlyVerified) {
        data = data.filter((t: Tutor) => t.isIdVerified);
      }

      setTutors(data);
      if (data.length > 0) {
        setSelectedTutor(data[0]);
      }
    } catch (error) {
      console.error(error);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, [subject, maxDistance, onlyVerified]);

  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header & View Switcher */}
      <View style={styles.header}>
        <div>
          <Text style={[styles.title, { color: colors.text }]}>Find Tutors</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>PostGIS Geofence Matching</Text>
        </div>

        <View style={[styles.toggleContainer, { backgroundColor: colors.surface }]}>
          <Pressable
            style={[styles.toggleBtn, viewMode === "map" && { backgroundColor: colors.primary }]}
            onPress={() => setViewMode("map")}
          >
            <Ionicons name="map" size={16} color={viewMode === "map" ? "#fff" : colors.textSecondary} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: viewMode === "map" ? "#fff" : colors.textSecondary }}>
              Map
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, viewMode === "list" && { backgroundColor: colors.primary }]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons name="list" size={16} color={viewMode === "list" ? "#fff" : colors.textSecondary} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: viewMode === "list" ? "#fff" : colors.textSecondary }}>
              List
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Floating Filter Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Filter subject (e.g. Math, Physics)..."
          placeholderTextColor={colors.textSecondary}
          value={subject}
          onChangeText={setSubject}
          onSubmitEditing={loadTutors}
        />
        <Pressable onPress={loadTutors} style={[styles.searchBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>Search</Text>
        </Pressable>
      </View>

      {/* Main View: Map or List */}
      {viewMode === "map" ? (
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: userCoordinates.latitude,
              longitude: userCoordinates.longitude,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15,
            }}
          >
            {/* User Search Radius Circle */}
            <Circle
              center={userCoordinates}
              radius={Number(maxDistance || 10) * 1000}
              fillColor="rgba(15, 118, 110, 0.12)"
              strokeColor="#0F766E"
              strokeWidth={2}
            />

            {/* User Location Marker */}
            <Marker coordinate={userCoordinates} title="Your Home Location">
              <View style={styles.homePin}>
                <Ionicons name="home" size={16} color="#fff" />
              </View>
            </Marker>

            {/* Verified Tutor Markers */}
            {tutors.map((tutor) => {
              const isSelected = selectedTutor?.id === tutor.id;
              return (
                <Marker
                  key={tutor.id}
                  coordinate={{ latitude: tutor.latitude, longitude: tutor.longitude }}
                  onPress={() => setSelectedTutor(tutor)}
                >
                  <View
                    style={[
                      styles.tutorPin,
                      { backgroundColor: isSelected ? "#D97706" : colors.primary },
                    ]}
                  >
                    <Text style={styles.tutorPinText}>ETB {tutor.hourlyRate}</Text>
                  </View>
                </Marker>
              );
            })}
          </MapView>

          {/* Selected Tutor Bottom Overlay Card */}
          {selectedTutor && (
            <View style={[styles.bottomCardWrapper]}>
              <Pressable
                style={[styles.bottomCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/(parent)/tutor/${selectedTutor.id}`)}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={[styles.name, { color: colors.text }]}>{selectedTutor.fullName}</Text>
                    {selectedTutor.isIdVerified && <Text style={{ fontSize: 12 }}>🛡️</Text>}
                    {selectedTutor.badgeTier === "GOLD_ELITE" && <Text style={{ fontSize: 12 }}>🥇</Text>}
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                    {selectedTutor.subjects.slice(0, 3).join(" • ")}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                    ★ {selectedTutor.rating.toFixed(1)} ({selectedTutor.totalReviews} reviews) • {selectedTutor.distanceText}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.price, { color: colors.primary }]}>ETB {selectedTutor.hourlyRate}/hr</Text>
                  <Pressable
                    style={[styles.viewProfileBtn, { backgroundColor: colors.primary }]}
                    onPress={() => router.push(`/(parent)/tutor/${selectedTutor.id}`)}
                  >
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Hire</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={tutors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.listCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/(parent)/tutor/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.name, { color: colors.text }]}>{item.fullName}</Text>
                <Text style={[styles.price, { color: colors.primary }]}>ETB {item.hourlyRate}/hr</Text>
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                {item.subjects.join(" • ")}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 6 }}>
                ★ {item.rating.toFixed(1)} ({item.totalReviews}) • {item.distanceText} away
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No tutors found nearby"
              description="Try expanding your distance slider or changing the subject filter."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "800" },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  searchBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  mapWrapper: { flex: 1, position: "relative" },
  map: { width: "100%", height: "100%" },
  homePin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  tutorPin: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  tutorPinText: { color: "#fff", fontWeight: "800", fontSize: 11 },
  bottomCardWrapper: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  bottomCard: {
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  name: { fontSize: 16, fontWeight: "700" },
  price: { fontSize: 15, fontWeight: "800" },
  viewProfileBtn: { marginTop: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  listCard: { padding: 16, borderRadius: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
});