import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getToken } from "@/lib/api";

export default function SubmitProgressScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [contractId, setContractId] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [topics, setTopics] = useState("");
  const [quizScore, setQuizScore] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!contractId || !weekNumber || !topics) {
      Alert.alert("Missing fields", "Please fill the required fields");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractId,
          weekNumber: Number(weekNumber),
          topicsCovered: topics,
          quizScore: quizScore ? Number(quizScore) : undefined,
          strengthsNotes: strengths,
          improvementAreas: improvements,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit report");
      }

      Alert.alert("Success", "Progress report submitted successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Submit Weekly Report</Text>

        <Text style={[styles.label, { color: colors.text }]}>Contract ID *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={contractId}
          onChangeText={setContractId}
          placeholder="Enter contract ID"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Week Number *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={weekNumber}
          onChangeText={setWeekNumber}
          keyboardType="numeric"
          placeholder="e.g. 3"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Topics Covered *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={topics}
          onChangeText={setTopics}
          placeholder="Algebra, Quadratic equations..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />

        <Text style={[styles.label, { color: colors.text }]}>Quiz Score (%)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={quizScore}
          onChangeText={setQuizScore}
          keyboardType="numeric"
          placeholder="85"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Strengths</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={strengths}
          onChangeText={setStrengths}
          placeholder="Good problem solving..."
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Areas to Improve</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={improvements}
          onChangeText={setImprovements}
          placeholder="Needs more practice on..."
          placeholderTextColor={colors.textSecondary}
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Report</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 32,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
