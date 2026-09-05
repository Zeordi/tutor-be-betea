import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function SessionScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [status, setStatus] = useState<"idle" | "checked-in" | "checked-out">("idle");
  const distance = 42; // mock meters
  const inside = distance <= 150;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: colors.mutedForeground }}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Session check-in</Text>
      </View>

      <View style={{ padding: 16, gap: 14 }}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>TODAY · MATHEMATICS</Text>
          <Text style={[styles.h, { color: colors.foreground }]}>Selamawit Tadesse</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Grade 10 · Bole, Addis Ababa</Text>
        </View>

        <View style={[styles.map, { backgroundColor: isDark ? "#134E4A" : "#CCFBF1" }]}>
          <Text style={{ fontSize: 40 }}>📍</Text>
          <Text style={{ color: colors.primary, fontWeight: "800", marginTop: 8 }}>
            {inside ? "✓ Inside geofence" : "✗ Outside zone"}
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{distance}m · 150m radius</Text>
        </View>

        <View
          style={[
            styles.banner,
            {
              backgroundColor: inside ? "#D1FAE5" : "#FEE2E2",
              borderColor: inside ? "#6EE7B7" : "#FECACA",
            },
          ]}
        >
          <Text style={{ fontWeight: "700", color: inside ? "#065F46" : "#991B1B" }}>
            {inside ? "You can check in now" : "Move closer to the session location"}
          </Text>
        </View>

        {status === "idle" && (
          <Pressable
            disabled={!inside}
            style={[
              styles.cta,
              { backgroundColor: inside ? colors.primary : colors.border },
            ]}
            onPress={() => setStatus("checked-in")}
          >
            <Text style={styles.ctaText}>Check in</Text>
          </Pressable>
        )}
        {status === "checked-in" && (
          <>
            <View style={[styles.banner, { backgroundColor: "#D1FAE5", borderColor: "#6EE7B7" }]}>
              <Text style={{ fontWeight: "700", color: "#065F46" }}>Checked in · attendance logged</Text>
            </View>
            <Pressable
              style={[styles.cta, { backgroundColor: "#DC2626" }]}
              onPress={() => setStatus("checked-out")}
            >
              <Text style={styles.ctaText}>Check out</Text>
            </Pressable>
          </>
        )}
        {status === "checked-out" && (
          <View style={[styles.banner, { backgroundColor: "#E0F2FE", borderColor: "#7DD3FC" }]}>
            <Text style={{ fontWeight: "700", color: "#0C4A6E" }}>Session completed · pending parent confirm</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: "800" },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  h: { fontSize: 18, fontWeight: "800", marginTop: 4 },
  map: {
    height: 180,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: { borderRadius: 12, borderWidth: 1, padding: 12 },
  cta: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});