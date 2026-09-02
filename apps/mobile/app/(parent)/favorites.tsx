// apps/mobile/app/(parent)/favorites.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
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
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Saved Tutors</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {["Selamawit Tadesse", "Bereket Solomon"].map((name) => (
          <TouchableOpacity
            key={name}
            style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}
            onPress={() => router.push("/(parent)/tutor/1")}
          >
            <Text style={{ color: text, fontWeight: "800" }}>{name}</Text>
            <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>Math · Physics · 🛡️ Verified</Text>
            <Text style={{ color: primary, fontWeight: "800", marginTop: 6 }}>450 ETB/hr</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}