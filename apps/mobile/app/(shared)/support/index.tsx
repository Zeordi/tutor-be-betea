import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../../hooks/useTheme";

const CATEGORIES = [
  { icon: "📅", label: "Booking", count: 12 },
  { icon: "💰", label: "Payments", count: 8 },
  { icon: "🛡️", label: "Safety", count: 6 },
  { icon: "📊", label: "Reports", count: 5 },
  { icon: "👤", label: "Account", count: 9 },
  { icon: "🔗", label: "Contracts", count: 7 },
];

const FAQS = [
  {
    q: "How does the escrow payment work?",
    a: "Your payment is held securely by Tutor Be Betea. It is released to the tutor only after each milestone is completed and you approve it.",
  },
  {
    q: "How are tutors verified?",
    a: "Every tutor undergoes Fayda National ID verification, university degree board checks, and background screening. Only verified tutors receive Trust Badges.",
  },
  {
    q: "Can I request a tutor replacement?",
    a: "Yes. After 2 sessions, you can request a free replacement from the Safety Center. Premium and Elite plans include guaranteed replacements.",
  },
  {
    q: "What if a session doesn’t happen?",
    a: "If a tutor cancels or no-shows, you receive a full escrow refund for that session plus a free session credit.",
  },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, marginLeft: 10 }]}>Help Center</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.search,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <Text style={{ color: colors.sub, fontSize: 12, marginLeft: 8 }}>
            Search help articles, FAQs…
          </Text>
        </View>

        <Text style={[styles.label, { color: colors.sub }]}>BROWSE BY TOPIC</Text>
        <View style={styles.grid}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.label}
              style={[styles.catCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 22 }}>{c.icon}</Text>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 11, marginTop: 6 }}>
                {c.label}
              </Text>
              <Text style={{ color: colors.sub, fontSize: 10 }}>{c.count} articles</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>FREQUENTLY ASKED</Text>
          {FAQS.map((f, i) => (
            <View key={i} style={[styles.faqRow, { borderBottomColor: colors.border }]}>
              <TouchableOpacity
                style={styles.faqHead}
                onPress={() => setExpanded(expanded === i ? null : i)}
              >
                <Text style={{ color: colors.text, fontWeight: "600", fontSize: 12, flex: 1 }}>
                  {f.q}
                </Text>
                <Text style={{ color: colors.sub }}>{expanded === i ? "▴" : "▾"}</Text>
              </TouchableOpacity>
              {expanded === i && (
                <Text style={{ color: colors.sub, fontSize: 11, lineHeight: 17, paddingBottom: 10 }}>
                  {f.a}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View
          style={[
            styles.helpBox,
            {
              backgroundColor: isDark ? "#134e4a44" : "#f0fdfa",
              borderColor: isDark ? "#0f766e" : "#99f6e4",
            },
          ]}
        >
          <Text style={{ color: isDark ? "#5eead4" : "#0f766e", fontWeight: "800", fontSize: 14 }}>
            Still need help?
          </Text>
          <Text style={{ color: isDark ? "#2dd4bf" : "#0d9488", fontSize: 11, marginVertical: 6 }}>
            Support team available 8AM–10PM Addis Ababa time · ድጋፍ ቡድን
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[styles.helpBtn, { backgroundColor: colors.primary, flex: 1 }]}
              onPress={() => router.push("/(shared)/support/create")}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 11 }}>💬 Live Chat / Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.helpBtn, { borderWidth: 1, borderColor: colors.primary, flex: 1 }]}
            >
              <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 11 }}>📞 Call Us</Text>
            </TouchableOpacity>
          </View>
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
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  catCard: {
    width: "31%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
  },
  card: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 12, paddingTop: 12, marginBottom: 12 },
  faqRow: { borderBottomWidth: 1 },
  faqHead: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  helpBox: { borderRadius: 16, borderWidth: 1, padding: 14 },
  helpBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});