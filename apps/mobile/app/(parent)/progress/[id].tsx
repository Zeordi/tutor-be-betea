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

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Progress Report</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Progress Report</Text>
          </View>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: colors.text, marginBottom: 12 }}>{error || "No progress data available."}</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Progress Report</Text>
          <Text style={{ color: colors.sub, fontSize: 10 }}>
            {data.studentName} · Session {data.sessionNumber} ·{" "}
            {new Date(data.sessionDate).toLocaleDateString()} · #{data.contractId}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>
                {data.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "800", fontSize: 14 }}>{data.studentName}</Text>
              <Text style={{ color: colors.sub, fontSize: 11 }}>
                Grade {data.gradeLevel} · {data.subject} · {data.curriculum.replace(/_/g, " ")}
              </Text>
            </View>
            <View style={styles.onTrack}>
              <Text style={{ color: "#047857", fontSize: 10, fontWeight: "700" }}>On Track</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              [data.overallScore + "%", "Mastery"],
              [data.attendancePct + "%", "Attend."],
              [data.homeworkPct + "%", "Homework"],
              [String(data.sessionNumber), "Sessions"],
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
              <Text style={{ color: "#fff", fontSize: 9 }}>Session {data.sessionNumber}</Text>
            </View>
          </View>
          <Text style={styles.aiBody}>{data.aiInsight}</Text>
          {data.aiInsightAm ? (
            <Text style={styles.aiAm}>{data.aiInsightAm}</Text>
          ) : null}
        </View>

        {/* Subject scores */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>SUBJECT SCORES · VS LAST MONTH</Text>
          {data.subjects.map((s) => (
            <View key={s.name} style={{ marginBottom: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 12 }}>{s.name}</Text>
                <Text style={{ color: colors.sub, fontSize: 10 }}>
                  Was {s.prevScore}%{" "}
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
                HW completion: {s.homeworkPct}%
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
            {(data.strengths || []).map((s) => (
              <Text key={s} style={{ color: colors.text, fontSize: 10, marginBottom: 6 }}>
                • {s}
              </Text>
            ))}
          </View>
          <View style={[styles.halfCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={{ color: "#d97706", fontWeight: "700", fontSize: 11, marginBottom: 8 }}>
              ⚠ Focus Areas
            </Text>
            {(data.focusAreas || []).map((s) => (
              <Text key={s} style={{ color: colors.text, fontSize: 10, marginBottom: 6 }}>
                • {s}
              </Text>
            ))}
          </View>
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
