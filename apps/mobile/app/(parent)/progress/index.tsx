import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const CHILDREN = [
  {
    id: "kidane",
    name: "Kidane",
    grade: "10",
    avg: 87,
    trend: "+4%",
    tutor: "Selamawit T.",
    sessions: 24,
    homework: "90%",
    attendance: "100%",
    subjects: [
      { name: "Mathematics", score: 92 },
      { name: "Physics", score: 85 },
      { name: "English", score: 84 },
    ],
  },
  {
    id: "meron",
    name: "Meron",
    grade: "8",
    avg: 92,
    trend: "+7%",
    tutor: "Bereket S.",
    sessions: 18,
    homework: "95%",
    attendance: "98%",
    subjects: [
      { name: "English", score: 94 },
      { name: "Math", score: 90 },
    ],
  },
  {
    id: "sara",
    name: "Sara",
    grade: "5",
    avg: 79,
    trend: "+2%",
    tutor: "Tigist H.",
    sessions: 12,
    homework: "88%",
    attendance: "100%",
    subjects: [
      { name: "Math", score: 82 },
      { name: "Amharic", score: 76 },
    ],
  },
];

export default function ProgressDashboardScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [active, setActive] = useState(0);
  const child = CHILDREN[active];

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const surface = isDark ? "#1E293B" : "#F8FAFC";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <Text style={[styles.headerTitle, { color: text }]}>Progress Dashboard</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {CHILDREN.map((c, i) => {
            const on = active === i;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setActive(i)}
                style={[
                  styles.childChip,
                  {
                    backgroundColor: on ? primary : surface,
                    borderColor: on ? primary : border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatarSm,
                    { backgroundColor: on ? "rgba(255,255,255,0.25)" : primary },
                  ]}
                >
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 11 }}>
                    {c.name[0]}
                  </Text>
                </View>
                <Text style={{ color: on ? "#fff" : text, fontSize: 10, fontWeight: "700" }}>
                  {c.name}
                </Text>
                <Text style={{ color: on ? "rgba(255,255,255,0.75)" : sub, fontSize: 8 }}>
                  Gr.{c.grade}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.row}>
            <View style={[styles.avatarLg, { backgroundColor: primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
                {child.name[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>{child.name}</Text>
              <Text style={{ color: sub, fontSize: 12 }}>
                Grade {child.grade} · Tutor: {child.tutor}
              </Text>
              <Text style={{ color: "#059669", fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                {child.trend} this month ↑
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: primary, fontSize: 28, fontWeight: "800" }}>
                {child.avg}%
              </Text>
              <Text style={{ color: sub, fontSize: 9 }}>Average Score</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              [String(child.sessions), "📚", "Sessions"],
              [child.homework, "📝", "Homework"],
              [child.attendance, "⏰", "Attendance"],
            ].map(([v, icon, l]) => (
              <View key={l} style={[styles.statBox, { backgroundColor: surface }]}>
                <Text style={{ fontSize: 14 }}>{icon}</Text>
                <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>{v}</Text>
                <Text style={{ color: sub, fontSize: 9 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.label, { color: sub }]}>SUBJECT PERFORMANCE</Text>
          {child.subjects.map((s) => (
            <View key={s.name} style={{ marginBottom: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: text, fontWeight: "600", fontSize: 12 }}>{s.name}</Text>
                <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>{s.score}%</Text>
              </View>
              <View style={[styles.barTrack, { backgroundColor: isDark ? "#334155" : "#E2E8F0" }]}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${s.score}%`, backgroundColor: primary },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.aiCard, { backgroundColor: primary }]}>
          <Text style={styles.aiLabel}>🤖 AI INSIGHT</Text>
          <Text style={styles.aiBody}>
            {child.name} shows steady improvement. Focus next week on weaker subjects and past-paper
            practice before exams.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: primary }]}
          onPress={() => router.push(`/(parent)/progress/${child.id}`)}
        >
          <Text style={styles.ctaText}>Open Full Report →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  childChip: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 72,
    gap: 2,
  },
  avatarSm: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 14, paddingBottom: 40, gap: 12 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarLg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  barTrack: { height: 8, borderRadius: 999, overflow: "hidden", marginTop: 4 },
  barFill: { height: "100%", borderRadius: 999 },
  aiCard: { borderRadius: 16, padding: 14 },
  aiLabel: { color: "#fff", fontSize: 10, fontWeight: "800", marginBottom: 6 },
  aiBody: { color: "rgba(255,255,255,0.92)", fontSize: 12, lineHeight: 18 },
  cta: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});