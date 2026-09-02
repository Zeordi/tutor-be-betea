// apps/mobile/app/(parent)/notification-settings.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const GROUPS = [
  { group: "Session Alerts", items: [["Session reminders", true], ["Check-in confirmed", true], ["Session completed", true]] },
  { group: "Payments", items: [["Payment received", true], ["Milestone released", true], ["Invoice available", false]] },
  { group: "Safety", items: [["Geofence alerts", true], ["SOS confirmed", true]] },
];

export default function NotificationSettingsScreen() {
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
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Notification Settings</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {GROUPS.map((g) => (
          <View key={g.group}>
            <Text style={{ color: sub, fontSize: 10, fontWeight: "800", marginBottom: 8 }}>{g.group.toUpperCase()}</Text>
            <View style={{ backgroundColor: card, borderRadius: 16, overflow: "hidden" }}>
              {g.items.map(([label, on], i) => (
                <View key={String(label)} style={{ flexDirection: "row", alignItems: "center", padding: 14, borderTopWidth: i ? 1 : 0, borderTopColor: isDark ? "#1E3A5F" : "#F1F5F9" }}>
                  <Text style={{ color: text, flex: 1, fontWeight: "600", fontSize: 13 }}>{label}</Text>
                  <View style={{ width: 40, height: 22, borderRadius: 11, backgroundColor: on ? primary : "#CBD5E1", justifyContent: "center" }}>
                    <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff", marginLeft: on ? 18 : 2 }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}