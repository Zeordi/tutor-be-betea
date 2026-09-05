import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const TX = [
  { id: "1", title: "Escrow funded · Math pack", amount: "-5,400", type: "out", time: "Today" },
  { id: "2", title: "Milestone released", amount: "-2,700", type: "out", time: "Yesterday" },
  { id: "3", title: "Top-up Telebirr", amount: "+10,000", type: "in", time: "Mon" },
];

export default function WalletScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: colors.mutedForeground }}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Wallet</Text>
      </View>

      <View style={{ padding: 16, gap: 14 }}>
        <View style={[styles.balance, { backgroundColor: colors.primaryDark }]}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Available balance</Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "800", marginTop: 4 }}>12,450 ETB</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 }}>
            Escrow held: 5,400 ETB
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Pressable style={styles.balBtn}>
              <Text style={styles.balBtnText}>Top up</Text>
            </Pressable>
            <Pressable style={[styles.balBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={[styles.balBtnText, { color: "#fff" }]}>History</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {["Telebirr", "CBE Birr", "Card"].map((p) => (
            <View
              key={p}
              style={[styles.payPill, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 12 }}>{p}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.section, { color: colors.mutedForeground }]}>RECENT</Text>
        {TX.map((t) => (
          <View
            key={t.id}
            style={[styles.tx, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View>
              <Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 13 }}>{t.title}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{t.time}</Text>
            </View>
            <Text
              style={{
                fontWeight: "800",
                color: t.type === "in" ? "#059669" : colors.foreground,
              }}
            >
              {t.amount} ETB
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: "800" },
  balance: { borderRadius: 20, padding: 20 },
  balBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  balBtnText: { color: "#0F766E", fontWeight: "800", fontSize: 13 },
  payPill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8, marginTop: 4 },
  tx: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
});