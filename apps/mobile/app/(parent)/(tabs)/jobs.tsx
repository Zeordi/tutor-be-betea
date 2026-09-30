import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { apiRequest, paths } from "@/lib/api";

type Job = {
  id: string;
  title: string;
  applicationsCount: number;
  status: string;
  urgent: boolean;
  boost: boolean;
  postedAt: string;
};

type Application = {
  id: string;
  applicant: { fullName: string; rating: number; hourlyRate: number };
  status: string;
};

export default function ParentJobsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);

  const tabs = ["My Jobs", "Applications", "Hired"];

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  const loadJobs = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<Job[]>(paths.jobsMine);
      if (!cancelled) setJobs(data || []);
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load jobs");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const retry = () => {
    setError("");
    setLoading(true);
    apiRequest<Job[]>(paths.jobsMine)
      .then((data) => setJobs(data || []))
      .catch((err) => setError(err.message || "Failed to load jobs"))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: text }]}>Jobs & Applications</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={{ color: sub, fontSize: 13 }}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: text }]}>Jobs & Applications</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Text style={{ fontSize: 32 }}>⚠️</Text>
          <Text style={{ color: text, fontWeight: "700", textAlign: "center" }}>{error}</Text>
          <TouchableOpacity onPress={retry} style={[styles.retry, { backgroundColor: primary }]}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            {jobs.map((j) => (
              <TouchableOpacity
                key={j.id}
                style={[styles.card, { backgroundColor: card, borderColor: border }]}
                onPress={() => router.push(`/(parent)/job/${j.id}`)}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.badgeRow}>
                    {j.urgent && (
                      <View style={[styles.chip, { backgroundColor: isDark ? "rgba(220,38,38,0.2)" : "#FEE2E2" }]}>
                        <Text style={[styles.chipText, { color: isDark ? "#FCA5A5" : "#DC2626" }]}>🔥 Urgent</Text>
                      </View>
                    )}
                    {j.boost && (
                      <View style={[styles.chip, { backgroundColor: isDark ? "rgba(245,158,11,0.2)" : "#FEF3C7" }]}>
                        <Text style={[styles.chipText, { color: isDark ? "#FCD34D" : "#D97706" }]}>🚀 Boosted</Text>
                      </View>
                    )}
                    <View style={[styles.chip, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : "#CCFBF1" }]}>
                      <Text style={[styles.chipText, { color: isDark ? primary : "#0F766E" }]}>{j.status}</Text>
                    </View>
                  </View>
                  <Text style={{ color: sub, fontSize: 10 }}>{j.postedAt}</Text>
                </View>
                <Text style={[styles.jobTitle, { color: text }]}>{j.title}</Text>
                <Text style={{ color: primary, fontSize: 11, marginTop: 4 }}>👥 {j.applicationsCount} applicants</Text>
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : "#F0FDFA" }]}
                    onPress={() => router.push(`/(parent)/job/${j.id}`)}
                  >
                    <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>View Applicants</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.outlineBtn, { borderColor: border }]}>
                    <Text style={{ color: sub, fontWeight: "700", fontSize: 11 }}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            {jobs.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={{ fontSize: 32 }}>💼</Text>
                <Text style={[styles.emptyTitle, { color: text }]}>No jobs yet</Text>
                <Text style={{ color: sub, fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  Post your first job to start receiving applications.
                </Text>
              </View>
            )}
          </>
        )}

        {tab === 1 && (
          <>
            {apps.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={{ fontSize: 32 }}>📨</Text>
                <Text style={[styles.emptyTitle, { color: text }]}>No applications yet</Text>
                <Text style={{ color: sub, fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  Applications will appear here once tutors apply to your jobs.
                </Text>
              </View>
            )}
            {apps.map((a) => (
              <View key={a.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.jobTitle, { color: text }]}>{a.applicant.fullName}</Text>
                  <Text style={{ color: primary, fontSize: 11, fontWeight: "700" }}>{a.status}</Text>
                </View>
                <Text style={{ color: sub, fontSize: 11 }}>⭐ {a.applicant.rating} · {a.applicant.hourlyRate} ETB/hr</Text>
              </View>
            ))}
          </>
        )}

        {tab === 2 && (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 32 }}>🤝</Text>
            <Text style={[styles.emptyTitle, { color: text }]}>No hired tutors yet</Text>
            <Text style={{ color: sub, fontSize: 12, textAlign: "center", marginTop: 4 }}>
              When you hire a tutor, they will appear here.
            </Text>
          </View>
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
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  chipText: { fontSize: 10, fontWeight: "700" },
  jobTitle: { fontSize: 13, fontWeight: "800", marginTop: 6 },
  btnRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  primaryBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  outlineBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", borderWidth: 1 },
  emptyBox: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  retry: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
