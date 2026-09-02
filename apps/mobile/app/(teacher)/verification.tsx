// apps/mobile/app/(teacher)/verification.tsx  (Figma Verification Status restyle)
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const DOCS = [
  { name: "Fayda National ID", status: "verified", note: "Verified Jan 15, 2025" },
  { name: "Degree Certificate", status: "verified", note: "AAU MSc · Verified Jan 16" },
  { name: "Biometric Liveness", status: "verified", note: "Match score 98.7%" },
  { name: "University Transcript", status: "needs-more", note: "Admin requests clearer scan" },
  { name: "Teaching License", status: "pending", note: "Under review" },
];

export default function VerificationScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Verification Status</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "#FFFBEB", borderRadius: 16, padding: 16 }}>
          <Text style={{ color: "#D97706", fontWeight: "800" }}>⏳ Verification In Progress</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>1 document needs attention</Text>
        </View>
        <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
          {DOCS.map((d) => (
            <View key={d.name} style={{ flexDirection: "row", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: isDark ? "#1E3A5F" : "#F1F5F9" }}>
              <Text style={{ fontSize: 16 }}>{d.status === "verified" ? "✅" : d.status === "needs-more" ? "⚠️" : "⏳"}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>{d.name}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{d.note}</Text>
              </View>
              {d.status === "needs-more" && (
                <Text style={{ color: "#D97706", fontWeight: "800", fontSize: 11 }}>Re-upload</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}