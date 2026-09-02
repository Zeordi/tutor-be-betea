// apps/mobile/app/(parent)/booking.tsx
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PackageBookingScreen() {
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
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Confirm Booking</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: card, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: primary }}>
          <Text style={{ color: text, fontWeight: "900", fontSize: 16 }}>Monthly Package</Text>
          <Text style={{ color: primary, fontSize: 26, fontWeight: "900", marginTop: 6 }}>7,500 ETB <Text style={{ fontSize: 13, color: sub }}>/mo</Text></Text>
          {["20 hours · 450 ETB/hr", "Home visits + Online", "2 Progress reports"].map((f) => (
            <Text key={f} style={{ color: sub, fontSize: 12, marginTop: 4 }}>✓ {f}</Text>
          ))}
        </View>
        <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: sub, fontSize: 10, fontWeight: "800", marginBottom: 8 }}>PAYMENT METHOD</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[["📱", "Telebirr", true], ["🏦", "CBE Birr", false], ["💳", "Card", false]].map(([icon, name, sel]) => (
              <View key={String(name)} style={{
                flex: 1, alignItems: "center", padding: 10, borderRadius: 12,
                borderWidth: 2, borderColor: sel ? primary : (isDark ? "#1E3A5F" : "#E2E8F0"),
              }}>
                <Text>{icon}</Text>
                <Text style={{ color: text, fontSize: 10, fontWeight: "700" }}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
          {[["Monthly Package", "7,500 ETB"], ["Platform fee (5%)", "375 ETB"], ["Total", "7,875 ETB"]].map(([l, v]) => (
            <View key={l} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ color: l === "Total" ? text : sub, fontWeight: l === "Total" ? "800" : "500" }}>{l}</Text>
              <Text style={{ color: l === "Total" ? primary : text, fontWeight: "800" }}>{v}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={{ backgroundColor: primary, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
          onPress={() => Alert.alert("Payment", "Redirecting to Telebirr...")}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Confirm & Pay via Telebirr →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}