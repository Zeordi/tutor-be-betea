import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function ContractDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Contract & Escrow</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Contract ID: {id}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text, fontWeight: "600" }}>Escrow Status</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            Funds are safely held • 14-day replacement guarantee active
          </Text>
        </View>

        {/* TODO: Contract details, payment breakdown, attendance summary */}
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
