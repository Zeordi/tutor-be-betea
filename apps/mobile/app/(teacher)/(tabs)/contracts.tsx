import { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Contract = {
  id: string;
  studentName: string;
  parentName: string;
  subject: string;
  grade: string;
  sessionsDone: number;
  sessionsTotal: number;
  monthly: number;
  nextSessionAt: string | null;
  milestone: string;
  status: "Active" | "Pending";
};

export default function ActiveContractsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const surface = isDark ? "#1E293B" : "#F8FAFC";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Contract[]>(paths.contractsTeacher)
      .then((data) => {
        if (!cancelled) setContracts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load contracts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const summary = useMemo(() => {
    const active = contracts.filter((c) => c.status === "Active").length;
    const pending = contracts.filter((c) => c.status === "Pending").length;
    return `${active} active · ${pending} pending start`;
  }, [contracts]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Active Contracts</Text>
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
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Active Contracts</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
    apiRequest<Contract[]>(paths.contractsTeacher)
                .then((data) => setContracts(Array.isArray(data) ? data : []))
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
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Active Contracts</Text>
        <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>{summary}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, gap: 10, paddingBottom: 100 }}>
        {contracts.map((c) => (
          <View key={c.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.row}>
              <View style={[styles.avatar, { backgroundColor: primary }]}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>{c.studentName?.[0] ?? "?"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>
                  {c.studentName} (Gr.{c.grade})
                </Text>
                <Text style={{ color: sub, fontSize: 11 }}>
                  {c.subject} · Parent: {c.parentName}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor:
                      c.status === "Active" ? "#CCFBF1" : "#FEF3C7",
                  },
                ]}
              >
                <Text
                  style={{
                    color: c.status === "Active" ? "#0F766E" : "#D97706",
                    fontSize: 10,
                    fontWeight: "700",
                  }}
                >
                  {c.status}
                </Text>
              </View>
            </View>

            <View style={styles.grid}>
              {[
                [`${c.monthly} ETB/mo`, "💰"],
                [`${c.sessionsDone} done / ${c.sessionsTotal} total`, "📚"],
                [`Milestone ${c.milestone}`, "⏳"],
                [c.nextSessionAt || "—", "📅"],
              ].map(([v, icon]) => (
                <View key={String(v)} style={[styles.gridItem, { backgroundColor: surface }]}>
                  <Text style={{ fontSize: 13 }}>{icon}</Text>
                  <Text
                    style={{
                      color: text,
                      fontSize: 10,
                      fontWeight: "700",
                      flex: 1,
                    }}
                    numberOfLines={1}
                  >
                    {v}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: primary }]}
                onPress={() => router.push(`/(teacher)/session/${c.id}`)}
              >
                <Text style={styles.primaryText}>Check In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineBtn, { borderColor: border }]}
                onPress={() => router.push(`/(shared)/chat/${c.id}`)}
              >
                <Text style={{ color: sub, fontWeight: "700", fontSize: 12 }}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineBtn, { borderColor: primary }]}
                onPress={() => router.push(`/(teacher)/contract/${c.id}`)}
              >
                <Text style={{ color: primary, fontWeight: "700", fontSize: 12 }}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {contracts.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>No contracts yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  gridItem: {
    width: "47%",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actions: { flexDirection: "row", gap: 8 },
  primaryBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  outlineBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});