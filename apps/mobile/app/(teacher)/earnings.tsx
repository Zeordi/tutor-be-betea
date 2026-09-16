import { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Payout = {
  id: string;
  amount: string | number;
  provider: string;
  status: string;
  createdAt: string;
  paidAt?: string;
};

type TeacherEarnings = {
  totalEarned: number;
  pendingPayout: number;
  payouts: Payout[];
};

export default function EarningsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [earnings, setEarnings] = useState<TeacherEarnings | null>(null);

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

              apiRequest<TeacherEarnings>(paths.teacherEarnings)
      .then((data) => {
        if (!cancelled) setEarnings(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load earnings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const WEEK = useMemo(() => {
    if (!earnings?.payouts?.length) return [30, 45, 40, 60, 55, 70, 65];
    const buckets = Array(7).fill(0);
    earnings.payouts.forEach((p, i) => {
      const v = parseInt(String(p.amount).replace(/[^0-9]/g, ""), 10) || 0;
      buckets[i % 7] = Math.max(buckets[i % 7], v / 100);
    });
    return buckets.map((v) => Math.min(100, Math.max(20, v)));
  }, [earnings]);

  const available = earnings ? `${earnings.pendingPayout.toLocaleString()} ETB` : "0 ETB";
  const monthEarned = earnings ? `${earnings.totalEarned.toLocaleString()} ETB` : "0 ETB";
  const payouts: Payout[] = earnings?.payouts?.length ? earnings.payouts : [];

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Earnings & Payout</Text>
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
          <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Earnings & Payout</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<TeacherEarnings>(paths.teacherEarnings)
                .then((data) => setEarnings(data))
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>
          Earnings & Payout
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Available to Withdraw</Text>
          <Text style={styles.heroAmount}>
            {available.split(" ")[0]} <Text style={{ fontSize: 16, opacity: 0.8 }}>ETB</Text>
          </Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroMetaText}>+{monthEarned} this month</Text>
            <Text style={styles.heroMetaText}>Pending: {available}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => Alert.alert("Withdraw", "Payout request started")}
            >
              <Text style={styles.heroBtnText}>Withdraw All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Schedule Payout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>JUNE 2025</Text>
          <View style={styles.chartRow}>
            {WEEK.map((v, i) => (
              <View key={i} style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (v / 100) * 56,
                      backgroundColor: i === 6 ? primary : isDark ? "#1E3A5F" : "#99F6E4",
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <View style={styles.statsRow}>
            {[
              ["32", "📚", "Sessions"],
              [monthEarned.replace(" ETB", ""), "💰", "ETB Earned"],
              ["4.9", "⭐", "Avg Rating"],
            ].map(([v, icon, l]) => (
              <View key={l} style={[styles.stat, { backgroundColor: surface }]}>
                <Text style={{ fontSize: 14 }}>{icon}</Text>
                <Text style={{ color: primary, fontWeight: "900", fontSize: 13 }}>{v}</Text>
                <Text style={{ color: sub, fontSize: 9 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>PAYOUT METHODS</Text>
          {[
            { icon: "📱", name: "Telebirr", num: "+251 91 *** 4521", def: true },
            { icon: "🏦", name: "CBE Account", num: "1000 *** *** 4812", def: false },
          ].map((p) => (
            <View
              key={p.name}
              style={[styles.methodRow, { borderBottomColor: border }]}
            >
              <Text style={{ fontSize: 18 }}>{p.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>{p.name}</Text>
                <Text style={{ color: sub, fontSize: 10 }}>{p.num}</Text>
              </View>
              {p.def && (
                <View style={[styles.pill, { backgroundColor: "#CCFBF1" }]}>
                  <Text style={{ color: "#0F766E", fontSize: 9, fontWeight: "700" }}>Default</Text>
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={() => router.push("/(teacher)/connects")}>
            <Text style={{ color: primary, fontWeight: "700", fontSize: 12, marginTop: 8 }}>
              + Add payout method
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>PAYOUT HISTORY</Text>
          {payouts.map((p) => (
            <View key={p.id} style={[styles.methodRow, { borderBottomColor: border }]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "800", fontSize: 12 }}>{Number(p.amount).toLocaleString()} ETB</Text>
                <Text style={{ color: sub, fontSize: 10 }}>
                  {new Date(p.createdAt).toLocaleDateString()} · via {p.provider}
                </Text>
              </View>
              <View style={[styles.pill, { backgroundColor: "#D1FAE5" }]}>
                <Text style={{ color: "#047857", fontSize: 9, fontWeight: "700" }}>
                  {p.status}
                </Text>
              </View>
            </View>
          ))}
          {payouts.length === 0 && (
            <Text style={{ color: sub, fontSize: 12 }}>No payouts yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  hero: {
    backgroundColor: "#0F766E",
    borderRadius: 20,
    padding: 20,
  },
  heroLabel: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  heroAmount: { color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 4 },
  heroMeta: { flexDirection: "row", gap: 12, marginTop: 6 },
  heroMetaText: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  heroBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  heroBtnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  section: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 56,
    gap: 6,
    marginBottom: 12,
  },
  barCol: { flex: 1, justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 4 },
  statsRow: { flexDirection: "row", gap: 8 },
  stat: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 2,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  tx: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});