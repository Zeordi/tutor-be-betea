// apps/mobile/app/(teacher)/(tabs)/contracts.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const CONTRACTS = [
  { student: "Kidane M.", grade: "10", subject: "Mathematics", parent: "Yeshi Haile", monthly: "9,000", next: "Today 4:00 PM", status: "Active", id: "c1" },
  { student: "Liya A.", grade: "11", subject: "Physics", parent: "Abebe Girma", monthly: "10,000", next: "Thu 3:00 PM", status: "Active", id: "c2" },
];

export default function ActiveContractsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ padding: 14 }}>
        <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Active Contracts</Text>
        <Text style={{ color: sub, fontSize: 11 }}>3 active · 2 pending start</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
        {CONTRACTS.map((c) => (
          <View key={c.id} style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text style={{ color: text, fontWeight: "800" }}>{c.student} (Gr.{c.grade})</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{c.subject} · Parent: {c.parent}</Text>
              </View>
              <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>{c.status}</Text>
            </View>
            <Text style={{ color: text, marginTop: 8, fontWeight: "700" }}>{c.monthly} ETB/mo · Next: {c.next}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: primary, borderRadius: 12, paddingVertical: 10, alignItems: "center" }}
                onPress={() => router.push(`/(teacher)/session/${c.id}`)}
              >
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, borderWidth: 1, borderColor: primary, borderRadius: 12, paddingVertical: 10, alignItems: "center" }}
                onPress={() => router.push("/(shared)/chat/room-1")}
              >
                <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}