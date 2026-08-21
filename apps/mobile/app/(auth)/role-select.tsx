import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoleSelectScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Who are you?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose how you want to use Tutor Be Betea
        </Text>

        <Pressable style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Parent</Text>
          <Text style={{ color: colors.textSecondary }}>
            Find verified tutors for your children
          </Text>
        </Pressable>

        <Pressable style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Teacher</Text>
          <Text style={{ color: colors.textSecondary }}>
            Offer home & online tutoring services
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
});
