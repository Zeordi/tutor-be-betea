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
import { useTheme } from "@/hooks/useTheme";

const STEPS = [
  {
    id: 1,
    icon: "👤",
    label: "Complete Your Bio",
    desc: "Add headline, subjects, languages, and teaching style",
    route: "/(teacher)/profile/edit",
  },
  {
    id: 2,
    icon: "🪪",
    label: "Upload Identity Documents",
    desc: "Fayda National ID (front & back) + university degree",
    route: "/(teacher)/verification",
  },
  {
    id: 3,
    icon: "📅",
    label: "Set Availability",
    desc: "Add your weekly recurring schedule and preferred zones",
    route: "/(teacher)/availability",
  },
  {
    id: 4,
    icon: "💰",
    label: "Payout Setup",
    desc: "Link Telebirr or CBE Birr account for earnings withdrawal",
    route: "/(teacher)/earnings",
  },
  {
    id: 5,
    icon: "📞",
    label: "Intro Call with Tutor Success",
    desc: "Optional 15-min orientation call with TBB team",
    route: "/(shared)/support/create",
  },
  {
    id: 6,
    icon: "🚀",
    label: "Profile Goes Live",
    desc: "After all required steps are complete, you'll be searchable",
    route: null,
  },
];

export default function OnboardingChecklistScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

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
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {STEPS.map((step, i) => {
            const locked = step.id === 6;
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
                      backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{step.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: locked ? colors.sub : colors.text, fontWeight: "800", fontSize: 12 }}>
                    {step.label}
                  </Text>
                  <Text style={{ color: colors.sub, fontSize: 10, marginTop: 2 }}>{step.desc}</Text>
                </View>
                {step.route && (
                  <TouchableOpacity onPress={() => router.push(step.route as any)}>
                    <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>
                      Open →
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
          <TouchableOpacity style={styles.amberBtn} onPress={() => router.push("/(teacher)/earnings")}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Set Up Payout Now →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
