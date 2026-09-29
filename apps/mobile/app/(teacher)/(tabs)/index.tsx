import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";

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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  if (!name) return "T";
  return name
    .split(" ")
    .map((n) => (n || "")[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

    return () => {
      cancelled = true;
    };
  }, []);

  const tp = me?.teacherProfile;
  const displayName = me?.fullName || "Teacher";
  const firstName = displayName.split(" ")[0] || displayName;
  const greeting = getGreeting();
  const initials = getInitials(displayName);

  const connectsBalance = tp?.connectsBalance ?? 0;
  const activeContractsCount = contracts.length;
  const rating = tp?.rating ?? 0;
  const reviewCount = tp?.reviewCount ?? 0;
  const isVerified = !!tp && (tp.isVerified || tp.idVerified || tp.degreeVerified);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={[styles.hero, { backgroundColor: "#1D4ED8" }]}>
            <Text style={styles.heroSub}>{greeting}</Text>
            <Text style={styles.heroName}>Loading...</Text>
          </View>
          <View style={{ padding: 16, gap: 12 }}>
            <View style={styles.kpiRow}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[styles.kpiItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Loading</Text>
                  <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 14 }}>...</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={[styles.hero, { backgroundColor: "#1D4ED8" }]}>
            <Text style={styles.heroSub}>{greeting}</Text>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* BLUE hero - differentiated from parent teal */}
        <View style={[styles.hero, { backgroundColor: "#1D4ED8" }]}>
          <View style={styles.heroTop}>
            <View style={styles.heroText}>
              <Text style={styles.heroSub}>{greeting}</Text>
              <Text style={styles.heroName}>{firstName}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          {/* Hero chips - real data only */}
          <View style={styles.heroChips}>
            <View style={styles.chip}>
              <Text style={styles.chipValue}>{connectsBalance}</Text>
              <Text style={styles.chipLabel}>Connects</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipValue}>{activeContractsCount}</Text>
              <Text style={styles.chipLabel}>Active sessions</Text>
            </View>
          </View>
        </View>

        {/* Verified strip - real flags only */}
        {isVerified && (
          <View
            style={[
              styles.verifiedStrip,
              isDark ? styles.verifiedStripDark : styles.verifiedStripLight,
            ]}
          >
            <Text
              style={[
                styles.verifiedText,
                isDark ? styles.verifiedTextDark : styles.verifiedTextLight,
              ]}
            >
              Fully Verified
            </Text>
            {tp?.idVerified && (
              <Text
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: isDark ? "#064E3B" : "#D1FAE5", color: isDark ? "#A7F3D0" : "#065F46" },
                ]}
              >
                ID
              </Text>
            )}
            {tp?.degreeVerified && (
              <Text
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: isDark ? "#064E3B" : "#D1FAE5", color: isDark ? "#A7F3D0" : "#065F46" },
                ]}
              >
                Degree
              </Text>
            )}
            {tp?.isVerified && (
              <Text
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: isDark ? "#064E3B" : "#D1FAE5", color: isDark ? "#A7F3D0" : "#065F46" },
                ]}
              >
                Profile
              </Text>
            )}
          </View>
        )}

        <View style={{ padding: 16, gap: 12 }}>
          {/* This Month KPI - real metrics only, NO fake earnings */}
          <View
            style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.kpiTitle, { color: colors.mutedForeground }]}>
              THIS MONTH
            </Text>
            <View style={styles.kpiRow}>
              <View style={styles.kpiItem}>
                <Text style={[styles.kpiValue, { color: "#0D9488" }]}>
                  {rating.toFixed(1)}
                </Text>
                <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>
                  Rating
                </Text>
              </View>
              <View style={styles.kpiItem}>
                <Text style={[styles.kpiValue, { color: "#0D9488" }]}>
                  {reviewCount}
                </Text>
                <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>
                  Reviews
                </Text>
              </View>
              <View style={styles.kpiItem}>
                <Text style={[styles.kpiValue, { color: "#0D9488" }]}>
                  {activeContractsCount}
                </Text>
                <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>
                  Sessions
                </Text>
              </View>
              <View style={styles.kpiItem}>
                <Text style={[styles.kpiValue, { color: "#0D9488" }]}>
                  {connectsBalance}
                </Text>
                <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>
                  Connects
                </Text>
              </View>
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            {[
              { label: "Jobs", icon: "briefcase", route: "/(teacher)/(tabs)/jobs" },
              { label: "Applications", icon: "document-text", route: "/(teacher)/applications" },
              { label: "Earnings", icon: "wallet", route: "/(teacher)/earnings" },
              { label: "Connects", icon: "flash", route: "/(teacher)/connects" },
            ].map((action) => (
              <Pressable
                key={action.label}
                style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(action.route)}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: isDark ? "#1E3A5F" : "#EFF6FF" },
                  ]}
                >
                  <Ionicons name={action.icon as any} size={20} color="#1D4ED8" />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.foreground }]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Sessions preview */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
              ACTIVE SESSIONS
            </Text>
            {contracts.length > 0 && (
              <Pressable onPress={() => router.push("/(teacher)/(tabs)/contracts")}>
                <Text style={[styles.seeAll, { color: "#1D4ED8" }]}>See all</Text>
              </Pressable>
            )}
          </View>

          {contracts.length === 0 ? (
            <View
              style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                No active sessions yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                Your active contracts will appear here.
              </Text>
            </View>
          ) : (
            contracts.slice(0, 3).map((c) => (
              <Pressable
                key={c.id}
                style={[styles.sessionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/(teacher)/contract/${c.id}`)}
              >
                <View style={styles.sessionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionSubject, { color: colors.foreground }]}>
                      {c.subject}
                    </Text>
                    <Text style={[styles.sessionMeta, { color: colors.mutedForeground }]}>
                      {c.status}
                      {c.nextSessionAt
                        ? ` · ${new Date(c.nextSessionAt).toLocaleDateString()}`
                        : ""}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroText: {
    flex: 1,
  },
  heroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "500",
  },
  heroName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  heroChips: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  chip: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: 12,
  },
  chipValue: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },
  chipLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    marginTop: 2,
  },
  verifiedStrip: {
    marginHorizontal: 16,
    marginTop: -8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifiedStripLight: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  verifiedStripDark: {
    backgroundColor: "rgba(6, 78, 59, 0.3)",
    borderColor: "#064E3B",
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
  },
  verifiedTextLight: {
    color: "#065F46",
  },
  verifiedTextDark: {
    color: "#A7F3D0",
  },
  verifiedBadge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  kpiCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  kpiTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  kpiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  kpiItem: {
    flex: 1,
    minWidth: "40%",
    alignItems: "center",
    gap: 4,
  },
  kpiValue: {
    fontWeight: "800",
    fontSize: 18,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAction: {
    flex: 1,
    minWidth: "40%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    textAlign: "center",
  },
  sessionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sessionSubject: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 12,
  },
  retryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
});
