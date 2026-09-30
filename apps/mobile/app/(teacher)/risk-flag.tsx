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

export default function RiskFlagScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={["top"]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? "#450a0a" : "#fef2f2",
            borderBottomColor: isDark ? "#7f1d1d" : "#fecaca",
          },
        ]}
      >
        <View style={styles.flagIcon}>
          <Text style={{ color: "#fff", fontWeight: "900" }}>⚑</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: isDark ? "#fca5a5" : "#b91c1c", fontWeight: "800", fontSize: 14 }}>
            Risk Flag — Account Restricted
          </Text>
          <Text style={{ color: isDark ? "#f87171" : "#ef4444", fontSize: 10 }}>
            No active risk flag
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.emptyHero,
            {
              backgroundColor: isDark ? "#1e293b" : "#f8fafc",
              borderColor: isDark ? "#334155" : "#e2e8f0",
            },
          ]}
        >
          <Text style={styles.emptyEmoji}>🛡️</Text>
          <Text style={[styles.emptyTitle, { color: text }]}>
            No active risk flag
          </Text>
          <Text style={[styles.emptyBody, { color: sub }]}>
            Your account is in good standing. If a risk flag is issued, it will appear here with
            details and next steps.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.outlineBtn, { borderColor: colors.border }]}
          onPress={() => router.push("/(shared)/support/create")}
        >
          <Text style={{ color: colors.sub, fontWeight: "700", fontSize: 12 }}>
            📞 Contact Safety Team
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  flagIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 14, paddingBottom: 40 },
  emptyHero: {
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  emptyBody: { fontSize: 12, textAlign: "center", lineHeight: 18 },
  outlineBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});
