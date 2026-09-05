import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const QUEUE = [
  { id: "1", type: "CHECK_IN", when: "Today 16:02", status: "queued" },
  { id: "2", type: "CHECK_OUT", when: "Today 17:31", status: "queued" },
];

export default function OfflineSessionScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [items, setItems] = useState(QUEUE);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  const retry = () => {
    setSyncing(true);
    setTimeout(() => {
      setItems((q) => q.map((x) => ({ ...x, status: "synced" })));
      setSyncing(false);
      Alert.alert("Synced", "Offline attendance payloads uploaded with signed offlineId.");
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontWeight: "700" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Offline session logger</Text>
        <Text style={{ color: sub, marginTop: 6, lineHeight: 18 }}>
          GPS check-ins are stored on device when offline and synced later with a signed payload.
        </Text>

        <View style={[styles.banner, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}>
          <Text style={{ color: "#92400E", fontWeight: "800", fontSize: 12 }}>
            📡 Offline mode · {items.filter((i) => i.status === "queued").length} pending
          </Text>
        </View>

        {items.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <View style={styles.rowBetween}>
              <Text style={{ color: text, fontWeight: "800" }}>{item.type}</Text>
              <Text
                style={{
                  color: item.status === "synced" ? "#059669" : "#D97706",
                  fontWeight: "800",
                  fontSize: 12,
                }}
              >
                {item.status}
              </Text>
            </View>
            <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>{item.when}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primary, opacity: syncing ? 0.7 : 1 }]}
          onPress={retry}
          disabled={syncing}
        >
          <Text style={styles.btnText}>{syncing ? "Syncing…" : "Retry sync now"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: "900", marginTop: 12 },
  banner: { marginTop: 14, borderRadius: 12, borderWidth: 1, padding: 12 },
  card: { marginTop: 10, borderRadius: 14, borderWidth: 1, padding: 14 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  btn: { marginTop: 18, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
});