import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Job = {
  id: string;
  title: string;
  family: string;
  loc: string;
  cur: string;
  hrs: string;
  budget: string;
  children: number;
  urgency: string;
  posted: string;
  description: string;
  requirements: string[];
};

export default function TeacherJobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [cover, setCover] = useState(
    "Hello! I'm an MSc Mathematics graduate with 7 years of tutoring experience. Fayda ID verified and degree certified."
  );
  const [connects, setConnects] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest<{ balance: number }>(paths.connectsBalance)
      .then((data) => { if (!cancelled) setConnects(data.balance); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Job>(paths.job(id))
      .then((data) => {
        if (!cancelled) setJob(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load job");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const onApply = async () => {
    try {
      await apiRequest(paths.jobApply(id), {
        method: "POST",
        body: JSON.stringify({ coverNote: cover }),
      });
      setApplied(true);
      Alert.alert("Application submitted", "2 Connects used");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to apply");
    }
  };

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const surface = isDark ? "#1E293B" : "#F8FAFC";

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: text }]}>Job Detail</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: text }]}>Job Detail</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error || "Job not found"}</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Job Detail</Text>
        {job.urgency === "Urgent" && (
          <View style={styles.urgent}><Text style={styles.urgentText}>🔥 Urgent</Text></View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={{ color: text, fontSize: 17, fontWeight: "900" }}>{job.title}</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
            📍 {job.loc} · {job.posted} · #{job.id}
          </Text>
          <View style={styles.chipRow}>
            {(job.requirements || []).slice(0, 4).map((t) => (
              <View key={t} style={[styles.chip, { backgroundColor: surface }]}>
                <Text style={{ color: sub, fontSize: 10 }}>{t}</Text>
              </View>
            ))}
          </View>
          <View style={styles.grid}>
            {[
              [job.budget, "💰", "Budget"],
              [job.hrs, "📅", "Hours"],
              [String(job.children), "👥", "Children"],
              [job.cur, "💱", "Currency"],
            ].map(([v, icon, l]) => (
              <View key={String(l)} style={[styles.gridItem, { backgroundColor: surface }]}>
                <Text style={{ fontSize: 14 }}>{icon}</Text>
                <View>
                  <Text style={{ color: text, fontWeight: "800", fontSize: 11 }}>{String(v)}</Text>
                  <Text style={{ color: sub, fontSize: 8 }}>{l}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={{ color: text, fontSize: 12, lineHeight: 18, marginTop: 10 }}>
            {job.description || "No description provided."}
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
            Costs 2 Connects · You have {connects ?? 0}
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
              2 Connects used
            </Text>
          </View>
        )}
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
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
