import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function JobDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Job Details</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Job ID: {id}
        </Text>

        {/* TODO: Job info + list of applications from teachers */}
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
