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

export default function ParentHomeScreen() {
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

  const firstName = user?.fullName?.split(" ")[0] || "Parent";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header — Figma gradient */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerHi}>Good morning 👋</Text>
              <Text style={styles.headerName}>{firstName}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => router.push("/(parent)/(tabs)/profile")}
            >
              <Text style={{ fontSize: 16 }}>👤</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.planCard}>
            <View>
              <Text style={styles.planLabel}>Subscription</Text>
              <Text style={styles.planName}>Elite Plan ⭐</Text>
            </View>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Quick actions */}
          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={[styles.sectionLabel, { color: sub }]}>QUICK ACTIONS</Text>
            <View style={styles.actionsRow}>
              {[
                { icon: "🔍", label: "Find", route: "/(parent)/(tabs)/find-tutors" },
                { icon: "💼", label: "Post Job", route: "/(parent)/job/create" },
                { icon: "📊", label: "Reports", route: "/(parent)/(tabs)/messages" },
                { icon: "💰", label: "Wallet", route: "/(parent)/wallet" },
              ].map((a) => (
                <TouchableOpacity
                  key={a.label}
                  style={styles.actionItem}
                  onPress={() => router.push(a.route as any)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : "#F0FDFA" }]}>
                    <Text style={{ fontSize: 18 }}>{a.icon}</Text>
                  </View>
                  <Text style={[styles.actionLabel, { color: text }]}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Upcoming session */}
          <View style={[styles.card, { backgroundColor: card }]}>
            <Text style={[styles.sectionLabel, { color: sub }]}>UPCOMING SESSION</Text>
            <View style={[styles.sessionRow, { backgroundColor: isDark ? "rgba(13,148,136,0.15)" : "#F0FDFA" }]}>
              <View style={styles.sessionIcon}>
                <Text>📚</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessionTitle, { color: text }]}>Mathematics – Grade 10</Text>
                <Text style={{ color: sub, fontSize: 11 }}>Selamawit T. · Today 4:00 PM</Text>
              </View>
              <View style={styles.inBadge}>
                <Text style={styles.inBadgeText}>In 2h</Text>
              </View>
            </View>
          </View>

          {/* My Children */}
          <View style={[styles.card, { backgroundColor: card }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.sectionLabel, { color: sub }]}>MY CHILDREN</Text>
              <TouchableOpacity onPress={() => router.push("/(parent)/children")}>
                <Text style={{ color: primary, fontSize: 11, fontWeight: "700" }}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { name: "Kidane", grade: "10", prog: "87%" },
                { name: "Meron", grade: "8", prog: "92%" },
              ].map((c) => (
                <View key={c.name} style={[styles.childCard, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC" }]}>
                  <View style={styles.childAvatar}>
                    <Text>{c.name[0]}</Text>
                  </View>
                  <Text style={[styles.childName, { color: text }]}>{c.name}</Text>
                  <Text style={{ color: sub, fontSize: 10 }}>Gr. {c.grade}</Text>
                  <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>{c.prog}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.childCard, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC" }]}
                onPress={() => router.push("/(parent)/children")}
              >
                <View style={[styles.childAvatar, { borderStyle: "dashed", borderWidth: 1, borderColor: sub }]}>
                  <Text style={{ color: sub }}>+</Text>
                </View>
                <Text style={{ color: sub, fontSize: 10 }}>Add Child</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Recommended tutors */}
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionLabel, { color: sub }]}>RECOMMENDED TUTORS</Text>
            <TouchableOpacity onPress={() => router.push("/(parent)/(tabs)/find-tutors")}>
              <Text style={{ color: primary, fontSize: 11, fontWeight: "700" }}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: card }]}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={styles.tutorAvatar}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>ST</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.tutorName, { color: text }]}>Selamawit Tadesse</Text>
                  <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>450 ETB</Text>
                </View>
                <Text style={{ color: sub, fontSize: 11 }}>Math · Grade 9–12</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.miniBadge}>🛡️ ID</Text>
                  <Text style={styles.miniBadge}>🎓 Degree</Text>
                  <Text style={styles.miniBadge}>🥇 Gold</Text>
                </View>
              </View>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: primary }]}
                onPress={() => router.push("/(parent)/tutor/demo-1")}
              >
                <Text style={styles.primaryBtnText}>Book Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineBtn, { borderColor: primary }]}
                onPress={() => router.push("/(parent)/tutor/demo-1")}
              >
                <Text style={[styles.outlineBtnText, { color: primary }]}>Profile</Text>
              </TouchableOpacity>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerHi: { color: "rgba(255,255,255,0.75)", fontSize: 11 },
  headerName: { color: "#fff", fontSize: 16, fontWeight: "800" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  planCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10 },
  planName: { color: "#fff", fontSize: 13, fontWeight: "800" },
  planBadge: { backgroundColor: "#14B8A6", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  planBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  body: { padding: 12, marginTop: -16, gap: 12 },
  card: { borderRadius: 18, padding: 14, marginBottom: 4 },
  sectionLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, marginBottom: 10 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  actionItem: { alignItems: "center", width: "22%" },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  actionLabel: { fontSize: 11, fontWeight: "700" },
  sessionRow: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, padding: 10 },
  sessionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionTitle: { fontSize: 12, fontWeight: "800" },
  inBadge: { backgroundColor: "#10B981", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  inBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  childCard: {
    width: 84,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    marginRight: 8,
    gap: 2,
  },
  childAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  childName: { fontSize: 11, fontWeight: "800" },
  tutorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  tutorName: { fontSize: 13, fontWeight: "800" },
  badgeRow: { flexDirection: "row", gap: 4, marginTop: 4 },
  miniBadge: {
    fontSize: 9,
    backgroundColor: "#F0FDFA",
    color: "#0F766E",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    overflow: "hidden",
    fontWeight: "700",
  },
  btnRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  primaryBtn: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  outlineBtn: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1 },
  outlineBtnText: { fontWeight: "800", fontSize: 12 },
});