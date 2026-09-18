import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type TeacherMe = {
  id: string;
  fullName: string;
  email: string;
  teacherProfile: {
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    connectsBalance: number;
    isVerified: boolean;
    idVerified: boolean;
    degreeVerified: boolean;
    badgeLevel: string;
  } | null;
};

type ContractShort = {
  id: string;
  subject: string;
  status: string;
  schedule: string;
};

export default function TeacherHomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<TeacherMe | null>(null);
  const [contracts, setContracts] = useState<ContractShort[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiRequest<TeacherMe>(paths.usersMe),
      apiRequest<ContractShort[]>(paths.contractsTeacher),
    ])
      .then(([meData, contractsData]) => {
        if (!cancelled) {
          setMe(meData);
          setContracts(Array.isArray(contractsData) ? contractsData : []);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const tp = me?.teacherProfile;
  const displayName = me?.fullName || "Teacher";
  const weeklySessionsCount = contracts.length;
  const earnings = tp ? `${tp.hourlyRate * weeklySessionsCount} ETB` : "0 ETB";
  const rating = tp ? `${tp.rating.toFixed(1)} ⭐` : "—";
  const connects = tp ? `${tp.connectsBalance} left` : "0 left";

  if (loading) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
          <Text style={styles.heroSub}>Teacher dashboard</Text>
          <Text style={styles.heroName}>Loading...</Text>
        </View>
        <View style={{ padding: 16, gap: 12 }}>
          <View style={styles.kpiRow}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.kpi, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Loading</Text>
                <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 14 }}>...</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
          <Text style={styles.heroSub}>Teacher dashboard</Text>
          <Text style={styles.heroName}>{displayName}</Text>
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ color: colors.text, marginBottom: 12 }}>{error}</Text>
          <Pressable
            onPress={() => {
              setError("");
              setLoading(true);
              Promise.all([
                apiRequest<TeacherMe>(paths.usersMe),
                apiRequest<ContractShort[]>(paths.contractsTeacher),
              ])
                .then(([meData, contractsData]) => {
                  setMe(meData);
                  setContracts(Array.isArray(contractsData) ? contractsData : []);
                })
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
        <Text style={styles.heroSub}>Teacher dashboard</Text>
        <Text style={styles.heroName}>{displayName}</Text>
        <View style={styles.connects}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 20 }}>{tp?.connectsBalance ?? 0}</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Connects · Standard</Text>
        </View>
      </View>

      <View style={{ padding: 16, gap: 12 }}>
        <View style={styles.kpiRow}>
          {[
            ["This Month", earnings, "💰"],
            ["Rating", rating, `${tp?.reviewCount || 0} reviews`],
            ["Sessions", `${weeklySessionsCount}`, "This month"],
            ["Connects", connects, "🔗 balance"],
          ].map(([a, b, sub]) => (
            <View key={String(a)} style={[styles.kpi, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{a}</Text>
              <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 14 }}>{String(b)}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push("/(teacher)/(tabs)/jobs")}
        >
          <Text style={[styles.section, { color: colors.mutedForeground }]}>AVAILABLE JOBS</Text>
          <Text style={{ color: colors.foreground, fontWeight: "700" }}>
            {contracts.length > 0 ? `${contracts.length} active contracts` : "No active contracts"}
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Tap to browse jobs</Text>
        </Pressable>

        {contracts.length > 0 && (
          <Pressable
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push("/(teacher)/(tabs)/contracts")}
          >
            <Text style={[styles.section, { color: colors.mutedForeground }]}>NEXT SESSION</Text>
            <Text style={{ color: colors.foreground, fontWeight: "700" }}>{contracts[0].subject}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
              {new Date(contracts[0].schedule).toLocaleDateString()} · {contracts[0].status}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 20, paddingTop: 24 },
  heroSub: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  heroName: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 4 },
  connects: {
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 12,
  },
  kpiRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  kpi: { flex: 1, minWidth: "45%", borderRadius: 12, borderWidth: 1, padding: 12 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 6 },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
