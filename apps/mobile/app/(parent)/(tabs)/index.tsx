import { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type Me = {
  fullName: string;
  email: string;
};

type Subscription = {
  id: string;
  planName?: string;
  status?: string;
};

type Contract = {
  id: string;
  subject: string;
  studentName: string;
  schedule: string;
  status: string;
  teacher?: { fullName: string };
};

type Child = {
  id: string;
  studentName: string;
  gradeLevel?: string;
  curriculum?: string;
  subjects?: string[];
};

type Teacher = {
  id: string;
  fullName: string;
  hourlyRate: number;
  teacherProfile: {
    isVerified: boolean;
    degreeVerified: boolean;
    badgeLevel: string;
    subjects: string[];
  } | null;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function relativeChip(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHrs < 0) return "Past";
  if (diffHrs < 1) return "Soon";
  if (diffHrs < 24) return `In ${diffHrs}h`;
  const diffDays = Math.round(diffHrs / 24);
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ParentHomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<Me | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [upcoming, setUpcoming] = useState<Contract[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [childrenError, setChildrenError] = useState("");
  const [recommended, setRecommended] = useState<Teacher[]>([]);
  const [teachersError, setTeachersError] = useState("");

  const load = useCallback(async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setChildrenError("");
    setTeachersError("");

    try {
      const [meData, subData, contractsData, childrenData, teachersData] = await Promise.all([
        apiRequest<Me>(paths.usersMe),
        apiRequest<Subscription>(paths.subscriptionMine).catch(() => null),
        apiRequest<Contract[]>(paths.contractsParent),
        apiRequest<Child[]>(paths.children).catch(() => []),
        apiRequest<Teacher[]>(paths.teachers).catch(() => []),
      ]);

      if (cancelled) return;

      setMe(meData);
      setSubscription(subData);

      const now = new Date();
      const future = (contractsData || [])
        .filter((c) => new Date(c.schedule) >= now)
        .sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime())
        .slice(0, 5);
      setUpcoming(future);

      if (Array.isArray(childrenData)) setChildren(childrenData);
      if (Array.isArray(teachersData)) setRecommended(teachersData.slice(0, 3));
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load");
    } finally {
      if (!cancelled) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const headerBg = colors.primaryDark;
  const displayName = me?.fullName?.split(" ")[0] || "Parent";
  const initials = useMemo(() => getInitials(me?.fullName || "Parent"), [me?.fullName]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}>Home</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}>Home</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Text style={{ fontSize: 32 }}>⚠️</Text>
          <Text style={{ color: colors.foreground, fontWeight: "700", textAlign: "center" }}>{error}</Text>
          <Pressable onPress={load} style={[styles.retry, { backgroundColor: colors.primary }]}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerGreeting}>{getGreeting()}</Text>
            <Text style={styles.headerName}>{displayName}</Text>
          </View>
          <Pressable onPress={() => router.push("/(parent)/notification-settings")} style={styles.avatarBtn}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.avatarText, { color: colors.primaryDark }]}>{initials}</Text>
            </View>
          </Pressable>
        </View>

        {/* Subscription strip */}
        {subscription?.planName && (
          <View style={[styles.subStrip, { backgroundColor: isDark ? colors.surface2 : colors.primaryLight }]}>
            <Text style={[styles.subText, { color: isDark ? colors.foreground : colors.primaryDark }]}>
              {subscription.planName} · {subscription.status}
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 100 }}>
          {/* Quick Actions */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
              {[
                { icon: "🔍", label: "Find", href: "/(parent)/(tabs)/find-tutors" },
                { icon: "➕", label: "Post", href: "/(parent)/job/create" },
                { icon: "📊", label: "Reports", href: "/(parent)/progress/index" },
                { icon: "💳", label: "Wallet", href: "/(parent)/wallet" },
              ].map((action) => (
                <Pressable
                  key={action.label}
                  style={[styles.quickTile, { backgroundColor: isDark ? colors.surface2 : colors.muted }]}
                  onPress={() => router.push(action.href as any)}
                >
                  <Text style={styles.quickIcon}>{action.icon}</Text>
                  <Text style={[styles.quickLabel, { color: colors.foreground }]}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Upcoming Sessions */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Sessions</Text>
            {upcoming.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={{ fontSize: 28 }}>📅</Text>
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No upcoming sessions</Text>
                <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                  Your scheduled sessions will appear here.
                </Text>
              </View>
            ) : (
              upcoming.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.sessionRow, { borderBottomColor: colors.border }]}
                  onPress={() => router.push(`/(parent)/session/${c.id}`)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionTitle, { color: colors.foreground }]}>
                      {c.subject}
                    </Text>
                    <Text style={[styles.sessionMeta, { color: colors.mutedForeground }]}>
                      {c.teacher?.fullName ? `${c.teacher.fullName} · ` : ""}{c.studentName}
                    </Text>
                    <Text style={[styles.sessionTime, { color: colors.mutedForeground }]}>
                      {new Date(c.schedule).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </View>
                  <View style={[styles.timeChip, { backgroundColor: isDark ? colors.surface2 : colors.primaryLight }]}>
                    <Text style={[styles.timeChipText, { color: isDark ? colors.foreground : colors.primaryDark }]}>
                      {relativeChip(c.schedule)}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>

          {/* My Children */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Children</Text>
              <Pressable onPress={() => router.push("/(parent)/children")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </Pressable>
            </View>
            {childrenError ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{childrenError}</Text>
            ) : children.length === 0 ? (
              <Pressable onPress={() => router.push("/(parent)/children/add")} style={styles.addChildDashed}>
                <Text style={[styles.addChildText, { color: colors.mutedForeground }]}>+ Add Child</Text>
              </Pressable>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {children.map((child) => (
                  <Pressable
                    key={child.id}
                    style={[styles.childCard, { backgroundColor: isDark ? colors.surface2 : colors.muted, borderColor: colors.border }]}
                    onPress={() => router.push(`/(parent)/children/${child.id}`)}
                  >
                    <View style={[styles.childAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.childAvatarText}>{getInitials(child.studentName)}</Text>
                    </View>
                    <Text style={[styles.childName, { color: colors.foreground }]} numberOfLines={1}>
                      {child.studentName}
                    </Text>
                    {child.gradeLevel && (
                      <Text style={[styles.childGrade, { color: colors.mutedForeground }]}>
                        Gr.{child.gradeLevel}
                      </Text>
                    )}
                  </Pressable>
                ))}
                <Pressable onPress={() => router.push("/(parent)/children/add")} style={styles.addChildDashed}>
                  <Text style={[styles.addChildText, { color: colors.mutedForeground }]}>+ Add</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>

          {/* Recommended Tutors */}
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recommended Tutors</Text>
              <Pressable onPress={() => router.push("/(parent)/(tabs)/find-tutors")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </Pressable>
            </View>
            {teachersError ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>{teachersError}</Text>
            ) : recommended.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={{ fontSize: 24 }}>🔍</Text>
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No recommendations yet</Text>
                <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                  Browse tutors to find the best match.
                </Text>
              </View>
            ) : (
              recommended.map((t) => {
                const tp = t.teacherProfile;
                const subjects = tp?.subjects?.slice(0, 2).join(" · ") || "Tutor";
                return (
                  <Pressable
                    key={t.id}
                    style={[styles.tutorCard, { backgroundColor: isDark ? colors.surface2 : colors.muted, borderColor: colors.border }]}
                    onPress={() => router.push(`/(parent)/tutor/${t.id}`)}
                  >
                    <View style={[styles.tutorAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.tutorAvatarText}>{getInitials(t.fullName)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tutorName, { color: colors.foreground }]}>{t.fullName}</Text>
                      <Text style={[styles.tutorSub, { color: colors.mutedForeground }]}>{subjects}</Text>
                      <Text style={[styles.tutorRate, { color: colors.primary }]}>
                        {t.hourlyRate} ETB/hr
                      </Text>
                      <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                        {tp?.isVerified && (
                          <View style={[styles.chip, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : colors.primaryLight }]}>
                            <Text style={[styles.chipText, { color: colors.primaryDark }]}>🛡️ Verified</Text>
                          </View>
                        )}
                        {tp?.degreeVerified && (
                          <View style={[styles.chip, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : colors.primaryLight }]}>
                            <Text style={[styles.chipText, { color: colors.primaryDark }]}>🎓 Degree</Text>
                          </View>
                        )}
                        {tp?.badgeLevel === "GOLD" && (
                          <View style={[styles.chip, { backgroundColor: "#FEF3C7" }]}>
                            <Text style={[styles.chipText, { color: "#92400E" }]}>🥇 Gold</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerGreeting: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: "600" },
  headerName: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginTop: 2 },
  avatarBtn: { padding: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { fontWeight: "800", fontSize: 14 },
  subStrip: { paddingHorizontal: 16, paddingVertical: 10 },
  subText: { fontSize: 13, fontWeight: "700" },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 12 },
  sectionTitle: { fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  seeAll: { fontSize: 12, fontWeight: "700" },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickTile: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  quickIcon: { fontSize: 24 },
  quickLabel: { fontSize: 13, fontWeight: "700" },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  sessionTitle: { fontSize: 14, fontWeight: "700" },
  sessionMeta: { fontSize: 12, marginTop: 2 },
  sessionTime: { fontSize: 11, marginTop: 2 },
  timeChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  timeChipText: { fontSize: 11, fontWeight: "700" },
  emptyBox: { alignItems: "center", paddingVertical: 24, gap: 6 },
  emptyTitle: { fontSize: 14, fontWeight: "700", marginTop: 8 },
  emptySub: { fontSize: 12, textAlign: "center" },
  childCard: {
    width: 120,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  childAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  childAvatarText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  childName: { fontSize: 13, fontWeight: "700", textAlign: "center" },
  childGrade: { fontSize: 11, textAlign: "center" },
  addChildDashed: {
    width: 120,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addChildText: { fontSize: 13, fontWeight: "700" },
  tutorCard: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
  },
  tutorAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  tutorAvatarText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  tutorName: { fontSize: 14, fontWeight: "700" },
  tutorSub: { fontSize: 12, marginTop: 2 },
  tutorRate: { fontSize: 13, fontWeight: "800", marginTop: 4 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  chipText: { fontSize: 10, fontWeight: "700" },
  retry: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
});
