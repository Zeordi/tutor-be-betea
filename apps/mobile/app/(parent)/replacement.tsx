import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const REASONS = [
  "No-show / Late",
  "Behavior concern",
  "Teaching quality",
  "Schedule conflict",
  "Other",
];

export default function RequestReplacementScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [reason, setReason] = useState(0);
  const [details, setDetails] = useState("");

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Request Replacement</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.notice, { backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "#FFFBEB" }]}>
          <Text style={{ color: "#D97706", fontWeight: "800", fontSize: 13 }}>
            🔄 Replacement Guarantee
          </Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4, lineHeight: 17 }}>
            Premium & Elite plans include free tutor replacement within 24 hours.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.section, { color: sub }]}>CURRENT TUTOR</Text>
          <Text style={{ color: text, fontWeight: "800" }}>Selamawit Tadesse</Text>
          <Text style={{ color: sub, fontSize: 12 }}>Mathematics · Contract #TBB-4801</Text>
        </View>

        <Text style={[styles.section, { color: sub }]}>REASON FOR REPLACEMENT</Text>
        {REASONS.map((r, i) => (
          <TouchableOpacity
            key={r}
            onPress={() => setReason(i)}
            style={[
              styles.reason,
              {
                backgroundColor: card,
                borderColor: reason === i ? primary : "transparent",
                borderWidth: 1.5,
              },
            ]}
          >
            <View
              style={[
                styles.radio,
                { borderColor: reason === i ? primary : border },
              ]}
            >
              {reason === i && <View style={[styles.radioDot, { backgroundColor: primary }]} />}
            </View>
            <Text style={{ color: text, fontSize: 13 }}>{r}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.section, { color: sub, marginTop: 8 }]}>ADDITIONAL DETAILS</Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Describe the issue..."
          placeholderTextColor={sub}
          multiline
          style={[
            styles.textarea,
            { color: text, backgroundColor: card, borderColor: border },
          ]}
        />

        <TouchableOpacity
          style={[styles.submit, { backgroundColor: primary }]}
          onPress={() => {
            Alert.alert("Submitted", "A replacement will be found within 24 hours.");
            router.back();
          }}
        >
          <Text style={styles.submitText}>Submit Replacement Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontWeight: "800" },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  notice: { borderRadius: 16, padding: 14 },
  card: { borderRadius: 16, padding: 14 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8 },
  reason: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 14,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 8, height: 8, borderRadius: 4 },
  textarea: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 13,
  },
  submit: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});