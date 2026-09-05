import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TeacherJobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [applied, setApplied] = useState(false);
  const [cover, setCover] = useState(
    "Hello! I'm an MSc Mathematics graduate with 7 years of tutoring experience. Fayda ID verified and degree certified."
  );

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const surface = isDark ? "#1E293B" : "#F8FAFC";

  const onApply = () => {
    setApplied(true);
    Alert.alert("Application submitted", "2 Connects used · 22 remaining");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Job Detail</Text>
        <View style={styles.urgent}>
          <Text style={styles.urgentText}>🔥 Urgent</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={{ color: text, fontSize: 17, fontWeight: "900" }}>
            Grade 12 Physics Tutor Needed
          </Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
            📍 Bole, Addis Ababa · 1.5 km · Posted 2h ago · #{id}
          </Text>
          <View style={styles.chipRow}>
            {["Physics", "Grade 12", "Matric Prep", "Home Visit", "Online OK"].map((t) => (
              <View key={t} style={[styles.chip, { backgroundColor: surface }]}>
                <Text style={{ color: sub, fontSize: 10 }}>{t}</Text>
              </View>
            ))}
          </View>
          <View style={styles.grid}>
            {[
              ["500 ETB/hr", "💰", "Rate"],
              ["2–3x/week", "📅", "Frequency"],
              ["3 months", "⏱️", "Duration"],
              ["12", "👥", "Applicants"],
            ].map(([v, icon, l]) => (
              <View key={l} style={[styles.gridItem, { backgroundColor: surface }]}>
                <Text style={{ fontSize: 14 }}>{icon}</Text>
                <View>
                  <Text style={{ color: text, fontWeight: "800", fontSize: 11 }}>{v}</Text>
                  <Text style={{ color: sub, fontSize: 8 }}>{l}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={{ color: text, fontSize: 12, lineHeight: 18, marginTop: 10 }}>
            Looking for an experienced Physics tutor for Grade 12 National Exam prep. Must be
            patient, punctual, and Fayda ID verified. Home visits in Bole preferred; online OK.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "#FFFBEB",
              borderColor: isDark ? "#78350F" : "#FDE68A",
            },
          ]}
        >
          <Text style={{ color: "#D97706", fontWeight: "800", fontSize: 13 }}>
            🔗 Apply with Connects
          </Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
            Costs 2 Connects · You have 24
          </Text>
        </View>

        {!applied ? (
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <Text style={[styles.label, { color: sub }]}>YOUR APPLICATION</Text>
            <TextInput
              value={cover}
              onChangeText={setCover}
              multiline
              style={{
                color: text,
                minHeight: 110,
                textAlignVertical: "top",
                fontSize: 13,
                lineHeight: 20,
              }}
            />
          </View>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "#ECFDF5",
                borderColor: "#6EE7B7",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ fontSize: 28 }}>✓</Text>
            <Text style={{ color: "#059669", fontWeight: "800", marginTop: 6 }}>
              Application Submitted!
            </Text>
            <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
              2 Connects used · 22 remaining
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.secondaryBtn, { borderColor: primary }]}
          onPress={() => router.push(`/(teacher)/apply/${id}`)}
        >
          <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>
            Open full apply flow →
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {!applied && (
        <View style={[styles.footer, { borderTopColor: border, backgroundColor: card }]}>
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: primary }]}
            onPress={onApply}
          >
            <Text style={styles.applyText}>Apply Now — Use 2 Connects</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "800" },
  urgent: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  urgentText: { color: "#DC2626", fontSize: 10, fontWeight: "700" },
  content: { padding: 16, gap: 12, paddingBottom: 100 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  gridItem: {
    width: "47%",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  applyBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});