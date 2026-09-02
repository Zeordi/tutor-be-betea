// apps/mobile/app/(teacher)/analytics.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeacherAnalyticsScreen() {
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
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Analytics</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {[
            ["Total Earned", "12,800 ETB"],
            ["Sessions", "32"],
            ["Avg Rating", "4.9 ⭐"],
            ["Profile Views", "284"],
          ].map(([l, v]) => (
            <View key={l} style={{ width: "48%", backgroundColor: card, borderRadius: 16, padding: 14 }}>
              <Text style={{ color: text, fontWeight: "900", fontSize: 16 }}>{v}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>{l}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: sub, fontSize: 10, fontWeight: "800", marginBottom: 10 }}>SESSIONS BY SUBJECT</Text>
          {[["Mathematics", 56], ["Physics", 31], ["Statistics", 13]].map(([s, pct]) => (
            <View key={String(s)} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: text, fontSize: 12 }}>{s}</Text>
                <Text style={{ color: sub, fontSize: 12 }}>{pct}%</Text>
              </View>
              <View style={{ height: 6, backgroundColor: isDark ? "#1E3A5F" : "#E2E8F0", borderRadius: 99, marginTop: 4 }}>
                <View style={{ width: `${pct}%` as any, height: 6, backgroundColor: primary, borderRadius: 99 }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}