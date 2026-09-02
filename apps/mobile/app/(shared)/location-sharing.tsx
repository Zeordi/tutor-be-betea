// apps/mobile/app/(shared)/location-sharing.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationSharingScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg, padding: 16 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: sub }}>← Back</Text>
      </TouchableOpacity>
      <Text style={{ color: text, fontSize: 20, fontWeight: "900", marginTop: 12 }}>
        Live Location + Geofence
      </Text>
      <Text style={{ color: sub, marginTop: 8, lineHeight: 18 }}>
        Share live location during home sessions. Check-in must be within 150m of registered home.
      </Text>
      <View
        style={{
          marginTop: 20,
          height: 160,
          borderRadius: 18,
          backgroundColor: isDark ? "rgba(13,148,136,0.15)" : "#F0FDFA",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 28 }}>📍</Text>
        <Text style={{ color: primary, fontWeight: "800", marginTop: 6 }}>150m geofence active</Text>
      </View>
    </SafeAreaView>
  );
}