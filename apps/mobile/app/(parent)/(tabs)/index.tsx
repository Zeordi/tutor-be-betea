import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const QUICK = [
  { icon: "🔍", label: "Find", href: "/(parent)/(tabs)/find-tutors" },
  { icon: "💼", label: "Post Job", href: "/(parent)/job/create" },
  { icon: "📊", label: "Reports", href: "/(parent)/progress" },
  { icon: "💰", label: "Wallet", href: "/(parent)/wallet" },
];

const CHILDREN = [
  { name: "Kidane", grade: "10", progress: "87%" },
  { name: "Meron", grade: "8", progress: "92%" },
];

export default function ParentHomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={[styles.hero, { backgroundColor: colors.primaryDark }]}>
        <View style={styles.heroRow}>
          <View>
            <Text style={styles.heroSub}>Good morning 👋</Text>
            <Text style={styles.heroName}>Yeshi Haile</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>YH</Text>
            <View style={styles.badgeDot}>
              <Text style={styles.badgeDotText}>3</Text>
            </View>
          </View>
        </View>
        <View style={styles.subCard}>
          <View>
            <Text style={styles.subLabel}>Subscription</Text>
            <Text style={styles.subTitle}>Elite Plan ⭐</Text>
          </View>
          <View style={styles.elitePill}>
            <Text style={styles.elitePillText}>Active</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>QUICK ACTIONS</Text>
        <View style={styles.quickGrid}>
          {QUICK.map((q) => (
            <Pressable key={q.label} style={styles.quickItem} onPress={() => router.push(q.href as any)}>
              <View style={[styles.quickIcon, { backgroundColor: isDark ? "#134E4A" : "#F0FDFA" }]}>
                <Text style={{ fontSize: 20 }}>{q.icon}</Text>
              </View>
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>{q.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>UPCOMING SESSION</Text>
        <View style={[styles.sessionRow, { backgroundColor: isDark ? "#134E4A" : "#F0FDFA" }]}>
          <View style={[styles.sessionIcon, { backgroundColor: colors.primary }]}>
            <Text>📚</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sessionTitle, { color: colors.foreground }]}>Mathematics – Grade 10</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Selamawit T. · Today 4:00 PM</Text>
          </View>
          <View style={styles.in2h}>
            <Text style={styles.in2hText}>In 2h</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>MY CHILDREN</Text>
          <Pressable onPress={() => router.push("/(parent)/children")}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>See all</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CHILDREN.map((c) => (
            <View key={c.name} style={[styles.childCard, { backgroundColor: colors.surface2 }]}>
              <View style={[styles.childAvatar, { backgroundColor: colors.primary }]}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>{c.name[0]}</Text>
              </View>
              <Text style={[styles.childName, { color: colors.foreground }]}>{c.name}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Gr. {c.grade}</Text>
              <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>{c.progress}</Text>
            </View>
          ))}
          <Pressable
            style={[styles.childCard, { backgroundColor: colors.surface2, borderStyle: "dashed", borderWidth: 1, borderColor: colors.border }]}
            onPress={() => router.push("/(parent)/children")}
          >
            <Text style={{ fontSize: 22, color: colors.mutedForeground }}>+</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Add Child</Text>
          </Pressable>
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>RECOMMENDED TUTORS</Text>
          <Pressable onPress={() => router.push("/(parent)/(tabs)/find-tutors")}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>See all</Text>
          </Pressable>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 8 }]}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={[styles.tutorAvatar, { backgroundColor: colors.primary }]}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>ST</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.tutorName, { color: colors.foreground }]}>Selamawit Tadesse</Text>
                <Text style={{ color: colors.primary, fontWeight: "700" }}>450 ETB</Text>
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Math · Grade 9–12</Text>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <BadgePill label="🛡️ ID" teal />
                <BadgePill label="🎓 Degree" />
                <BadgePill label="🥇 Gold" gold />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            <Pressable
              style={[styles.btnPrimary, { backgroundColor: colors.primary, flex: 1 }]}
              onPress={() => router.push("/(parent)/tutor/1")}
            >
              <Text style={styles.btnPrimaryText}>Book Now</Text>
            </Pressable>
            <Pressable
              style={[styles.btnOutline, { borderColor: colors.primary, flex: 1 }]}
              onPress={() => router.push("/(parent)/tutor/1")}
            >
              <Text style={[styles.btnOutlineText, { color: colors.primary }]}>Profile</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function BadgePill({ label, teal, gold }: { label: string; teal?: boolean; gold?: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: gold ? "#FEF3C7" : teal ? "#0D9488" : "#E0F2FE",
      }}
    >
      <Text style={{ fontSize: 10, fontWeight: "700", color: gold ? "#92400E" : teal ? "#fff" : "#0369A1" }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, borderBottomLeftRadius: 0 },
  heroRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  heroSub: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  heroName: { color: "#fff", fontSize: 18, fontWeight: "800" },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  badgeDot: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDotText: { fontSize: 10, fontWeight: "800", color: "#78350F" },
  subCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  subTitle: { color: "#fff", fontWeight: "700", fontSize: 13 },
  elitePill: { backgroundColor: "#7C3AED", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  elitePillText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  sectionLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8, marginBottom: 10 },
  quickGrid: { flexDirection: "row", justifyContent: "space-between" },
  quickItem: { alignItems: "center", width: "22%" },
  quickIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  quickLabel: { fontSize: 11, fontWeight: "600" },
  sessionRow: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, padding: 10 },
  sessionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  sessionTitle: { fontSize: 13, fontWeight: "700" },
  in2h: { backgroundColor: "#D1FAE5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  in2hText: { color: "#065F46", fontSize: 11, fontWeight: "700" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  childCard: {
    width: 80,
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
  },
  childAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  childName: { fontSize: 11, fontWeight: "700" },
  tutorAvatar: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  tutorName: { fontSize: 14, fontWeight: "700" },
  btnPrimary: { paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  btnOutline: { paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, alignItems: "center" },
  btnOutlineText: { fontWeight: "700", fontSize: 13 },
});