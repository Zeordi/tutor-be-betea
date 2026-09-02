import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const JOBS = [
  { title: "Grade 12 Physics Tutor", apps: 12, status: "Active", urgent: true, boost: true, posted: "2h ago" },
  { title: "Mathematics Grade 9 – Meron", apps: 5, status: "Active", urgent: false, boost: false, posted: "1d ago" },
  { title: "English Language Tutor", apps: 18, status: "Closed", urgent: false, boost: false, posted: "1w ago" },
];

const APPS = [
  { name: "Selamawit Tadesse", job: "Grade 12 Physics", rate: 500, rating: 4.9, status: "New" },
  { name: "Bereket Solomon", job: "Grade 12 Physics", rate: 480, rating: 4.8, status: "Reviewed" },
  { name: "Dawit Bekele", job: "Grade 12 Physics", rate: 420, rating: 4.6, status: "Shortlisted" },
];

export default function ParentJobsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const tabs = ["My Jobs", "Applications", "Hired"];

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Text style={[styles.title, { color: text }]}>Jobs & Applications</Text>
        <View style={styles.tabs}>
          {tabs.map((t, i) => (
            <TouchableOpacity key={t} onPress={() => setTab(i)} style={styles.tabBtn}>
              <Text style={{ color: tab === i ? primary : sub, fontWeight: "700", fontSize: 12 }}>{t}</Text>
              {tab === i && <View style={[styles.tabLine, { backgroundColor: primary }]} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
        {tab === 0 && (
          <>
            <TouchableOpacity
              style={[styles.dashedBtn, { borderColor: primary }]}
              onPress={() => router.push("/(parent)/job/create")}
            >
              <Text style={{ color: primary, fontWeight: "800" }}>+ Post a New Job</Text>
            </TouchableOpacity>
            {JOBS.map((j) => (
              <View key={j.title} style={[styles.card, { backgroundColor: card }]}>
                <View style={styles.rowBetween}>
                  <View style={styles.badgeRow}>
                    {j.urgent && <Text style={styles.urgent}>🔥 Urgent</Text>}
                    {j.boost && <Text style={styles.boost}>🚀 Boosted</Text>}
                    <Text style={[styles.status, { color: j.status === "Active" ? primary : sub }]}>{j.status}</Text>
                  </View>
                  <Text style={{ color: sub, fontSize: 10 }}>{j.posted}</Text>
                </View>
                <Text style={[styles.jobTitle, { color: text }]}>{j.title}</Text>
                <Text style={{ color: primary, fontSize: 11, marginTop: 4 }}>👥 {j.apps} applicants</Text>
                <View style={styles.btnRow}>
                  <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : "#F0FDFA" }]}>
                    <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>View Applicants</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.outlineBtn, { borderColor: border }]}>
                    <Text style={{ color: sub, fontWeight: "700", fontSize: 11 }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {tab === 1 && APPS.map((a) => (
          <View key={a.name} style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.jobTitle, { color: text }]}>{a.name}</Text>
              <Text style={{ color: primary, fontSize: 11, fontWeight: "700" }}>{a.status}</Text>
            </View>
            <Text style={{ color: sub, fontSize: 11 }}>Applied to: {a.job}</Text>
            <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>⭐ {a.rating} · {a.rate} ETB/hr</Text>
          </View>
        ))}

        {tab === 2 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>No hired tutors yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
  tabs: { flexDirection: "row" },
  tabBtn: { flex: 1, alignItems: "center", paddingBottom: 10 },
  tabLine: { height: 2, width: 28, borderRadius: 2, marginTop: 6 },
  dashedBtn: {
    borderWidth: 2, borderStyle: "dashed", borderRadius: 16,
    paddingVertical: 14, alignItems: "center",
  },
  card: { borderRadius: 16, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  urgent: { fontSize: 10, backgroundColor: "#FEE2E2", color: "#DC2626", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99, overflow: "hidden", fontWeight: "700" },
  boost: { fontSize: 10, backgroundColor: "#FEF3C7", color: "#D97706", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99, overflow: "hidden", fontWeight: "700" },
  status: { fontSize: 10, fontWeight: "700" },
  jobTitle: { fontSize: 13, fontWeight: "800", marginTop: 6 },
  btnRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  primaryBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  outlineBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", borderWidth: 1 },
});