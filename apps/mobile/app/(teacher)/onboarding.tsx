import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";

const STEPS = [
  {
    id: 1,
    icon: "👤",
    label: "Complete Your Bio",
    desc: "Add headline, subjects, languages, and teaching style",
    status: "done" as const,
    time: "Completed Oct 5",
  },
  {
    id: 2,
    icon: "🪪",
    label: "Upload Identity Documents",
    desc: "Fayda National ID (front & back) + university degree",
    status: "issue" as const,
    time: "Action required · See notes",
  },
  {
    id: 3,
    icon: "📅",
    label: "Set Availability",
    desc: "Add your weekly recurring schedule and preferred zones",
    status: "done" as const,
    time: "Completed Oct 6",
  },
  {
    id: 4,
    icon: "💰",
    label: "Payout Setup",
    desc: "Link Telebirr or CBE Birr account for earnings withdrawal",
    status: "pending" as const,
    time: "Not started",
  },
  {
    id: 5,
    icon: "📞",
    label: "Intro Call with Tutor Success",
    desc: "Optional 15-min orientation call with TBB team",
    status: "pending" as const,
    time: "Not started",
  },
  {
    id: 6,
    icon: "🚀",
    label: "Profile Goes Live",
    desc: "After all required steps are complete, you'll be searchable",
    status: "locked" as const,
    time: "Waiting on steps 2 & 4",
  },
];

export default function OnboardingChecklistScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const doneCount = STEPS.filter((s) => s.status === "done").length;
  const progress = Math.round((doneCount / (STEPS.length - 1)) * 100);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Getting Started</Text>
          <Text style={{ color: colors.sub, fontSize: 10 }}>Complete setup to go live</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.progressHero}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.heroTitle}>Onboarding Progress</Text>
              <Text style={styles.heroSub}>
                {doneCount} of {STEPS.length - 1} required steps complete
              </Text>
            </View>
            <Text style={styles.heroPct}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.heroAm}>ፕሮፋይልዎን ለማጠናቀቅ 2 ደረጃዎች ይቀሩዎታል</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {STEPS.map((step, i) => {
            const locked = step.status === "locked";
            return (
              <View
                key={step.id}
                style={[
                  styles.stepRow,
                  {
                    borderBottomColor: colors.border,
                    opacity: locked ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.stepIcon,
                    {
                      backgroundColor:
                        step.status === "done"
                          ? isDark
                            ? "#064e3b55"
                            : "#d1fae5"
                          : step.status === "issue"
                            ? isDark
                              ? "#7f1d1d55"
                              : "#fee2e2"
                            : isDark
                              ? "#1e293b"
                              : "#f1f5f9",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{step.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={{ color: locked ? colors.sub : colors.text, fontWeight: "800", fontSize: 12 }}>
                      {step.label}
                    </Text>
                    {step.status === "done" && (
                      <Badge text="Done" bg="#d1fae5" fg="#047857" />
                    )}
                    {step.status === "issue" && (
                      <Badge text="Action" bg="#fee2e2" fg="#b91c1c" />
                    )}
                  </View>
                  <Text style={{ color: colors.sub, fontSize: 10, marginTop: 2 }}>{step.desc}</Text>
                  <Text
                    style={{
                      color:
                        step.status === "done"
                          ? "#10b981"
                          : step.status === "issue"
                            ? "#ef4444"
                            : colors.sub,
                      fontSize: 10,
                      fontWeight: "600",
                      marginTop: 4,
                    }}
                  >
                    {step.time}
                  </Text>
                </View>
                {step.status !== "done" && step.status !== "locked" && (
                  <TouchableOpacity
                    onPress={() => {
                      if (step.status === "issue") router.push("/(teacher)/verification");
                      else if (step.id === 4) router.push("/(teacher)/earnings");
                    }}
                  >
                    <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>
                      {step.status === "issue" ? "Fix →" : "Start →"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View
          style={[
            styles.quickAction,
            {
              backgroundColor: isDark ? "#78350f33" : "#fffbeb",
              borderColor: isDark ? "#92400e" : "#fde68a",
            },
          ]}
        >
          <Text style={{ color: isDark ? "#fcd34d" : "#b45309", fontWeight: "700", fontSize: 12 }}>
            ⚡ Quick action needed
          </Text>
          <Text style={{ color: isDark ? "#fbbf24" : "#d97706", fontSize: 11, marginVertical: 6 }}>
            Add your Telebirr or CBE Birr number to complete payout setup and unlock profile publishing.
          </Text>
          <TouchableOpacity style={styles.amberBtn}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Set Up Payout Now →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Badge({ text, bg, fg }: { text: string; bg: string; fg: string }) {
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999 }}>
      <Text style={{ color: fg, fontSize: 9, fontWeight: "700" }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  content: { padding: 14, paddingBottom: 40 },
  progressHero: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#0f766e",
    marginBottom: 12,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  heroTitle: { color: "#fff", fontWeight: "800", fontSize: 14 },
  heroSub: { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 },
  heroPct: { color: "#fff", fontSize: 28, fontWeight: "900" },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 999 },
  heroAm: { color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 8 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 12 },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  stepIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAction: { borderRadius: 16, padding: 14, borderWidth: 1 },
  amberBtn: {
    backgroundColor: "#d97706",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});