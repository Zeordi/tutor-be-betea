// apps/mobile/app/(auth)/permissions.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const PERMS = [
  ["📍", "Location", "Required for geofenced attendance"],
  ["🔔", "Notifications", "Session and payment alerts"],
  ["📷", "Camera", "Document verification uploads"],
];

export default function PermissionsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg, padding: 16 }}>
      <Text style={{ color: text, fontSize: 22, fontWeight: "900", marginTop: 20 }}>
        App Permissions
      </Text>
      <Text style={{ color: sub, marginTop: 6, marginBottom: 16 }}>
        Enable these for the best Tutor Be Betea experience.
      </Text>
      {PERMS.map(([icon, label, desc]) => (
        <View
          key={label}
          style={{
            backgroundColor: card,
            borderRadius: 14,
            padding: 14,
            flexDirection: "row",
            gap: 12,
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>{icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: text, fontWeight: "800" }}>{label}</Text>
            <Text style={{ color: sub, fontSize: 12 }}>{desc}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={{
          backgroundColor: primary,
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: "center",
          marginTop: 12,
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}