// apps/mobile/app/(parent)/(tabs)/profile.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParentProfileScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  const items = [
    ["👶", "My Children", "/(parent)/children"],
    ["❤️", "Saved Tutors", "/(parent)/favorites"],
    ["🛡️", "Safety Center", "/(parent)/safety"],
    ["📜", "Session History", "/(parent)/session-history"],
    ["🔔", "Notifications", "/(parent)/notification-settings"],
    ["🎫", "Support", "/(shared)/support"],
    ["⚙️", "Settings", "/(shared)/settings"],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: card, borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: primary, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>{(user?.fullName || "P")[0]}</Text>
          </View>
          <View>
            <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>{user?.fullName || "Parent"}</Text>
            <Text style={{ color: sub, fontSize: 12 }}>Parent · Addis Ababa</Text>
          </View>
        </View>
        {items.map(([icon, label, href]) => (
          <TouchableOpacity
            key={label}
            style={{ backgroundColor: card, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}
            onPress={() => router.push(href as any)}
          >
            <Text style={{ fontSize: 18 }}>{icon}</Text>
            <Text style={{ color: text, fontWeight: "700", flex: 1 }}>{label}</Text>
            <Text style={{ color: sub }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}