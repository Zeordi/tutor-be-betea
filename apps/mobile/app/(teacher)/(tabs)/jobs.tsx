import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
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

export default function AvailableJobsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState(0);
  const filters = ["All", "Math", "Physics", "Chemistry", "Near Me"];

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Job[]>(paths.jobsMine)
      .then((data) => {
        if (!cancelled) setJobs(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load jobs");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const job = jobs[selected];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Available Jobs</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Available Jobs</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<Job[]>(paths.jobsMine)
                .then((data) => setJobs(Array.isArray(data) ? data : []))
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
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Available Jobs</Text>
          <Text style={{ color: "#D97706", fontWeight: "800", fontSize: 12 }}>🔗 24 Connects</Text>
        </View>
        <View style={{ backgroundColor: isDark ? "#112240" : "#F1F5F9", borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
          <Text>🔍</Text>
          <TextInput placeholder="Search jobs..." placeholderTextColor={sub} style={{ flex: 1, color: text, fontSize: 13 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {filters.map((f, i) => (
            <TouchableOpacity key={f} onPress={() => setFilter(i)} style={{
              marginRight: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
              backgroundColor: filter === i ? primary : (isDark ? "#112240" : "#F1F5F9"),
            }}>
              <Text style={{ color: filter === i ? "#fff" : sub, fontSize: 11, fontWeight: "700" }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
        <Text style={{ color: sub, fontSize: 11 }}>{jobs.length} jobs matching your profile</Text>
        {jobs.map((j, i) => (
          <TouchableOpacity
            key={j.id}
            style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}
            onPress={() => {
              setSelected(i);
              router.push(`/(teacher)/apply/${j.id}`);
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {j.urgency === "Urgent" && <Text style={{ fontSize: 10, backgroundColor: "#FEE2E2", color: "#DC2626", paddingHorizontal: 6, borderRadius: 99, overflow: "hidden", fontWeight: "700" }}>🔥 Urgent</Text>}
              </View>
              <Text style={{ color: sub, fontSize: 10 }}>📍 {j.loc}</Text>
            </View>
            <Text style={{ color: text, fontWeight: "800", marginTop: 8 }}>{j.title}</Text>
            <View style={{ flexDirection: "row", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              {(j.requirements || []).slice(0, 3).map((s) => (
                <Text key={s} style={{ fontSize: 10, backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9", color: sub, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, overflow: "hidden" }}>{s}</Text>
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
              <Text style={{ color: primary, fontWeight: "900" }}>{j.budget}</Text>
              <TouchableOpacity style={{ backgroundColor: primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 }} onPress={() => router.push(`/(teacher)/apply/${j.id}`)}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Apply →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        {jobs.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>No jobs available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
