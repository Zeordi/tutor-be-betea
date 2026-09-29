import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

const FEATURES = [
  {
    icon: "📍",
    label: "GPS Tracking",
    desc: "Track tutor location during home sessions",
    href: "/(shared)/location-sharing" as const,
  },
  {
    icon: "📡",
    label: "Offline Session Logger",
    desc: "Queued check-in/out when offline",
    href: "/(shared)/offline-session" as const,
  },
  {
    icon: "🔒",
    label: "Anti-Poaching",
    desc: "Auto-redact contacts in chat",
    href: null,
  },
  {
    icon: "📋",
    label: "Session Logging",
    desc: "All sessions logged with timestamps",
    href: "/(parent)/session-history" as const,
  },
  {
    icon: "🛡️",
    label: "Fayda ID Verify",
    desc: "Verify tutor identity before session",
    href: null,
  },
];

export default function SafetyCenterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Safety Center</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.sosCard}
          onPress={() => router.push("/(shared)/sos-confirm")}
        >
          <Text style={styles.sosHint}>Emergency · Opens SOS confirm</Text>
          <View style={styles.sosBtn}>
            <Text style={{ fontSize: 28 }}>🚨</Text>
            <Text style={styles.sosLabel}>SOS</Text>
          </View>
          <Text style={styles.sosSub}>
            Alerts emergency contacts + TBB Safety Team + live location. Hold 3 seconds on the next
            screen.
          </Text>
          <Text style={styles.sosCta}>Tap to open Emergency SOS →</Text>
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>QUICK ACTIONS</Text>
          <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: border }]}
            onPress={() => router.push("/(shared)/location-sharing")}
          >
            <Text style={{ fontSize: 18 }}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>
                Live location + geofence
              </Text>
              <Text style={{ color: sub, fontSize: 11 }}>150m check-in zone</Text>
            </View>
            <Text style={{ color: primary, fontWeight: "800" }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: border }]}
            onPress={() => router.push("/(shared)/offline-session")}
          >
            <Text style={{ fontSize: 18 }}>📡</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>
                Offline session logger
              </Text>
              <Text style={{ color: sub, fontSize: 11 }}>Sync pending GPS logs</Text>
            </View>
            <Text style={{ color: primary, fontWeight: "800" }}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push("/(parent)/replacement")}
          >
            <Text style={{ fontSize: 18 }}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>
                Request replacement tutor
              </Text>
              <Text style={{ color: sub, fontSize: 11 }}>14-day escrow guarantee</Text>
            </View>
            <Text style={{ color: primary, fontWeight: "800" }}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>EMERGENCY CONTACTS</Text>
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 28 }}>🆘</Text>
            <Text style={[styles.emptyTitle, { color: text }]}>No emergency contacts yet</Text>
            <Text style={{ color: sub, fontSize: 12, textAlign: "center", marginTop: 4 }}>
              Manage emergency contacts in Settings.
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>SAFETY FEATURES</Text>
          {FEATURES.map((f) => (
            <TouchableOpacity
              key={f.label}
              disabled={!f.href}
              onPress={() => f.href && router.push(f.href)}
              style={styles.featureRow}
            >
              <Text style={{ fontSize: 18 }}>{f.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>{f.label}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{f.desc}</Text>
              </View>
              <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>
                {f.href ? "OPEN" : "ON"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.reportBtn, { borderColor: isDark ? "rgba(220,38,38,0.35)" : "#FECACA" }]}
          onPress={() => router.push("/(shared)/support/create")}
        >
          <Text style={[styles.reportText, { color: "#DC2626" }]}>⚠️ Report a Safety Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontWeight: "800" },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  sosCard: {
    backgroundColor: "#DC2626",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  sosHint: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" },
  sosBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  sosLabel: { color: "#fff", fontWeight: "900", fontSize: 12 },
  sosSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
  sosCta: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
    marginTop: 10,
  },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  section: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  emptyBox: { alignItems: "center", paddingVertical: 24, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  reportBtn: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  reportText: { fontWeight: "800" },
});
