// apps/mobile/app/(parent)/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ParentHomeScreen() {
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

  const quickActions = [
    {
      title: "Find Tutors",
      subtitle: "Browse verified teachers",
      icon: "search",
      onPress: () => router.push("/(parent)/(tabs)/find-tutors"),
    },
    {
      title: "Post a Job",
      subtitle: "Tell us what you need",
      icon: "add-circle",
      onPress: () => router.push("/(parent)/job/create"),
    },
    {
      title: "My Children",
      subtitle: "Manage profiles",
      icon: "people",
      onPress: () => router.push("/(parent)/children"),
    },
    {
      title: "My Contracts",
      subtitle: "Track ongoing sessions",
      icon: "document-text",
      onPress: () => router.push("/(parent)/contracts"),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Good day, {user?.fullName?.split(" ")[0] || "Parent"} 👋
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 28 }}>
          What would you like to do today?
        </Text>

        <View style={styles.grid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.title}
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={action.onPress}
            >
              <View style={[styles.iconWrapper, { backgroundColor: colors.primary + "18" }]}>
                <Ionicons name={action.icon as any} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>{action.title}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{action.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  greeting: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  actionCard: {
    width: "47%",
    borderRadius: 18,
    padding: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
});
