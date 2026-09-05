import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

type ZoneStatus = "inside" | "approaching" | "outside";

export default function LocationSharingScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [status] = useState<ZoneStatus>("inside");
  const meters = status === "inside" ? 42 : status === "approaching" ? 118 : 210;

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  const statusLabel =
    status === "inside"
      ? "✓ Inside geofence"
      : status === "approaching"
        ? "⚡ Approaching zone"
        : "✗ Outside zone";
  const statusColor =
    status === "inside" ? "#059669" : status === "approaching" ? "#D97706" : "#DC2626";
  const pinColor =
    status === "inside" ? "#10B981" : status === "approaching" ? "#F59E0B" : "#EF4444";

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
              Active · Sarbet, Addis Ababa
            </Text>
          </View>
        </View>
        <View style={styles.livePill}>
          <Text style={{ color: "#047857", fontSize: 10, fontWeight: "800" }}>
            Live {mm}:{ss}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.mapWrap}>
          <View style={[styles.ring, styles.ringOuter, { borderColor: primary + "33" }]} />
          <View style={[styles.ring, styles.ringMid, { borderColor: primary + "55" }]} />
          <View style={[styles.ring, styles.ringInner, { borderColor: primary + "88" }]} />
          <View style={[styles.homePin, { backgroundColor: primary }]}>
            <Text style={{ fontSize: 12 }}>🏠</Text>
          </View>
          <View
            style={[
              styles.tutorPin,
              {
                backgroundColor: pinColor,
                top: status === "inside" ? "48%" : status === "approaching" ? "28%" : "12%",
                right: status === "inside" ? "42%" : "18%",
              },
            ]}
          >
            <Text style={{ fontSize: 10 }}>👤</Text>
          </View>
          <View style={[styles.mapBanner, { backgroundColor: card }]}>
            <Text style={{ color: statusColor, fontWeight: "900", fontSize: 13 }}>
              {statusLabel}
            </Text>
            <Text style={{ color: sub, fontSize: 11 }}>
              {meters}m from home · max 150m radius
            </Text>
          </View>
        </View>

        <View style={{ padding: 16, gap: 12 }}>
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={[styles.avatar, { backgroundColor: primary }]}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>HB</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "800" }}>Hana Bekele</Text>
                <Text style={{ color: sub, fontSize: 12 }}>Tutor · Mathematics · Grade 9</Text>
              </View>
              <View
                style={{
                  backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "#D1FAE5",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: "#047857", fontSize: 10, fontWeight: "800" }}>In session</Text>
              </View>
            </View>
            <Text style={{ color: sub, fontSize: 12, marginTop: 10 }}>
              Sarbet, Addis Ababa · Home geofence · Parent notified on enter/exit
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <Text style={{ color: text, fontWeight: "800", marginBottom: 8 }}>Safety rules</Text>
            {[
              "Check-in only valid inside 150m radius",
              "Live share ends automatically at check-out",
              "SOS can still fire with last known GPS",
              "Location is session-only — not stored publicly",
            ].map((x) => (
              <Text key={x} style={{ color: sub, fontSize: 12, marginBottom: 4 }}>
                • {x}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.sosLink, { borderColor: "#DC2626" }]}
            onPress={() => router.push("/(shared)/sos-confirm")}
          >
            <Text style={{ color: "#DC2626", fontWeight: "800", fontSize: 13 }}>
              🚨 Open Emergency SOS
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10B981" },
  livePill: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  mapWrap: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(13,148,136,0.12)",
  },
  ring: { position: "absolute", borderWidth: 2, borderRadius: 999 },
  ringOuter: { width: 150, height: 150 },
  ringMid: { width: 108, height: 108 },
  ringInner: { width: 68, height: 68 },
  homePin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  tutorPin: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  mapBanner: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 12,
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  sosLink: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
});