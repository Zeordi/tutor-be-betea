import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const TX = [
  { id: "1", title: "Escrow deposit · Contract #4801", amount: -7500, time: "Today", type: "escrow" },
  { id: "2", title: "Telebirr top-up", amount: 10000, time: "Yesterday", type: "in" },
  { id: "3", title: "Session payout held", amount: -675, time: "Mon", type: "escrow" },
  { id: "4", title: "Refund · Cancelled session", amount: 380, time: "Fri", type: "in" },
];

export default function WalletScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const headerBg = isDark ? "#0F1B2D" : "#FFFFFF";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Wallet & Payments</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Balance card — Figma teal gradient feel */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>ETB 2,505.00</Text>
          <View style={styles.balanceMeta}>
            <Text style={styles.balanceMetaText}>Escrow held: ETB 8,175</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          {[
            { icon: "📱", label: "Telebirr" },
            { icon: "🏦", label: "CBE Birr" },
            { icon: "💳", label: "Card" },
            { icon: "📤", label: "Withdraw" },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={[styles.actionItem, { backgroundColor: card }]}>
              <Text style={{ fontSize: 20 }}>{a.icon}</Text>
              <Text style={[styles.actionLabel, { color: text }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Escrow notice */}
        <View style={[styles.notice, { backgroundColor: isDark ? "rgba(13,148,136,0.15)" : "#F0FDFA" }]}>
          <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>🔒 Escrow Protection</Text>
          <Text style={{ color: sub, fontSize: 11, marginTop: 4, lineHeight: 16 }}>
            Funds release only after verified attendance and parent confirmation.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: text }]}>Recent activity</Text>
        {TX.map((t) => (
          <View key={t.id} style={[styles.txRow, { backgroundColor: card }]}>
            <View style={[styles.txIcon, { backgroundColor: t.amount > 0 ? "#D1FAE5" : "#FEE2E2" }]}>
              <Text>{t.amount > 0 ? "↓" : "↑"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txTitle, { color: text }]} numberOfLines={1}>
                {t.title}
              </Text>
              <Text style={{ color: sub, fontSize: 11 }}>{t.time}</Text>
            </View>
            <Text
              style={{
                fontWeight: "800",
                fontSize: 13,
                color: t.amount > 0 ? "#10B981" : text,
              }}
            >
              {t.amount > 0 ? "+" : ""}
              {t.amount.toLocaleString()} ETB
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "800" },
  content: { padding: 16, paddingBottom: 40 },
  balanceCard: {
    backgroundColor: "#0F766E",
    borderRadius: 22,
    padding: 22,
    marginBottom: 14,
  },
  balanceLabel: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
  balanceAmount: { color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 6 },
  balanceMeta: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  balanceMetaText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  actionsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  actionItem: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  actionLabel: { fontSize: 10, fontWeight: "700" },
  notice: { borderRadius: 16, padding: 14, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "800", marginBottom: 10 },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txTitle: { fontSize: 13, fontWeight: "700" },
});