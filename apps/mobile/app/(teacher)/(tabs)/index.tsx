import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function TeacherHomeScreen() {
  const { isDark } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  const firstName = user?.fullName?.split(" ")[0] || "Teacher";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerHi}>Good morning 👋</Text>
              <Text style={styles.headerName}>{firstName}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => router.push("/(teacher)/(tabs)/profile")}
            >
              <Text style={{ fontSize: 16 }}>🧑‍🏫</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.earningsCard}
            onPress={() => router.push("/(teacher)/earnings")}
            activeOpacity={0.9}
          >
            <Text style={styles.earningsLabel}>Available to withdraw</Text>
            <Text style={styles.earningsAmount}>8,450 ETB</Text>
            <View style={styles.earningsMetaRow}>
              <Text style={styles.earningsMeta}>+12,800 this month</Text>
              <Text style={styles.earningsMeta}>🔗 24 Connects</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: "Active", value: "3", icon: "📋" },
              { label: "Open jobs", value: "38", icon: "💼" },
              { label: "Rating", value: "4.9", icon: "⭐" },
            ].map((s) => (
              <View key={s.label} style={[styles.statCard, { backgroundColor: card }]}>
                <Text style={{ fontSize: 16 }}>{s.icon}</Text>
                <Text style={[styles.statValue, { color: text }]}>{s.value}</Text>
                <Text style={{ color: sub, fontSize: 10 }}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Next session */}
          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={[styles.sectionLabel, { color: sub }]}>NEXT SESSION</Text>
            <View
              style={[
                styles.sessionRow,
                { backgroundColor: isDark ? "rgba(13,148,136,0.15)" : "#F0FDFA" },
              ]}
            >
              <View style={styles.sessionIcon}>
                <Text>📚</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessionTitle, { color: text }]}>
                  Kidane M. · Mathematics
                </Text>
                <Text style={{ color: sub, fontSize: 11 }}>Today 4:00 PM · Bole</Text>
              </View>
              <TouchableOpacity
                style={styles.checkInBtn}
                onPress={() => router.push("/(teacher)/session/demo-1")}
              >
                <Text style={styles.checkInText}>Check in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick actions */}
          <Text style={[styles.sectionLabel, { color: sub, marginTop: 4 }]}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            {[
              {
                icon: "💼",
                label: "Browse Jobs",
                route: "/(teacher)/(tabs)/jobs",
              },
              {
                icon: "📊",
                label: "Progress",
                route: "/(teacher)/progress/submit",
              },
              {
                icon: "🛡️",
                label: "Verification",
                route: "/(teacher)/verification",
              },
              {
                icon: "💰",
                label: "Earnings",
                route: "/(teacher)/earnings",
              },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                style={[styles.actionCard, { backgroundColor: card }]}
                onPress={() => router.push(a.route as any)}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : "#F0FDFA" },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{a.icon}</Text>
                </View>
                <Text style={[styles.actionLabel, { color: text }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Trust badges strip */}
          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={[styles.sectionLabel, { color: sub }]}>YOUR TRUST BADGES</Text>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>🛡️ National ID</Text>
              <Text style={styles.badge}>🎓 Degree</Text>
              <Text style={styles.badge}>🥇 Gold Top 1%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#0F766E",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerHi: { color: "rgba(255,255,255,0.75)", fontSize: 11 },
  headerName: { color: "#fff", fontSize: 18, fontWeight: "800" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  earningsCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 16,
  },
  earningsLabel: { color: "rgba(255,255,255,0.75)", fontSize: 11 },
  earningsAmount: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 4 },
  earningsMetaRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  earningsMeta: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600" },
  body: { padding: 12, marginTop: -14, gap: 12 },
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 2,
  },
  statValue: { fontSize: 18, fontWeight: "800" },
  card: { borderRadius: 18, padding: 14 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 10,
  },
  sessionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionTitle: { fontSize: 12, fontWeight: "800" },
  checkInBtn: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  checkInText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionCard: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
    alignItems: "flex-start",
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionLabel: { fontSize: 12, fontWeight: "700" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  badge: {
    fontSize: 10,
    backgroundColor: "#F0FDFA",
    color: "#0F766E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    overflow: "hidden",
    fontWeight: "700",
  },
});