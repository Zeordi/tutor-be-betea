import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";

const CODE = "TBB-YESHI24";
const MILESTONES = [
  { label: "Invite 1 friend", reward: "200 ETB", done: true, current: false },
  { label: "Invite 3 friends", reward: "500 ETB", done: true, current: false },
  { label: "Invite 5 friends", reward: "1,000 ETB", done: false, current: true },
  { label: "Invite 10 friends", reward: "2,500 ETB", done: false, current: false },
];
const INVITED = [
  { name: "Meron Abebe", date: "Oct 2", status: "Joined", earned: "+200 ETB" },
  { name: "Dawit Lemma", date: "Oct 8", status: "Joined", earned: "+200 ETB" },
  { name: "Sara Kebede", date: "Oct 11", status: "Pending", earned: "—" },
];

export default function ReferralScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Referral Program</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroTitle}>Invite friends. Earn ETB.</Text>
          <Text style={styles.heroSub}>
            You and your friend both get credit when they complete their first verified session.
          </Text>
          <Text style={styles.heroAm}>ጓደኛዎን ይጋብዙ · ሁለቱም ያግኙ</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>YOUR INVITE CODE</Text>
          <View style={styles.codeRow}>
            <Text style={[styles.code, { color: colors.text }]}>{CODE}</Text>
            <TouchableOpacity
              style={[styles.copyBtn, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert("Copied", CODE)}
            >
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: colors.sub, fontSize: 10, textAlign: "center", marginTop: 8 }}>
            Share this code or your personal link below
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>SHARE VIA</Text>
          <View style={styles.shareGrid}>
            {[
              ["📱", "Telebirr"],
              ["📲", "Telegram"],
              ["💬", "WhatsApp"],
              ["🔗", "Link"],
            ].map(([icon, label]) => (
              <TouchableOpacity
                key={label}
                style={[styles.shareBtn, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}
              >
                <Text style={{ fontSize: 22 }}>{icon}</Text>
                <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginTop: 4 }}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.sub }]}>REWARD MILESTONES</Text>
            <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 11 }}>2 / 5 friends</Text>
          </View>
          {MILESTONES.map((m, i) => (
            <View key={i} style={styles.milestoneRow}>
              <View
                style={[
                  styles.milestoneDot,
                  {
                    backgroundColor: m.done
                      ? colors.primary
                      : m.current
                        ? "#f59e0b"
                        : isDark
                          ? "#334155"
                          : "#e2e8f0",
                  },
                ]}
              >
                <Text style={{ color: "#fff", fontSize: 9, fontWeight: "800" }}>
                  {m.done ? "✓" : i + 1}
                </Text>
              </View>
              <Text
                style={{
                  flex: 1,
                  color: m.done || m.current ? colors.text : colors.sub,
                  fontWeight: "600",
                  fontSize: 12,
                }}
              >
                {m.label}
              </Text>
              <Text
                style={{
                  color: m.done ? "#10b981" : m.current ? "#f59e0b" : colors.sub,
                  fontWeight: "800",
                  fontSize: 12,
                }}
              >
                {m.reward}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>INVITED FRIENDS</Text>
          {INVITED.map((f) => (
            <View
              key={f.name}
              style={[styles.friendRow, { backgroundColor: isDark ? "#1e293b99" : "#f8fafc" }]}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>{f.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 12 }}>{f.name}</Text>
                <Text style={{ color: colors.sub, fontSize: 10 }}>{f.date}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    backgroundColor: f.status === "Joined" ? "#d1fae5" : "#fef3c7",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      color: f.status === "Joined" ? "#047857" : "#b45309",
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {f.status}
                  </Text>
                </View>
                <Text
                  style={{
                    color: f.status === "Joined" ? "#10b981" : colors.sub,
                    fontSize: 10,
                    fontWeight: "700",
                    marginTop: 2,
                  }}
                >
                  {f.earned}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.footerCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View>
            <Text style={{ color: colors.sub, fontSize: 11 }}>Total Earned</Text>
            <Text style={{ color: colors.primary, fontSize: 20, fontWeight: "800" }}>1,000 ETB</Text>
          </View>
          <TouchableOpacity style={[styles.withdraw, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>Withdraw</Text>
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
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  content: { padding: 14, paddingBottom: 40 },
  hero: { borderRadius: 18, padding: 16, marginBottom: 12 },
  heroTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 6 },
  heroSub: { color: "rgba(255,255,255,0.9)", fontSize: 12, lineHeight: 18 },
  heroAm: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 8 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  codeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  code: { fontSize: 20, fontWeight: "800", letterSpacing: 1 },
  copyBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  copyText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  shareGrid: { flexDirection: "row", gap: 8 },
  shareBtn: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  milestoneRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  milestoneDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  footerCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  withdraw: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
});