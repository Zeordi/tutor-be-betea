import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Application = {
  id: string;
  status: "SUBMITTED" | "REVIEWING" | "HIRED" | "DECLINED";
  job: {
    title: string;
    family: string;
    loc: string;
    rate: string;
  };
  appliedAt: string;
  coverNote: string;
};

const TABS = ["All", "SUBMITTED", "REVIEWING", "HIRED", "DECLINED"];

export default function MyApplicationsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Application[]>(paths.applicationsMine)
      .then((data) => {
        if (!cancelled) setApplications(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load applications");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B");
  const primary = colors.primary ?? "#0D9488");
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  const statusStyle = (s: string) => {
    if (s === "HIRED") return { bg: "#D1FAE5", fg: "#047857" };
    if (s === "REVIEWING") return { bg: "#CCFBF1", fg: "#0F766E" };
    if (s === "DECLINED") return { bg: "#FEE2E2", fg: "#DC2626" };
    return { bg: isDark ? "#1E293B" : "#F1F5F9", fg: sub };
  };

  const list = tab === "All" ? applications : applications.filter((a) => a.status === tab);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: text }]}>My Applications</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: text }]}>My Applications</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<Application[]>(paths.applicationsMine)
                .then((data) => setApplications(Array.isArray(data) ? data : []))
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            style={[styles.retryBtn, { backgroundColor: primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: text }]}>My Applications</Text>
          <Text style={{ color: sub, fontSize: 11 }}>{applications.length} applications</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 48 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
      >
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tabChip,
              {
                backgroundColor: tab === t ? primary : isDark ? "#112240" : "#F1F5F9",
              },
            ]}
          >
            <Text
              style={{
                color: tab === t ? "#fff" : sub,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {list.map((a) => {
          const st = statusStyle(a.status);
          return (
            <View
              key={a.id}
              style={[styles.card, { backgroundColor: card, borderColor: border }]}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.job, { color: text }]}>{a.job.title}</Text>
                <View style={[styles.pill, { backgroundColor: st.bg }]}>
                  <Text style={{ color: st.fg, fontWeight: "800", fontSize: 10 }}>
                    {a.status}
                  </Text>
                </View>
              </View>
              <Text style={{ color: sub, fontSize: 11, marginTop: 4 }}>
                📍 {a.job.loc} · {a.job.rate} · Applied {new Date(a.appliedAt).toLocaleDateString()}
              </Text>
              {a.status === "HIRED" && (
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: primary }]}
                  onPress={() => router.push("/(teacher)/(tabs)/contracts")}
                >
                  <Text style={styles.btnText}>View Contract →</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
        {list.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
            No applications in this tab
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontWeight: "800" },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 6,
  },
  content: { padding: 16, gap: 10, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "flex-start",
  },
  job: { fontSize: 13, fontWeight: "800", flex: 1 },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  btn: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
