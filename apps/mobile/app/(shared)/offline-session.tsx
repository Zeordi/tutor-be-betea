import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

type QStatus = "queued" | "synced";

const INITIAL = [
  {
    id: "off-1",
    type: "CHECK_IN",
    when: "Today 16:02",
    note: "Signed payload · offlineId · Kazanchis",
    status: "queued" as QStatus,
  },
  {
    id: "off-2",
    type: "CHECK_OUT",
    when: "Today 17:31",
    note: "GPS + duration cached · 89 min",
    status: "queued" as QStatus,
  },
];

export default function OfflineSessionScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [items, setItems] = useState(INITIAL);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const pending = items.filter((i) => i.status === "queued").length;

  const retry = () => {
    if (pending === 0) {
      Alert.alert("Up to date", "Nothing left to sync.");
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      setItems((q) => q.map((x) => ({ ...x, status: "synced" as QStatus })));
      setSyncing(false);
      Alert.alert(
        "Synced",
        "Offline attendance payloads uploaded with signed offlineId (idempotent)."
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontWeight: "700" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Offline session logger</Text>
        <Text style={{ color: sub, marginTop: 6, lineHeight: 18 }}>
          GPS check-ins are stored on device when offline and synced later with a signed payload.
        </Text>

        <View
          style={[
            styles.banner,
            {
              backgroundColor: pending ? "#FEF3C7" : "#D1FAE5",
              borderColor: pending ? "#FCD34D" : "#6EE7B7",
            },
          ]}
        >
          <Text
            style={{
              color: pending ? "#92400E" : "#065F46",
              fontWeight: "800",
              fontSize: 12,
            }}
          >
            {pending
              ? `📡 Offline mode · ${pending} pending`
              : "✓ All sessions synced"}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>CURRENT SESSION (OFFLINE)</Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>AT</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>
                Abel Tesfaye · Mathematics
              </Text>
              <Text style={{ color: sub, fontSize: 11 }}>
                Grade 11 · Kazanchis · Started 2:00 PM
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.section, { color: sub, marginTop: 16 }]}>PENDING QUEUE</Text>

        {items.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
          >
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
            <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>{item.note}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primary, opacity: syncing ? 0.7 : 1 }]}
          onPress={retry}
          disabled={syncing}
        >
          <Text style={styles.btnText}>
            {syncing ? "Syncing…" : pending ? "Retry sync now" : "Everything synced"}
          </Text>
        </TouchableOpacity>

        <Text style={{ color: sub, fontSize: 11, textAlign: "center", marginTop: 12 }}>
          Idempotent offlineId prevents duplicate check-ins on replay
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: "900", marginTop: 12 },
  banner: { marginTop: 14, borderRadius: 12, borderWidth: 1, padding: 12 },
  card: { marginTop: 10, borderRadius: 14, borderWidth: 1, padding: 14 },
  section: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800" },
});