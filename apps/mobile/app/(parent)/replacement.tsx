// apps/mobile/app/(parent)/replacement.tsx
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const REASONS = ["No-show / Late", "Behavior concern", "Teaching quality", "Schedule conflict", "Other"];

export default function RequestReplacementScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [reason, setReason] = useState(0);
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Request Replacement</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "#FFFBEB", borderRadius: 16, padding: 14 }}>
          <Text style={{ color: "#D97706", fontWeight: "800" }}>🔄 Replacement Guarantee</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>Free replacement within 24 hours on Premium & Elite.</Text>
        </View>
        {REASONS.map((r, i) => (
          <TouchableOpacity
            key={r}
            onPress={() => setReason(i)}
            style={{
              backgroundColor: card, borderRadius: 14, padding: 14,
              borderWidth: reason === i ? 1.5 : 0, borderColor: primary,
            }}
          >
            <Text style={{ color: text, fontWeight: reason === i ? "800" : "600" }}>{r}</Text>
          </TouchableOpacity>
        ))}
        <TextInput
          placeholder="Additional details..."
          placeholderTextColor={sub}
          multiline
          style={{
            backgroundColor: card, borderRadius: 14, padding: 14, minHeight: 90,
            color: text, textAlignVertical: "top", borderWidth: 1, borderColor: border,
          }}
        />
        <TouchableOpacity
          style={{ backgroundColor: primary, borderRadius: 14, paddingVertical: 16, alignItems: "center" }}
          onPress={() => { Alert.alert("Submitted", "Replacement request received."); router.back(); }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Submit Replacement Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}