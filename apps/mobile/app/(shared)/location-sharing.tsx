import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationSharingScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const inside = true;
  const meters = 42;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontWeight: "700" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Live location + geofence</Text>
        <Text style={{ color: sub, marginTop: 8, lineHeight: 18 }}>
          Share live location during home sessions. Check-in must be within 150m of the registered address.
        </Text>

        <View style={[styles.map, { backgroundColor: isDark ? "rgba(13,148,136,0.18)" : "#CCFBF1" }]}>
          <Text style={{ fontSize: 36 }}>📍</Text>
          <Text style={{ color: primary, fontWeight: "900", marginTop: 8 }}>
            {inside ? "✓ Inside zone" : "✗ Outside zone"}
          </Text>
          <Text style={{ color: sub, fontSize: 12 }}>{meters}m · 150m radius</Text>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={{ color: text, fontWeight: "800" }}>Session location</Text>
          <Text style={{ color: sub, fontSize: 13, marginTop: 4 }}>Bole, Addis Ababa · Home geofence</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 8 }}>
            Tutor: Selamawit Tadesse · Parent notified on enter/exit
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: "900", marginTop: 12 },
  map: {
    marginTop: 18,
    height: 180,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  card: { marginTop: 14, borderRadius: 16, borderWidth: 1, padding: 14 },
});