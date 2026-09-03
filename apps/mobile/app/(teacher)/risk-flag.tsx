import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";

export default function RiskFlagScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [appealStarted, setAppealStarted] = useState(false);
  const [appealText, setAppealText] = useState("");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? "#450a0a" : "#fef2f2",
            borderBottomColor: isDark ? "#7f1d1d" : "#fecaca",
          },
        ]}
      >
        <View style={styles.flagIcon}>
          <Text style={{ color: "#fff", fontWeight: "900" }}>⚑</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: isDark ? "#fca5a5" : "#b91c1c", fontWeight: "800", fontSize: 14 }}>
            Risk Flag — Account Restricted
          </Text>
          <Text style={{ color: isDark ? "#f87171" : "#ef4444", fontSize: 10 }}>
            Issued Oct 11, 2024 · Case #RF-00283
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.alertHero}>
          <Text style={styles.alertTitle}>Your account has been flagged</Text>
          <Text style={styles.alertBody}>
            A safety concern was reported by a parent following a session on October 10. While we
            investigate, some features have been temporarily restricted. Your earnings are safe and
            unaffected.
          </Text>
          <Text style={styles.alertAm}>ሒሳብዎ ለደህንነት ምርምር ተቋርጧል — ክፍያዎ ሳይነካ ይቆያል</Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderLeftWidth: 4, borderLeftColor: "#ef4444" },
          ]}
        >
          <Text style={{ color: "#ef4444", fontSize: 10, fontWeight: "700", marginBottom: 6 }}>
            FLAG REASON
          </Text>
          <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13, marginBottom: 4 }}>
            Potential Communication Policy Violation
          </Text>
          <Text style={{ color: colors.sub, fontSize: 11, lineHeight: 16 }}>
            A parent reported that off-platform contact was attempted during a session. This violates
            TBB's anti-poaching and safety policy. Our Safety Team is reviewing session transcripts
            and GPS data.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>ACTIVE RESTRICTIONS</Text>
          {[
            ["🔍", "Job Applications Suspended", "Cannot apply for new contracts during review"],
            ["📣", "Profile Hidden from Search", "Existing students still have access"],
            ["💬", "Chat Rate-Limited", "Message volume restricted to existing contracts only"],
          ].map(([icon, title, desc]) => (
            <View
              key={title}
              style={[
                styles.restriction,
                {
                  backgroundColor: isDark ? "#7f1d1d33" : "#fef2f2",
                  borderColor: isDark ? "#7f1d1d" : "#fecaca",
                },
              ]}
            >
              <Text style={{ fontSize: 16 }}>{icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: isDark ? "#fca5a5" : "#b91c1c", fontWeight: "700", fontSize: 12 }}>
                  {title}
                </Text>
                <Text style={{ color: isDark ? "#f87171" : "#ef4444", fontSize: 10 }}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>STILL AVAILABLE</Text>
          {[
            "✅ Existing session delivery",
            "✅ Progress report submission",
            "✅ Earnings dashboard & payout",
            "✅ Chat with current contracted students",
          ].map((item) => (
            <Text key={item} style={{ color: colors.text, fontSize: 12, marginBottom: 6 }}>
              {item}
            </Text>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>REVIEW TIMELINE</Text>
          {[
            { date: "Oct 11", event: "Flag raised · Account restricted", done: true, current: false },
            { date: "Oct 12", event: "Safety Team begins review (in progress)", done: false, current: true },
            { date: "Oct 14", event: "Initial ruling issued", done: false, current: false },
            { date: "Oct 16", event: "Appeal deadline if ruling is unfavorable", done: false, current: false },
          ].map((t, i) => (
            <View key={i} style={styles.timelineRow}>
              <View
                style={[
                  styles.timelineDot,
                  {
                    backgroundColor: t.done
                      ? "#10b981"
                      : t.current
                        ? "#f59e0b"
                        : isDark
                          ? "#334155"
                          : "#cbd5e1",
                  },
                ]}
              />
              <View>
                <Text
                  style={{
                    color: t.current ? "#d97706" : colors.sub,
                    fontWeight: "700",
                    fontSize: 10,
                  }}
                >
                  {t.date}
                </Text>
                <Text style={{ color: colors.text, fontSize: 12 }}>{t.event}</Text>
              </View>
            </View>
          ))}
        </View>

        {!appealStarted ? (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "#1e3a5f55" : "#eff6ff",
                borderColor: isDark ? "#1e40af" : "#bfdbfe",
              },
            ]}
          >
            <Text style={{ color: isDark ? "#93c5fd" : "#1d4ed8", fontWeight: "700", fontSize: 13 }}>
              Believe this is a mistake?
            </Text>
            <Text style={{ color: isDark ? "#60a5fa" : "#2563eb", fontSize: 11, marginVertical: 8 }}>
              You can submit an appeal with your account of events. Our team reviews all appeals within
              48 hours.
            </Text>
            <TouchableOpacity
              style={styles.blueBtn}
              onPress={() => setAppealStarted(true)}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Submit an Appeal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "#1e3a5f55" : "#eff6ff",
                borderColor: isDark ? "#1e40af" : "#bfdbfe",
              },
            ]}
          >
            <Text style={{ color: isDark ? "#93c5fd" : "#1d4ed8", fontWeight: "700", fontSize: 12 }}>
              ✍ Your Account of Events
            </Text>
            <TextInput
              multiline
              value={appealText}
              onChangeText={setAppealText}
              placeholder="Describe what happened..."
              placeholderTextColor={colors.sub}
              style={[
                styles.appealInput,
                {
                  backgroundColor: isDark ? "#0f172a" : "#fff",
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />
            <TouchableOpacity
              style={styles.blueBtn}
              onPress={() => Alert.alert("Submitted", "Appeal received. Case #RF-00283")}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>📤 Submit Appeal</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.outlineBtn, { borderColor: colors.border }]}
          onPress={() => router.push("/(shared)/support/create")}
        >
          <Text style={{ color: colors.sub, fontWeight: "700", fontSize: 12 }}>
            📞 Contact Safety Team
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  flagIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 14, paddingBottom: 40 },
  alertHero: {
    backgroundColor: "#dc2626",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  alertTitle: { color: "#fff", fontWeight: "800", fontSize: 16, marginBottom: 6 },
  alertBody: { color: "rgba(255,255,255,0.9)", fontSize: 12, lineHeight: 18 },
  alertAm: { color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 8 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  restriction: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  timelineRow: { flexDirection: "row", gap: 10, marginBottom: 12, alignItems: "flex-start" },
  timelineDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  blueBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  appealInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 12,
    marginVertical: 10,
  },
  outlineBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});