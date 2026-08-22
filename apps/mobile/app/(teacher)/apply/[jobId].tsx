import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getToken } from "@/lib/api";

export default function ApplyJobScreen() {
  const { jobId } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // TODO: Create real /jobs/:id/apply endpoint later
      // For now we simulate success
      await new Promise((r) => setTimeout(r, 800));

      Alert.alert("Application Sent", "The parent will review your application.");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Apply for Job</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Job ID: {jobId}
        </Text>

        <Text style={[styles.label, { color: colors.text }]}>Message to Parent (optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Introduce yourself and your experience..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleApply}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Application</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700" },
  label: { fontSize: 15, fontWeight: "600", marginTop: 24, marginBottom: 8 },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
