// apps/mobile/app/(teacher)/calendar.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const SESSIONS = [
  { day: "Mon", time: "4:00 PM", student: "Kidane M.", sub: "Mathematics" },
  { day: "Wed", time: "3:00 PM", student: "Liya A.", sub: "Physics" },
  { day: "Fri", time: "5:00 PM", student: "Kidane M.", sub: "Algebra" },
];

export default function TeacherCalendarScreen() {
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
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Calendar</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {SESSIONS.map((s, i) => (
          <View key={i} style={{ backgroundColor: card, borderRadius: 16, padding: 14, flexDirection: "row", gap: 12, alignItems: "center" }}>
            <View style={{ width: 48, alignItems: "center" }}>
              <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>{s.day}</Text>
              <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>{s.time}</Text>
            </View>
            <View style={{ width: 1, height: 36, backgroundColor: isDark ? "#1E3A5F" : "#E2E8F0" }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800" }}>{s.student}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>{s.sub}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={{ borderWidth: 2, borderStyle: "dashed", borderColor: primary, borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: primary, fontWeight: "800" }}>+ Add Available Slot</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}