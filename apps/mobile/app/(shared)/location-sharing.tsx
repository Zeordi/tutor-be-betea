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
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border, backgroundColor: card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontWeight: "700" }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ color: text, fontWeight: "800", fontSize: 14 }}>
            Live Location Sharing
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
            <View style={styles.liveDot} />
            <Text style={{ color: "#10B981", fontSize: 11, fontWeight: "700" }}>
              Active · Bole, Addis Ababa
            </Text>
          </View>
        </View>
        <View style={styles.livePill}>
          <Text style={{ color: "#047857", fontSize: 10, fontWeight: "800" }}>Live</Text>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <View style={[styles.ring, styles.ringOuter, { borderColor: primary + "33" }]} />
        <View style={[styles.ring, styles.ringMid, { borderColor: primary + "55" }]} />
        <View style={[styles.ring, styles.ringInner, { borderColor: primary + "88" }]} />
        <View style={[styles.pin, { backgroundColor: primary }]} />
        <View style={[styles.mapBanner, { backgroundColor: card }]}>
          <Text style={{ color: primary, fontWeight: "900", fontSize: 13 }}>
            {inside ? "✓ Inside geofence" : "✗ Outside zone"}
          </Text>
          <Text style={{ color: sub, fontSize: 11 }}>
            {meters}m from home · max 150m
          </Text>
        </View>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={{ color: text, fontWeight: "800" }}>Session location</Text>
          <Text style={{ color: sub, fontSize: 13, marginTop: 4 }}>
            Bole, Addis Ababa · Home geofence
          </Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 8 }}>
            Tutor: Selamawit Tadesse · Parent notified on enter/exit
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={{ color: text, fontWeight: "800", marginBottom: 8 }}>
            Safety rules
          </Text>
          {[
            "Check-in only valid inside 150m radius",
            "Live share ends automatically at check-out",
            "SOS can still fire with last known GPS",
          ].map((x) => (
            <Text key={x} style={{ color: sub, fontSize: 12, marginBottom: 4 }}>
              • {x}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  livePill: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  mapWrap: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(13,148,136,0.12)",
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 999,
  },
  ringOuter: { width: 140, height: 140 },
  ringMid: { width: 100, height: 100 },
  ringInner: { width: 64, height: 64 },
  pin: { width: 16, height: 16, borderRadius: 8 },
  mapBanner: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 12,
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
});