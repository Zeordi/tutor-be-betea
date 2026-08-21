import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function ProgressReportScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Weekly Mastery Report</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Report ID: {id}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text, fontWeight: "600" }}>AI Summary</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
            Student showed strong improvement in Algebra this week...
          </Text>
        </View>

        {/* TODO: Topics covered, Quiz score, Strengths, Areas to improve */}
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
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
  },
});
