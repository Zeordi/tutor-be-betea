import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

export default function ProgressSubmitScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { contractId } = useLocalSearchParams<{ contractId: string }>();
  const [mastery, setMastery] = useState("82");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!contractId) {
      Alert.alert("Error", "Missing contract ID");
      return;
    }
    try {
      setLoading(true);
      await apiRequest(paths.progressSubmit(contractId), {
        method: "POST",
        body: JSON.stringify({
          mastery: Number(mastery),
          notes,
        }),
      });
      Alert.alert("Submitted", "Progress report sent to parent.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to submit progress");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: colors.mutedForeground }}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Progress report</Text>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Student</Text>
          <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 16 }}>Kidane Haile · Grade 10 Math</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>MASTERY %</Text>
          <TextInput
            value={mastery}
            onChangeText={setMastery}
            keyboardType="number-pad"
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: isDark ? "#1E3A5F" : "#F8FAFC" }]}
          />
          <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 12 }]}>SESSION NOTES</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Strengths, focus areas, next plan..."
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: isDark ? "#1E3A5F" : "#F8FAFC",
                minHeight: 120,
                textAlignVertical: "top",
              },
            ]}
          />
        </View>

        <Pressable
          style={[styles.cta, { backgroundColor: colors.primary }]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>Submit report to parent</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1 },
  title: { fontSize: 17, fontWeight: "800" },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15 },
  cta: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});