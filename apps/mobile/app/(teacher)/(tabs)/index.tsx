// apps/mobile/app/(teacher)/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TeacherHomeScreen() {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
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

        {/* Earnings Summary */}
        <Pressable
          style={[styles.earningsCard, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(teacher)/earnings")}
        >
          <Text style={styles.earningsLabel}>Available Balance</Text>
          <Text style={styles.earningsAmount}>ETB 0.00</Text>
          <Text style={styles.earningsSub}>Tap to view full earnings →</Text>
        </Pressable>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
            <Text style={styles.statLabel}>Active Contracts</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
            <Text style={styles.statLabel}>Open Jobs</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

        <ActionButton
          title="Browse Available Jobs"
          icon="briefcase"
          colors={colors}
          onPress={() => router.push("/(teacher)/(tabs)/jobs")}
        />
        <ActionButton
          title="Update My Location"
          icon="location"
          colors={colors}
          onPress={() => router.push("/(teacher)/location")}
        />
        <ActionButton
          title="Document Verification"
          icon="shield-checkmark"
          colors={colors}
          onPress={() => router.push("/(teacher)/verification")}
        />
        <ActionButton
          title="Submit Progress Report"
          icon="create"
          colors={colors}
          onPress={() => router.push("/(teacher)/progress/submit")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({ title, icon, colors, onPress }: any) {
  return (
    <Pressable
      style={[styles.actionBtn, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={[styles.actionBtnText, { color: colors.text }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  greeting: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  earningsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  earningsLabel: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  earningsAmount: { color: "#fff", fontSize: 28, fontWeight: "700", marginTop: 6 },
  earningsSub: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 8 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 13, color: "#64748B", marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
  },
  actionBtnText: { flex: 1, fontSize: 16, fontWeight: "600" },
});
