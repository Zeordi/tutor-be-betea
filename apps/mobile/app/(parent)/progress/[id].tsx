import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../hooks/useTheme";

const SUBJECTS = [
  { name: "Algebra", score: 88, prev: 79, hw: 90 },
  { name: "Geometry", score: 82, prev: 75, hw: 85 },
  { name: "Statistics", score: 91, prev: 84, hw: 95 },
  { name: "Functions", score: 76, prev: 70, hw: 80 },
];

export default function ProgressReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Progress Report</Text>
          <Text style={{ color: colors.sub, fontSize: 10 }}>
            Liya Tadesse · Session 18 · Oct 12 · #{id}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>LT</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "800", fontSize: 14 }}>Liya Tadesse</Text>
              <Text style={{ color: colors.sub, fontSize: 11 }}>Grade 10 · Mathematics · National</Text>
            </View>
            <View style={styles.onTrack}>
              <Text style={{ color: "#047857", fontSize: 10, fontWeight: "700" }}>On Track</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              ["87%", "Mastery"],
              ["92%", "Attend."],
              ["4.8★", "Rating"],
              ["18", "Sessions"],
            ].map(([v, l]) => (
              <View
                key={l}
                style={[styles.statBox, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}
              >
                <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>{v}</Text>
                <Text style={{ color: colors.sub, fontSize: 9 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Summary */}
        <View style={styles.aiCard}>
          <View style={styles.row}>
            <Text style={{ fontSize: 14 }}>🤖</Text>
            <Text style={styles.aiLabel}>AI-GENERATED INSIGHT</Text>
            <View style={styles.aiPill}>
              <Text style={{ color: "#fff", fontSize: 9 }}>Session 18</Text>
            </View>
          </View>
          <Text style={styles.aiBody}>
            Liya demonstrates strong upward momentum in algebra and statistics. Geometry requires 2–3
            targeted sessions before the national exam. Homework completion rate of 90% is excellent —
            reinforce this habit. Recommend introducing past-paper practice next week.
          </Text>
          <Text style={styles.aiAm}>ሊያ ቁጥርን ከ 79% ወደ 88% አሻሽላለች።</Text>
        </View>

        {/* Session summary */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>THIS SESSION</Text>
          <View style={[styles.sessionRow, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}>
            <Text style={{ fontSize: 18 }}>📅</Text>
            <View>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 12 }}>
                Oct 12 · 4:00–5:30 PM · Sarbet
              </Text>
              <Text style={{ color: colors.sub, fontSize: 10 }}>
                Tutor: Hana Bekele · 90 min · Home Visit
              </Text>
            </View>
          </View>
          {[
            ["Topics Covered", "Quadratic equations, factorisation, completing the square"],
            ["Student Engagement", "High — asked 7 self-directed questions"],
            ["Homework Assigned", "Ex. 12.3 (Q1–Q12) + 2 past-paper questions"],
          ].map(([t, v]) => (
            <View key={t} style={[styles.detailBlock, { borderBottomColor: colors.border }]}>
              <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600" }}>{t}</Text>
              <Text style={{ color: colors.text, fontSize: 11, marginTop: 2, lineHeight: 16 }}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Subject scores */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>SUBJECT SCORES · VS LAST MONTH</Text>
          {SUBJECTS.map((s) => (
            <View key={s.name} style={{ marginBottom: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 12 }}>{s.name}</Text>
                <Text style={{ color: colors.sub, fontSize: 10 }}>
                  Was {s.prev}%{" "}
                  <Text style={{ color: "#10b981", fontWeight: "800" }}>↑ {s.score}%</Text>
                </Text>
              </View>
              <View style={[styles.barTrack, { backgroundColor: isDark ? "#334155" : "#e2e8f0" }]}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${s.score}%`, backgroundColor: colors.primary },
                  ]}
                />
              </View>
              <Text style={{ color: colors.sub, fontSize: 9, marginTop: 2 }}>
                HW completion: {s.hw}%
              </Text>
            </View>
          ))}
        </View>

        {/* Strengths / Focus */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={[styles.halfCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: "#10b981", fontWeight: "700", fontSize: 11, marginBottom: 8 }}>
              ✅ Strengths
            </Text>
            {["Algebraic manipulation", "Self-correction habit", "Consistent homework"].map((s) => (
              <Text key={s} style={{ color: colors.text, fontSize: 10, marginBottom: 6 }}>
                • {s}
              </Text>
            ))}
          </View>
          <View style={[styles.halfCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: "#d97706", fontWeight: "700", fontSize: 11, marginBottom: 8 }}>
              ⚠ Focus Areas
            </Text>
            {["Geometric proofs", "Word problem setup", "Unit conversion"].map((s) => (
              <Text key={s} style={{ color: colors.text, fontSize: 10, marginBottom: 6 }}>
                • {s}
              </Text>
            ))}
          </View>
        </View>

        {/* Next plan */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>📋 NEXT SESSION PLAN (AI)</Text>
          {[
            "📐 Geometric proofs — 30 min focused drill",
            "📝 Past paper: 2023 Grade 10 National Exam (Section B)",
            "💡 Introduction to circle theorems — new topic",
          ].map((item) => (
            <View
              key={item}
              style={[styles.planRow, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}
            >
              <Text style={{ color: colors.text, fontSize: 11, lineHeight: 16 }}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary, flex: 1 }]}>
            <Text style={styles.ctaText}>✅ Approve Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaOutline, { borderColor: colors.border, flex: 1 }]}
            onPress={() => router.push("/(shared)/chat/1")}
          >
            <Text style={{ color: colors.sub, fontWeight: "700", fontSize: 12 }}>💬 Ask Tutor</Text>
          </TouchableOpacity>
        </View>
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
  content: { padding: 14, paddingBottom: 40, gap: 12 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  onTrack: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: { flex: 1, borderRadius: 12, padding: 8, alignItems: "center" },
  aiCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#0f766e",
  },
  aiLabel: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    flex: 1,
    marginLeft: 6,
  },
  aiPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  aiBody: { color: "rgba(255,255,255,0.92)", fontSize: 12, lineHeight: 18, marginTop: 8 },
  aiAm: { color: "rgba(255,255,255,0.65)", fontSize: 10, marginTop: 6 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  sessionRow: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  detailBlock: { paddingVertical: 8, borderBottomWidth: 1 },
  barTrack: { height: 8, borderRadius: 999, overflow: "hidden", marginTop: 4 },
  barFill: { height: "100%", borderRadius: 999 },
  halfCard: { flex: 1, borderRadius: 16, padding: 12, borderWidth: 1 },
  planRow: { borderRadius: 12, padding: 10, marginBottom: 6 },
  cta: { borderRadius: 14, paddingVertical: 13, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  ctaOutline: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
  },
});