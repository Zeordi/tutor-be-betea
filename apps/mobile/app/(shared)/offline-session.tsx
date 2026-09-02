import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfflineSessionScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Offline Session Logger</Text>
        <Text style={{ color: sub, marginTop: 6, lineHeight: 18 }}>
          GPS check-ins are stored on device when offline and synced with a signed payload when connection returns.
        </Text>
        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={{ color: text, fontWeight: "800" }}>Queued logs: 2</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
            Last sync attempt: pending
          </Text>
          <TouchableOpacity style={[styles.btn, { backgroundColor: primary }]}>
            <Text style={styles.btnText}>Retry Sync Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: "900", marginTop: 12 },
  card: { marginTop: 16, borderRadius: 16, padding: 16 },
  btn: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800" },
});