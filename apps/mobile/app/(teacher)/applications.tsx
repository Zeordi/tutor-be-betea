// apps/mobile/app/(teacher)/applications.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const APPS = [
  { title: "Grade 12 Physics Tutor", area: "Bole", rate: "500 ETB/hr", status: "Shortlisted", when: "2h ago" },
  { title: "Mathematics Grade 9", area: "Kazanchis", rate: "400 ETB/hr", status: "Hired", when: "1d ago" },
  { title: "Chemistry – Grade 11", area: "Arat Kilo", rate: "450 ETB/hr", status: "Pending", when: "2d ago" },
];

export default function MyApplicationsScreen() {
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
          <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>My Applications</Text>
          <Text style={{ color: sub, fontSize: 11 }}>8 applications · 3 active</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {APPS.map((a) => (
          <View key={a.title} style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: text, fontWeight: "800", flex: 1 }}>{a.title}</Text>
              <Text style={{ color: a.status === "Hired" ? primary : sub, fontWeight: "800", fontSize: 11 }}>{a.status}</Text>
            </View>
            <Text style={{ color: sub, fontSize: 11, marginTop: 4 }}>📍 {a.area} · {a.rate} · {a.when}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}