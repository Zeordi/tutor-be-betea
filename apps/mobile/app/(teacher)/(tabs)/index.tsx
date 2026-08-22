import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getToken } from "@/lib/api";

export default function TeacherHomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    activeContracts: 0,
    availableJobs: 0,
    connects: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        // In production we will have a dedicated /teachers/me/dashboard endpoint
        const profileRes = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/teachers/me/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const profile = await profileRes.json();

        setStats({
          activeContracts: 0, // will come from contracts endpoint
          availableJobs: 0,
          connects: profile.connectsBalance || 0,
          rating: profile.rating || 0,
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Hello, {user?.fullName?.split(" ")[0] || "Teacher"} 👋
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 24 }}>
          Here’s your teaching overview
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.activeContracts}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Active Contracts</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.connects}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Connects</Text>
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.surface, marginTop: 12 }]}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            ★ {Number(stats.rating).toFixed(1)}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Your Rating</Text>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(teacher)/(tabs)/jobs")}
        >
          <Text style={styles.actionButtonText}>View Available Jobs</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.surface, marginTop: 12 }]}
          onPress={() => router.push("/(teacher)/verification")}
        >
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            Document Verification
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.surface, marginTop: 12 }]}
          onPress={() => router.push("/(teacher)/earnings")}
        >
          <Text style={[styles.actionButtonText, { color: colors.text }]}>
            View Earnings
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  greeting: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 32, marginBottom: 12 },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  actionButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
