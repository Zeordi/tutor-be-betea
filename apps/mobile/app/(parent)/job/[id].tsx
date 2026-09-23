import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type Job = {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  status: string;
  urgent: boolean;
  boost: boolean;
  postedAt: string;
  applicationsCount: number;
};

type Applicant = {
  id: string;
  fullName: string;
  rating: number;
  hourlyRate: number;
  status: string;
};

export default function ParentJobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [tab, setTab] = useState<"details" | "applicants">("applicants");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsUnavailable, setApplicantsUnavailable] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setApplicantsUnavailable(false);

    apiRequest<Job>(paths.job(id))
      .then((jobData) => {
        if (!cancelled) setJob(jobData);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load job");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    apiRequest<Applicant[]>(`/jobs/${id}/applications`)
      .then((appsData) => {
        if (!cancelled) setApplicants(Array.isArray(appsData) ? appsData : []);
      })
      .catch((_err: any) => {
        if (!cancelled) {
          setApplicants([]);
          setApplicantsUnavailable(true);
        }
      });

    return () => { cancelled = true; };
  }, [id]);

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

  if (loading) {
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
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={{ color: sub, fontSize: 13 }}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: text }]}>Job Details</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Text style={{ fontSize: 32 }}>⚠️</Text>
          <Text style={{ color: text, fontWeight: "700", textAlign: "center" }}>{error || "Job not found"}</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.retry, { backgroundColor: primary }]}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: text }]}>Job Details</Text>
          <Text style={{ color: sub, fontSize: 10 }}>#{job.id}</Text>
        </View>
        <View style={styles.badgeRow}>
          {job.urgent && <View style={styles.urgent}><Text style={styles.urgentText}>🔥 Urgent</Text></View>}
          {job.boost && <View style={styles.boost}><Text style={styles.boostText}>🚀 Boosted</Text></View>}
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
              {t === "applicants"
                ? applicantsUnavailable
                  ? "Applicants unavailable"
                  : `Applicants (${applicants.length})`
                : "Details"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === "details" && (
          <>
            <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>{job.title}</Text>
              <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
                📍 {job.location} · Posted {job.postedAt}
              </Text>
              <Text style={{ color: text, fontSize: 12, lineHeight: 18, marginTop: 8 }}>{job.description}</Text>
              <View style={styles.grid}>
                {[
                  [`${job.budget} ETB/hr`, "💰", "Budget"],
                  [String(applicants.length), "👥", "Applicants"],
                  [job.status, "📌", "Status"],
                ].map(([v, icon, l]) => (
                  <View key={String(l)} style={[styles.gridItem, { backgroundColor: surface }]}>
                    <Text style={{ fontSize: 14 }}>{icon}</Text>
                    <Text style={{ color: text, fontWeight: "800", fontSize: 11 }}>{v}</Text>
                    <Text style={{ color: sub, fontSize: 9 }}>{l}</Text>
                  </View>
                ))}
              </View>
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
          (applicantsUnavailable ? (
            <View
              style={[
                styles.card,
                { backgroundColor: card, borderColor: border, alignItems: "center", paddingVertical: 32 },
              ]}
            >
              <Text style={{ color: sub, fontSize: 14, textAlign: "center" }}>
                Applicants unavailable
              </Text>
              <Text style={{ color: sub, fontSize: 11, marginTop: 4, textAlign: "center" }}>
                This endpoint may not be available yet.
              </Text>
            </View>
          ) : applicants.map((a) => {
            const sc = statusColor(a.status);
            return (
              <View
                key={a.id}
                style={[styles.card, { backgroundColor: card, borderColor: border }]}
              >
                <View style={styles.row}>
                  <View style={[styles.avatar, { backgroundColor: primary }]}>
                    <Text style={{ color: "#fff", fontWeight: "800" }}>{a.fullName[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowBetween}>
                      <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>{a.fullName}</Text>
                      <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
                        <Text style={{ color: sc.fg, fontSize: 9, fontWeight: "700" }}>{a.status}</Text>
                      </View>
                    </View>
                    <Text style={{ color: sub, fontSize: 10, marginTop: 2 }}>⭐ {a.rating} · {a.hourlyRate} ETB/hr</Text>
                  </View>
                </View>
                <View style={[styles.row, { marginTop: 10 }]}>
                  <TouchableOpacity
                    style={[styles.btnPrimary, { backgroundColor: primary, flex: 1 }]}
                    onPress={() => Alert.alert("Hire", `Start contract flow with ${a.fullName}`)}
                  >
                    <Text style={styles.btnPrimaryText}>Hire</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnOutline, { borderColor: primary, flex: 1 }]}
                    onPress={() => router.push(`/(parent)/tutor/${a.id}`)}
                  >
                    <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>Profile</Text>
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
  retry: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
