import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateJobScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Post a New Job</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Tell us what kind of tutor you need
        </Text>

        {/* TODO: Subject selection, grade, budget, location, schedule, urgency boost */}
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
});
