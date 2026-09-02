// apps/mobile/app/(parent)/session-history.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const SESSIONS = [
  { date: "Mon, Jun 2", time: "4:00–5:30 PM", tutor: "Selamawit Tadesse", subject: "Mathematics", amount: 675, status: "Completed" },
  { date: "Thu, May 30", time: "3:00–4:30 PM", tutor: "Selamawit Tadesse", subject: "Physics", amount: 675, status: "Completed" },
  { date: "Fri, May 24", time: "5:00–6:00 PM", tutor: "Tigist Haile", subject: "Statistics", amount: 380, status: "Cancelled" },
];

export default function SessionHistoryScreen() {
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
        <View>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Session History</Text>
          <Text style={{ color: sub, fontSize: 11 }}>24 sessions</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
        {SESSIONS.map((s, i) => (
          <View key={i} style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: sub, fontSize: 11 }}>{s.date} · {s.time}</Text>
              <Text style={{ color: s.status === "Completed" ? primary : "#EF4444", fontSize: 11, fontWeight: "800" }}>{s.status}</Text>
            </View>
            <Text style={{ color: text, fontWeight: "800", marginTop: 4 }}>{s.subject} with {s.tutor}</Text>
            <Text style={{ color: text, fontWeight: "800", marginTop: 6 }}>{s.amount} ETB</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}