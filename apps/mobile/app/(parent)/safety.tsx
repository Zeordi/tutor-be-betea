// apps/mobile/app/(parent)/safety.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafetyCenterScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Safety Center</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: "#DC2626", borderRadius: 20, padding: 20, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Emergency · Hold for 3 seconds</Text>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginVertical: 12, borderWidth: 4, borderColor: "rgba(255,255,255,0.4)" }}>
            <Text style={{ fontSize: 28 }}>🚨</Text>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 12 }}>SOS</Text>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, textAlign: "center" }}>
            Alerts emergency contacts + TBB Safety Team + location
          </Text>
        </View>

        <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: sub, fontSize: 10, fontWeight: "800", marginBottom: 10 }}>SAFETY FEATURES</Text>
          {[
            ["📍", "GPS Tracking", "Track tutor during home sessions"],
            ["🔒", "Anti-Poaching", "Auto-redact contacts in chat"],
            ["🛡️", "Fayda ID Verify", "Verify identity before session"],
          ].map(([icon, label, desc]) => (
            <View key={label} style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
              <Text style={{ fontSize: 18 }}>{icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>{label}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{desc}</Text>
              </View>
              <Text style={{ color: "#0D9488", fontWeight: "800" }}>ON</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}