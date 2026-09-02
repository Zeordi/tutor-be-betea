import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
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
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Confirm Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={{ color: text, fontWeight: "800", fontSize: 15 }}>Selamawit Tadesse</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>Mathematics · Grade 9–12 · ⭐ 4.9</Text>
        </View>

        <View style={[styles.package, { backgroundColor: card, borderColor: primary }]}>
          <Text style={{ color: text, fontWeight: "900", fontSize: 16 }}>Monthly Package</Text>
          <Text style={{ color: primary, fontSize: 26, fontWeight: "900", marginTop: 6 }}>
            7,500 ETB <Text style={{ fontSize: 13, color: sub }}>/mo</Text>
          </Text>
          {["20 hours · 450 ETB/hr", "Home visits + Online", "2 Progress reports", "Priority scheduling"].map(
            (f) => (
              <Text key={f} style={{ color: sub, fontSize: 12, marginTop: 4 }}>
                ✓ {f}
              </Text>
            )
          )}
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.section, { color: sub }]}>PAYMENT METHOD</Text>
          <View style={styles.payRow}>
            {[["📱", "Telebirr", true], ["🏦", "CBE Birr", false], ["💳", "Card", false]].map(
              ([icon, name, sel]) => (
                <View
                  key={String(name)}
                  style={[
                    styles.payItem,
                    {
                      borderColor: sel ? primary : border,
                      backgroundColor: sel
                        ? isDark
                          ? "rgba(13,148,136,0.15)"
                          : "#F0FDFA"
                        : "transparent",
                    },
                  ]}
                >
                  <Text>{icon}</Text>
                  <Text style={{ color: text, fontSize: 10, fontWeight: "700" }}>{name}</Text>
                </View>
              )
            )}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.section, { color: sub }]}>SUMMARY</Text>
          {[
            ["Monthly Package", "7,500 ETB"],
            ["Platform fee (5%)", "375 ETB"],
            ["Total", "7,875 ETB"],
          ].map(([l, v]) => (
            <View key={l} style={styles.sumRow}>
              <Text style={{ color: l === "Total" ? text : sub, fontWeight: l === "Total" ? "800" : "500" }}>
                {l}
              </Text>
              <Text style={{ color: l === "Total" ? primary : text, fontWeight: "800" }}>{v}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submit, { backgroundColor: primary }]}
          onPress={() => Alert.alert("Payment", "Continue with Telebirr...")}
        >
          <Text style={styles.submitText}>Confirm & Pay via Telebirr →</Text>
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
  card: { borderRadius: 16, padding: 14 },
  package: { borderRadius: 16, padding: 16, borderWidth: 2 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 10 },
  payRow: { flexDirection: "row", gap: 8 },
  payItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  sumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  submit: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});