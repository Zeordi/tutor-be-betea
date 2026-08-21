import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function SessionScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Live Session</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Session ID: {id}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text, fontWeight: "600" }}>Geofence Status</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            Waiting for teacher check-in • 150m rule active
          </Text>
        </View>

        {/* TODO: Map, Check-in button, Video classroom entry */}
      </View>
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
