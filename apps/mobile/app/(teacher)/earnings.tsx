// apps/mobile/app/(teacher)/earnings.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EarningsScreen() {
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
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Earnings & Payout</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: "#0F766E", borderRadius: 20, padding: 20 }}>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Available to Withdraw</Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 4 }}>8,450 ETB</Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 6 }}>+12,800 this month · −4,350 withdrawn</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, paddingVertical: 10, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Withdraw All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, paddingVertical: 10, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Schedule Payout</Text>
            </TouchableOpacity>
          </View>
        </View>
        {[
          ["Session · Kidane Math", "+675 ETB", "Today"],
          ["Payout to Telebirr", "−3,000 ETB", "Mon"],
          ["Session · Liya Physics", "+500 ETB", "Sun"],
        ].map(([t, a, d]) => (
          <View key={t} style={{ backgroundColor: card, borderRadius: 14, padding: 14, flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: text, fontWeight: "700" }}>{t}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>{d}</Text>
            </View>
            <Text style={{ color: String(a).startsWith("+") ? "#10B981" : text, fontWeight: "800" }}>{a}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}