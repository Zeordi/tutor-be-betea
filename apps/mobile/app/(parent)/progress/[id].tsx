import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type SubjectScore = {
  name: string;
  score: number;
  prevScore: number;
  homeworkPct: number;
};

type ProgressDetail = {
  contractId: string;
  studentName: string;
  gradeLevel: string;
  subject: string;
  curriculum: string;
  sessionNumber: number;
  sessionDate: string;
  overallScore: number;
  attendancePct: number;
  homeworkPct: number;
  subjects: SubjectScore[];
  strengths: string[];
  focusAreas: string[];
  aiInsight: string;
  aiInsightAm: string;
};

export default function ProgressReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ProgressDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<ProgressDetail>(paths.progressGet(id))
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load progress");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: text }]}>Progress Report</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: text }]}>Progress Report</Text>
          </View>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error || "No progress data available."}</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const hasStrengths = (data.strengths || []).length > 0;
  const hasFocus = (data.focusAreas || []).length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: text }]}>Progress Report</Text>
          <Text style={{ color: sub, fontSize: 10 }}>
            {data.studentName} · Session {data.sessionNumber} ·{" "}
            {new Date(data.sessionDate).toLocaleDateString()} · #{data.contractId}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {data.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 14 }}>{data.studentName}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>
                Grade {data.gradeLevel} · {data.subject} · {data.curriculum.replace(/_/g, " ")}
              </Text>
            </View>
            <View style={[styles.onTrack, { backgroundColor: isDark ? "rgba(16,185,129,0.2)" : "#D1FAE5" }]}>
              <Text style={{ color: isDark ? "#34D399" : "#047857", fontSize: 10, fontWeight: "700" }}>On Track</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              [data.overallScore + "%", "Mastery"],
              [data.attendancePct + "%", "Attend."],
              [data.homeworkPct + "%", "Homework"],
              [String(data.sessionNumber), "Sessions"],
            ].map(([v, l]) => (
              <View key={l} style={[styles.statBox, { backgroundColor: isDark ? "#1E3A5F" : "#F8FAFC" }]}>
                <Text style={{ color: primary, fontWeight: "800", fontSize: 13 }}>{v}</Text>
                <Text style={{ color: sub, fontSize: 9 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {data.aiInsight ? (
          <View style={[styles.aiCard, { backgroundColor: primary }]}>
            <View style={styles.row}>
              <Text style={{ fontSize: 14 }}>🤖</Text>
              <Text style={[styles.aiLabel, { color: "#fff" }]}>AI-GENERATED INSIGHT</Text>
              <View style={styles.aiPill}>
                <Text style={{ color: "#fff", fontSize: 9 }}>Session {data.sessionNumber}</Text>
              </View>
            </View>
            <Text style={styles.aiBody}>{data.aiInsight}</Text>
            {data.aiInsightAm ? <Text style={styles.aiAm}>{data.aiInsightAm}</Text> : null}
          </View>
        ) : null}

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.label, { color: sub }]}>SUBJECT SCORES · VS LAST MONTH</Text>
          {data.subjects.map((s) => (
            <View key={s.name} style={{ marginBottom: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: text, fontWeight: "600", fontSize: 12 }}>{s.name}</Text>
                <Text style={{ color: sub, fontSize: 10 }}>
                  Was {s.prevScore}%{" "}
                  <Text style={{ color: "#10B981", fontWeight: "800" }}>↑ {s.score}%</Text>
                </Text>
              </View>
              <View style={[styles.barTrack, { backgroundColor: isDark ? "#334155" : "#E2E8F0" }]}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${s.score}%`, backgroundColor: primary },
                  ]}
                />
              </View>
              <Text style={{ color: sub, fontSize: 9, marginTop: 2 }}>
                HW completion: {s.homeworkPct}%
              </Text>
            </View>
          ))}
        </View>

        {(hasStrengths || hasFocus) && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            {hasStrengths && (
              <View style={[styles.halfCard, { backgroundColor: card, borderColor: border }]}>
                <Text style={{ color: "#10B981", fontWeight: "700", fontSize: 11, marginBottom: 8 }}>
                  ✅ Strengths
                </Text>
                {data.strengths.map((s) => (
                  <Text key={s} style={{ color: text, fontSize: 10, marginBottom: 6 }}>
                    • {s}
                  </Text>
                ))}
              </View>
            )}
            {hasFocus && (
              <View style={[styles.halfCard, { backgroundColor: card, borderColor: border }]}>
                <Text style={{ color: "#D97706", fontWeight: "700", fontSize: 11, marginBottom: 8 }}>
                  ⚠ Focus Areas
                </Text>
                {data.focusAreas.map((s) => (
                  <Text key={s} style={{ color: text, fontSize: 10, marginBottom: 6 }}>
                    • {s}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <TouchableOpacity style={[styles.cta, { backgroundColor: primary, flex: 1 }]}>
            <Text style={styles.ctaText}>✅ Approve Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ctaOutline, { borderColor: border, flex: 1 }]}
            onPress={() => router.back()}
          >
            <Text style={{ color: sub, fontWeight: "700", fontSize: 12 }}>💬 Ask Tutor</Text>
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
  onTrack: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: { flex: 1, borderRadius: 12, padding: 8, alignItems: "center" },
  aiCard: {
    borderRadius: 16,
    padding: 14,
  },
  aiLabel: {
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
  barTrack: { height: 8, borderRadius: 999, overflow: "hidden", marginTop: 4 },
  barFill: { height: "100%", borderRadius: 999 },
  halfCard: { flex: 1, borderRadius: 16, padding: 12, borderWidth: 1 },
  cta: { borderRadius: 14, paddingVertical: 13, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  ctaOutline: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
  },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
