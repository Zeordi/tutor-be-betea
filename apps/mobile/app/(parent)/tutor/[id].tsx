import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function TutorProfileScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Tutor Profile</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Tutor ID: {id}
        </Text>

        {/* Trust Badges will appear here */}
        <View style={[styles.badgeContainer, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text }}>🛡️ National ID Verified</Text>
          <Text style={{ color: colors.text }}>🎓 Degree Verified</Text>
          <Text style={{ color: colors.text }}>🥇 Gold Elite</Text>
        </View>

        {/* TODO: Bio, subjects, rates, reviews, performance scorecard, Hire button */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  badgeContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
});
