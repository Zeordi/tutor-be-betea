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

const SUBJECTS = ["Mathematics", "Physics", "Statistics"];
const CERTS = [
  "BSc Applied Mathematics · Addis Ababa Univ.",
  "CELTA English Teaching Certificate",
];
const RATES = [
  { label: "Home Visit / hr", value: "450" },
  { label: "Online / hr", value: "350" },
  { label: "Group Session / hr", value: "250" },
];
const STYLES = ["Interactive", "Structured", "Visual", "Patient", "Exam-Focused", "Bilingual EN/አማ"];

export default function ProfileEditScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [activeStyles, setActiveStyles] = useState(["Interactive", "Structured", "Visual", "Patient"]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
          <Text style={{ color: colors.sub, fontSize: 10 }}>Showcase your expertise</Text>
        </View>
        <TouchableOpacity>
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>PROFILE PHOTO & INTRO VIDEO</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={[styles.avatarXl, { backgroundColor: colors.primary }]}>
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>HB</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "800", fontSize: 14 }}>Hana Bekele</Text>
              <Text style={{ color: colors.sub, fontSize: 11, marginBottom: 6 }}>
                Mathematics · Physics · 3+ years
              </Text>
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                <Badge text="🛡️ ID Verified" />
                <Badge text="🎓 Degree Verified" />
              </View>
              <TouchableOpacity
                style={[styles.dashed, { borderColor: colors.border, marginTop: 10 }]}
              >
                <Text style={{ color: colors.sub, fontSize: 11, fontWeight: "600" }}>
                  🎬 Add Video Introduction (max 90 sec)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>BIO & TAGLINE</Text>
          <Field label="Professional Tagline" value="Expert Math tutor · 4.9★ · Bole & CMC home visits" colors={colors} isDark={isDark} />
          <Field
            label="Bio (EN)"
            value="I hold a BSc in Applied Mathematics from Addis Ababa University and have 3+ years of home and online tutoring experience."
            colors={colors}
            isDark={isDark}
            multiline
          />
          <Field
            label="Bio (አማርኛ)"
            value="ሂሳብን ቀላልና አስደሳች ለማድረግ ከ3 ዓመት በላይ ተሞክሮ አለኝ።"
            colors={colors}
            isDark={isDark}
            multiline
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.sub }]}>SUBJECTS TAUGHT</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {SUBJECTS.map((s) => (
              <View
                key={s}
                style={[
                  styles.tag,
                  {
                    backgroundColor: isDark ? "#134e4a44" : "#f0fdfa",
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "600" }}>{s} ×</Text>
              </View>
            ))}
          </View>
          <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginBottom: 6 }}>
            Grade Levels
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["9", "10", "11", "12"].map((g) => (
              <View
                key={g}
                style={[
                  styles.gradeBtn,
                  {
                    borderColor: g !== "9" ? colors.primary : colors.border,
                    backgroundColor:
                      g !== "9" ? (isDark ? "#134e4a44" : "#f0fdfa") : "transparent",
                  },
                ]}
              >
                <Text
                  style={{
                    color: g !== "9" ? colors.primary : colors.sub,
                    fontWeight: "700",
                    fontSize: 11,
                  }}
                >
                  Gr {g}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.sub }]}>CERTIFICATIONS</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {CERTS.map((c) => (
            <View
              key={c}
              style={[styles.certRow, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}
            >
              <Text style={{ fontSize: 14 }}>🎓</Text>
              <Text style={{ color: colors.text, fontSize: 11, fontWeight: "600", flex: 1 }}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>RATES (ETB)</Text>
          {RATES.map((r) => (
            <View key={r.label} style={styles.rateRow}>
              <Text style={{ color: colors.text, fontSize: 12, fontWeight: "600", flex: 1 }}>
                {r.label}
              </Text>
              <View
                style={[
                  styles.rateBox,
                  {
                    backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.sub, fontSize: 10 }}>ETB </Text>
                <Text style={{ color: colors.text, fontWeight: "800", fontSize: 13 }}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>TEACHING STYLE TAGS</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {STYLES.map((t) => {
              const on = activeStyles.includes(t);
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() =>
                    setActiveStyles((prev) =>
                      on ? prev.filter((x) => x !== t) : [...prev, t]
                    )
                  }
                  style={[
                    styles.tag,
                    {
                      borderColor: on ? "#3b82f6" : colors.border,
                      backgroundColor: on
                        ? isDark
                          ? "#1e3a5f55"
                          : "#eff6ff"
                        : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: on ? "#3b82f6" : colors.sub,
                      fontSize: 11,
                      fontWeight: "600",
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert("Published", "Profile saved & published")}
        >
          <Text style={styles.ctaText}>Save & Publish Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  colors,
  isDark,
  multiline,
}: {
  label: string;
  value: string;
  colors: any;
  isDark: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginBottom: 4 }}>
        {label}
      </Text>
      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: isDark ? "#1e293b" : "#f8fafc",
          paddingHorizontal: 12,
          paddingVertical: multiline ? 12 : 10,
          minHeight: multiline ? 70 : undefined,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 12, lineHeight: multiline ? 18 : undefined }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <View
      style={{
        backgroundColor: "#ccfbf1",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
      }}
    >
      <Text style={{ color: "#0f766e", fontSize: 10, fontWeight: "700" }}>{text}</Text>
    </View>
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
  content: { padding: 14, paddingBottom: 40, gap: 12 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatarXl: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dashed: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  gradeBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  certRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  rateRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  rateBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 100,
  },
  cta: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});