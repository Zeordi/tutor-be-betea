// apps/mobile/app/(parent)/progress/[id].tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressDashboard() {
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
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Progress Dashboard</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: "#0F766E", borderRadius: 18, padding: 16 }}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Weekly Mastery · Kidane</Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 6, fontSize: 13 }}>
            Algebra ↑ · Homework 90% · Next: word problems
          </Text>
        </View>
        {[
          ["Algebra", 88], ["Geometry", 76], ["Functions", 92],
        ].map(([n, v]) => (
          <View key={String(n)} style={{ backgroundColor: card, borderRadius: 14, padding: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: text, fontWeight: "700" }}>{n}</Text>
              <Text style={{ color: primary, fontWeight: "800" }}>{v}%</Text>
            </View>
            <View style={{ height: 6, backgroundColor: isDark ? "#1E3A5F" : "#E2E8F0", borderRadius: 99, marginTop: 8 }}>
              <View style={{ width: `${v}%` as any, height: 6, backgroundColor: primary, borderRadius: 99 }} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}