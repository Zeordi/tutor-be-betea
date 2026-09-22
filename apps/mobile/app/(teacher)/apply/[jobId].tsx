import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet } from "react-native";
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

export default function JobDetailApplyScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [cover, setCover] = useState(
    "Hello! I'm an MSc Mathematics graduate with 7 years of tutoring experience. Fayda ID verified and degree certified."
  );

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Job>(paths.job(jobId))
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
  }, [jobId]);

  const onApply = async () => {
    try {
      await apiRequest(paths.jobApply(jobId), {
        method: "POST",
        body: JSON.stringify({ coverNote: cover }),
      });
      setApplied(true);
      Alert.alert("Applied", "2 Connects used.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to apply");
    }
  };

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>Job Detail</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>Job Detail</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>Job Detail</Text>
        {job.urgency === "Urgent" && (
          <Text style={{ fontSize: 10, backgroundColor: "#FEE2E2", color: "#DC2626", paddingHorizontal: 8, borderRadius: 99, overflow: "hidden", fontWeight: "700" }}>🔥 Urgent</Text>
        )}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}>
        <View style={{ backgroundColor: card, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: text, fontSize: 17, fontWeight: "900" }}>{job.title}</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>📍 {job.loc} · Job #{job.id}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {(job.requirements || []).slice(0, 4).map((t) => (
              <Text key={t} style={{ fontSize: 10, backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9", color: sub, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: "hidden" }}>{t}</Text>
            ))}
          </View>
          <Text style={{ color: text, fontSize: 13, lineHeight: 19, marginTop: 12 }}>
            {job.description || "No description provided."}
          </Text>
        </View>

        <View style={{ backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "#FFFBEB", borderRadius: 16, padding: 14 }}>
          <Text style={{ color: "#D97706", fontWeight: "800" }}>🔗 Apply with Connects</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>Costs 2 Connects · You have 24</Text>
        </View>

        {!applied ? (
          <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
            <Text style={{ color: sub, fontSize: 10, fontWeight: "800", marginBottom: 8 }}>YOUR APPLICATION</Text>
            <TextInput
              value={cover}
              onChangeText={setCover}
              multiline
              style={{ color: text, minHeight: 100, textAlignVertical: "top", fontSize: 13 }}
            />
          </View>
        ) : (
          <View style={{ backgroundColor: isDark ? "rgba(16,185,129,0.15)" : "#ECFDF5", borderRadius: 16, padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 28 }}>✓</Text>
            <Text style={{ color: "#059669", fontWeight: "800", marginTop: 6 }}>Application Submitted!</Text>
            <Text style={{ color: sub, fontSize: 12 }}>2 Connects used · 22 remaining</Text>
          </View>
        )}
      </ScrollView>
      {!applied && (
        <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: border }}>
          <TouchableOpacity
            style={{ backgroundColor: primary, borderRadius: 14, paddingVertical: 16, alignItems: "center" }}
            onPress={onApply}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Apply Now — Use 2 Connects</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
