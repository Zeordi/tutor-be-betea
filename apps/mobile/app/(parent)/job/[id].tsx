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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const APPLICANTS = [
  {
    id: "1",
    name: "Selamawit Tadesse",
    rate: 500,
    rating: 4.9,
    status: "New",
    nationalId: true,
    degree: true,
    gold: true,
    exp: "7 yrs · Math & Physics",
  },
  {
    id: "2",
    name: "Bereket Solomon",
    rate: 480,
    rating: 4.8,
    status: "Reviewed",
    nationalId: true,
    degree: true,
    gold: false,
    exp: "5 yrs · Physics & Chemistry",
  },
  {
    id: "3",
    name: "Dawit Bekele",
    rate: 420,
    rating: 4.6,
    status: "Shortlisted",
    nationalId: true,
    degree: false,
    gold: false,
    exp: "4 yrs · Physics",
  },
];

export default function ParentJobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [tab, setTab] = useState<"details" | "applicants">("applicants");

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const surface = isDark ? "#1E293B" : "#F8FAFC";

  const statusColor = (s: string) => {
    if (s === "New") return { bg: "#CCFBF1", fg: "#0F766E" };
    if (s === "Shortlisted") return { bg: "#D1FAE5", fg: "#047857" };
    return { bg: isDark ? "#334155" : "#F1F5F9", fg: sub };
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: text }]}>Job Details</Text>
          <Text style={{ color: sub, fontSize: 10 }}>#{id ?? "job"}</Text>
        </View>
        <View style={styles.badgeRow}>
          <View style={styles.urgent}>
            <Text style={styles.urgentText}>🔥 Urgent</Text>
          </View>
          <View style={styles.boost}>
            <Text style={styles.boostText}>🚀 Boosted</Text>
          </View>
        </View>
      </View>

      <View style={[styles.tabs, { backgroundColor: card, borderBottomColor: border }]}>
        {(["details", "applicants"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tab,
              tab === t && { borderBottomColor: primary, borderBottomWidth: 2 },
            ]}
          >
            <Text
              style={{
                color: tab === t ? primary : sub,
                fontWeight: "700",
                fontSize: 12,
                textTransform: "capitalize",
              }}
            >
              {t === "applicants" ? `Applicants (${APPLICANTS.length})` : "Details"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === "details" && (
          <>
            <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>
                Grade 12 Physics Tutor Needed
              </Text>
              <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
                📍 Bole, Addis Ababa · Posted 2h ago
              </Text>
              <View style={styles.chipRow}>
                {["Physics", "Grade 12", "Home Visit", "Online OK"].map((t) => (
                  <View key={t} style={[styles.chip, { backgroundColor: surface }]}>
                    <Text style={{ color: sub, fontSize: 10 }}>{t}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.grid}>
                {[
                  ["500 ETB/hr", "💰", "Budget"],
                  ["2–3x/week", "📅", "Frequency"],
                  ["3 months", "⏱️", "Duration"],
                  [String(APPLICANTS.length), "👥", "Applicants"],
                ].map(([v, icon, l]) => (
                  <View key={l} style={[styles.gridItem, { backgroundColor: surface }]}>
                    <Text style={{ fontSize: 14 }}>{icon}</Text>
                    <Text style={{ color: text, fontWeight: "800", fontSize: 11 }}>{v}</Text>
                    <Text style={{ color: sub, fontSize: 9 }}>{l}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ color: text, fontSize: 12, lineHeight: 18, marginTop: 8 }}>
                Looking for an experienced Physics tutor for Grade 12 national exam prep. Fayda ID
                verified preferred. Home visits in Bole or online.
              </Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.btnOutline, { borderColor: border, flex: 1 }]}
                onPress={() => Alert.alert("Edit", "Edit job form opens here")}
              >
                <Text style={{ color: sub, fontWeight: "700", fontSize: 12 }}>Edit Job</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPrimary, { backgroundColor: primary, flex: 1 }]}
                onPress={() => setTab("applicants")}
              >
                <Text style={styles.btnPrimaryText}>View Applicants</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {tab === "applicants" &&
          APPLICANTS.map((a) => {
            const sc = statusColor(a.status);
            return (
              <View
                key={a.id}
                style={[styles.card, { backgroundColor: card, borderColor: border }]}
              >
                <View style={styles.row}>
                  <View style={[styles.avatar, { backgroundColor: primary }]}>
                    <Text style={{ color: "#fff", fontWeight: "800" }}>{a.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowBetween}>
                      <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>
                        {a.name}
                      </Text>
                      <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
                        <Text style={{ color: sc.fg, fontSize: 9, fontWeight: "700" }}>
                          {a.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: sub, fontSize: 10, marginTop: 2 }}>{a.exp}</Text>
                    <Text style={{ color: sub, fontSize: 10, marginTop: 2 }}>
                      ⭐ {a.rating} · {a.rate} ETB/hr
                    </Text>
                    <View style={styles.badgeRow}>
                      {a.nationalId && (
                        <Text style={styles.trust}>🛡️ ID</Text>
                      )}
                      {a.degree && <Text style={styles.trust}>🎓 Degree</Text>}
                      {a.gold && <Text style={styles.trust}>🥇 Gold</Text>}
                    </View>
                  </View>
                </View>
                <View style={[styles.row, { marginTop: 10 }]}>
                  <TouchableOpacity
                    style={[styles.btnPrimary, { backgroundColor: primary, flex: 1 }]}
                    onPress={() =>
                      Alert.alert("Hire", `Start contract flow with ${a.name}`)
                    }
                  >
                    <Text style={styles.btnPrimaryText}>Hire</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnOutline, { borderColor: primary, flex: 1 }]}
                    onPress={() => router.push(`/(parent)/tutor/${a.id}`)}
                  >
                    <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>
                      Profile
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnOutline, { borderColor: border, width: 44 }]}
                    onPress={() => router.push(`/(shared)/chat/${a.id}`)}
                  >
                    <Text style={{ fontSize: 14 }}>💬</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
  headerTitle: { fontSize: 15, fontWeight: "800" },
  badgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  urgent: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  urgentText: { color: "#DC2626", fontSize: 9, fontWeight: "700" },
  boost: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  boostText: { color: "#D97706", fontSize: 9, fontWeight: "700" },
  tabs: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: "center", paddingVertical: 12 },
  content: { padding: 14, paddingBottom: 40, gap: 12 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  trust: { fontSize: 10, marginRight: 6, marginTop: 4 },
  btnPrimary: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  btnOutline: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
  },
});