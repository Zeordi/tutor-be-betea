import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = [
  { icon: "📍", label: "GPS Tracking", desc: "Track tutor location during home sessions", on: true },
  { icon: "🔒", label: "Anti-Poaching", desc: "Auto-redact contacts in chat", on: true },
  { icon: "📋", label: "Session Logging", desc: "All sessions logged with timestamps", on: true },
  { icon: "🛡️", label: "Fayda ID Verify", desc: "Verify tutor identity before session", on: true },
];

export default function SafetyCenterScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const primary = "#0D9488";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Safety Center</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sosCard}>
          <Text style={styles.sosHint}>Emergency · Hold for 3 seconds</Text>
          <View style={styles.sosBtn}>
            <Text style={{ fontSize: 28 }}>🚨</Text>
            <Text style={styles.sosLabel}>SOS</Text>
          </View>
          <Text style={styles.sosSub}>
            Alerts emergency contacts + TBB Safety Team + live location
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.section, { color: sub }]}>EMERGENCY CONTACTS</Text>
          {[
            ["Abebe Haile", "Spouse", "+251 91 *** 4521"],
            ["Kidist Mulugeta", "Sister", "+251 93 *** 8810"],
          ].map(([name, rel, phone]) => (
            <View key={name} style={[styles.contactRow, { borderBottomColor: border }]}>
              <View style={[styles.miniAvatar, { backgroundColor: primary }]}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>{name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>{name}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{rel} · {phone}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.section, { color: sub }]}>SAFETY FEATURES</Text>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <Text style={{ fontSize: 18 }}>{f.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>{f.label}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{f.desc}</Text>
              </View>
              <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>ON</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.reportBtn}>
          <Text style={styles.reportText}>⚠️ Report a Safety Issue</Text>
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
  card: { borderRadius: 16, padding: 14 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 10 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
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
    borderColor: "#FECACA",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  reportText: { color: "#DC2626", fontWeight: "800" },
});