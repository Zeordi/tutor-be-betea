import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PackageBookingScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { teacherId, package: packageLabel } = useLocalSearchParams<{ teacherId?: string; package?: string }>();
  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  const hasSelection = Boolean(teacherId || packageLabel);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Confirm Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!hasSelection ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: border, alignItems: "center", paddingVertical: 32 }]}>
            <Text style={{ fontSize: 32 }}>📦</Text>
            <Text style={[styles.emptyTitle, { color: text, marginTop: 8 }]}>No package selected</Text>
            <Text style={{ color: sub, fontSize: 12, textAlign: "center", marginTop: 4 }}>
              Select a tutor package from their profile to continue.
            </Text>
            <TouchableOpacity
              style={[styles.backBtn, { borderColor: primary }]}
              onPress={() => router.back()}
            >
              <Text style={{ color: primary, fontWeight: "700", fontSize: 13 }}>Go back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 15 }}>
                {packageLabel ? String(packageLabel) : "Tutor Package"}
              </Text>
              <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>
                {teacherId ? `Tutor ID: ${teacherId}` : "Complete selection in tutor profile"}
              </Text>
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

            <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
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

            <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
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
              onPress={() => Alert.alert("Coming soon", "Package payment is being integrated.")}
            >
              <Text style={styles.submitText}>Confirm & Pay via Telebirr →</Text>
            </TouchableOpacity>
          </>
        )}
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
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  emptyTitle: { fontSize: 16, fontWeight: "700", marginTop: 8 },
  backBtn: { marginTop: 12, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
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
