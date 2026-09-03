import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../../hooks/useTheme";

const ISSUE_TYPES = [
  { id: "no-show", icon: "🚫", label: "Tutor No-Show", desc: "Tutor didn’t arrive for session" },
  { id: "late", icon: "⏰", label: "Consistently Late", desc: "Arrived 30+ min late multiple times" },
  { id: "quality", icon: "📉", label: "Poor Quality", desc: "Teaching not matching promises" },
  { id: "escrow", icon: "💰", label: "Payment Dispute", desc: "Milestone issue or unauthorized charge" },
  { id: "behavior", icon: "⚠️", label: "Inappropriate Behavior", desc: "Conduct or safety concern" },
  { id: "other", icon: "🔧", label: "Other Issue", desc: "Something not listed above" },
];

export default function ReportProblemScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState<string | null>(null);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Report a Problem</Text>
          <View style={styles.stepsRow}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.stepBar,
                  {
                    backgroundColor: s <= step ? colors.primary : isDark ? "#334155" : "#e2e8f0",
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={{ color: colors.sub, fontSize: 11 }}>Step {step}/3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>What’s the issue?</Text>
            <Text style={{ color: colors.sub, fontSize: 12, marginBottom: 12, marginTop: 4 }}>
              Select the category that best describes your problem.
            </Text>
            {ISSUE_TYPES.map((t) => {
              const selected = issueType === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setIssueType(t.id)}
                  style={[
                    styles.issueCard,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected
                        ? isDark
                          ? "#134e4a44"
                          : "#f0fdfa"
                        : colors.card,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>{t.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13 }}>{t.label}</Text>
                    <Text style={{ color: colors.sub, fontSize: 11 }}>{t.desc}</Text>
                  </View>
                  {selected && (
                    <View style={[styles.check, { backgroundColor: colors.primary }]}>
                      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              disabled={!issueType}
              onPress={() => setStep(2)}
              style={[
                styles.cta,
                {
                  backgroundColor: issueType ? colors.primary : isDark ? "#334155" : "#cbd5e1",
                },
              ]}
            >
              <Text style={styles.ctaText}>Continue →</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>Details & Evidence</Text>
            <Text style={{ color: colors.sub, fontSize: 12, marginBottom: 12, marginTop: 4 }}>
              The more detail you provide, the faster we can resolve this.
            </Text>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginBottom: 6 }}>
                Contract / Tutor
              </Text>
              <View style={[styles.tutorBox, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>H</Text>
                </View>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 12 }}>
                  Hana Bekele · Mathematics
                </Text>
              </View>

              <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginTop: 12, marginBottom: 6 }}>
                Date of Incident *
              </Text>
              <View
                style={[
                  styles.inputBox,
                  { backgroundColor: isDark ? "#1e293b" : "#f8fafc", borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.text, fontSize: 12 }}>Oct 12, 2024</Text>
                <Text>📅</Text>
              </View>

              <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginTop: 12, marginBottom: 6 }}>
                Description *
              </Text>
              <View
                style={[
                  styles.descBox,
                  { backgroundColor: isDark ? "#1e293b" : "#f8fafc", borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.text, fontSize: 11, lineHeight: 16 }}>
                  Tutor arrived 45 minutes late without advance notice. This has now happened 3 times
                  in the past month. Sessions feel rushed and progress was impacted.
                </Text>
              </View>

              <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginTop: 12, marginBottom: 8 }}>
                Upload Evidence (optional)
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["📷 Camera", "🖼 Gallery", "📄 File"].map((label) => (
                  <TouchableOpacity
                    key={label}
                    style={[
                      styles.uploadBtn,
                      { borderColor: colors.border },
                    ]}
                  >
                    <Text style={{ color: colors.sub, fontSize: 11, fontWeight: "600" }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.cta, { backgroundColor: colors.primary }]}
              onPress={() => setStep(3)}
            >
              <Text style={styles.ctaText}>Submit Report →</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <View style={{ alignItems: "center", paddingTop: 24 }}>
            <View style={styles.successIcon}>
              <Text style={{ fontSize: 36 }}>✅</Text>
            </View>
            <Text style={{ color: colors.text, fontWeight: "800", fontSize: 18, marginTop: 12 }}>
              Report Submitted
            </Text>
            <Text
              style={{
                color: colors.sub,
                fontSize: 12,
                textAlign: "center",
                marginTop: 6,
                lineHeight: 18,
                maxWidth: 280,
              }}
            >
              Our Safety Team will review your case within 24 hours. You’ll receive updates via
              notification.
            </Text>
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "600", marginTop: 6 }}>
              ጉዳዩ ለደህንነት ቡድናችን ደርሷል
            </Text>

            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border, width: "100%", marginTop: 16 },
              ]}
            >
              <Text style={[styles.label, { color: colors.sub }]}>CASE SUMMARY</Text>
              {[
                ["Ticket", "#TBB-28471"],
                ["Issue Type", "Consistently Late"],
                ["Tutor", "Hana Bekele"],
                ["Submitted", "Oct 12, 2024, 3:47 PM"],
                ["Expected Response", "< 24 hours"],
              ].map(([k, v]) => (
                <View key={k} style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                  <Text style={{ color: colors.sub, fontSize: 11 }}>{k}</Text>
                  <Text style={{ color: colors.text, fontWeight: "700", fontSize: 11 }}>{v}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8, width: "100%", marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.outlineBtn, { borderColor: colors.border, flex: 1 }]}
                onPress={() => router.replace("/(parent)/(tabs)")}
              >
                <Text style={{ color: colors.sub, fontWeight: "700", fontSize: 12 }}>Back to Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary, flex: 1 }]}>
                <Text style={styles.ctaText}>Track Case</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  stepsRow: { flexDirection: "row", gap: 4, marginTop: 6 },
  stepBar: { flex: 1, height: 3, borderRadius: 2 },
  content: { padding: 14, paddingBottom: 40 },
  issueCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 8,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  tutorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descBox: { borderRadius: 12, borderWidth: 1, padding: 12, minHeight: 80 },
  uploadBtn: {
    flex: 1,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cta: { borderRadius: 16, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#d1fae5",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  outlineBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
});