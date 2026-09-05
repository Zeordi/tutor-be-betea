import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const TX = [
  { t: "Escrow fund · Kidane Math", a: "−9,000 ETB", d: "Oct 1", plus: false },
  { t: "Session release · Selamawit", a: "Escrow", d: "Oct 12", plus: false },
  { t: "Top-up Telebirr", a: "+5,000 ETB", d: "Sep 28", plus: true },
];

export default function ParentWalletScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
          Wallet & Escrow
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={styles.hero}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Available balance</Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 4 }}>
            4,250 ETB
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 6 }}>
            12,800 ETB currently in escrow
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => Alert.alert("Top up", "Telebirr / CBE flow")}
            >
              <Text style={styles.heroBtnText}>Top up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => router.push("/(parent)/contracts")}
            >
              <Text style={styles.heroBtnText}>View escrow</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.section, { color: sub }]}>RECENT</Text>
        {TX.map((x) => (
          <View
            key={x.t}
            style={[styles.tx, { backgroundColor: card, borderColor: border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>{x.t}</Text>
              <Text style={{ color: sub, fontSize: 10 }}>{x.d}</Text>
            </View>
            <Text style={{ color: x.plus ? "#10B981" : text, fontWeight: "800" }}>{x.a}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  hero: {
    backgroundColor: "#0F766E",
    borderRadius: 20,
    padding: 20,
  },
  heroBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  heroBtnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  tx: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
});