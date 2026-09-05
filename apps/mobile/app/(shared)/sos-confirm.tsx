import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

type SosState = "idle" | "holding" | "sent";

const CONTACTS = [
  { name: "Yeshi Haile (Parent)", phone: "+251 91 *** 2100", role: "Primary" },
  { name: "Abebe Girma", phone: "+251 92 *** 4412", role: "Emergency" },
  { name: "TBB Safety Desk", phone: "911 · Platform", role: "Platform" },
];

export default function SOSConfirmScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [state, setState] = useState<SosState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bg =
    state === "sent"
      ? isDark
        ? "#064E3B"
        : "#ECFDF5"
      : isDark
        ? "#450A0A"
        : "#FEF2F2";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#FCA5A5" : "#991B1B";
  const card = isDark ? "#7F1D1D33" : "#FFFFFF";

  const startHold = () => {
    if (state === "sent") return;
    setState("holding");
    timer.current = setTimeout(() => {
      setState("sent");
      Alert.alert(
        "SOS sent",
        "Emergency contacts and Tutor Be Betea Safety notified with live location."
      );
    }, 3000);
  };

  const endHold = () => {
    if (timer.current) clearTimeout(timer.current);
    if (state !== "sent") setState("idle");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: sub, fontWeight: "700" }}>
            {state === "sent" ? "Done" : "← Cancel"}
          </Text>
        </Pressable>
        <Text style={{ color: text, fontWeight: "900", fontSize: 12, letterSpacing: 1 }}>
          EMERGENCY SOS
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={{ fontSize: 48 }}>🚨</Text>
        <Text style={[styles.title, { color: text }]}>
          {state === "sent" ? "Alert sent" : "Hold for SOS"}
        </Text>
        <Text style={{ color: sub, textAlign: "center", lineHeight: 20, paddingHorizontal: 12 }}>
          {state === "sent"
            ? "Safety team and emergency contacts received your live GPS."
            : "Hold the button for 3 seconds to alert contacts and TBB Safety with your live location."}
        </Text>
        <Text style={{ color: sub, fontSize: 12, marginTop: 6, textAlign: "center" }}>
          አደጋ ጊዜ — 3 ሰከንድ ተጭነው ይያዙ
        </Text>

        <Pressable
          onPressIn={startHold}
          onPressOut={endHold}
          style={[
            styles.sosBtn,
            {
              backgroundColor:
                state === "sent"
                  ? "#059669"
                  : state === "holding"
                    ? "#B91C1C"
                    : "#DC2626",
              transform: [{ scale: state === "holding" ? 1.08 : 1 }],
            },
          ]}
        >
          <Text style={{ fontSize: 32 }}>{state === "sent" ? "✓" : "🚨"}</Text>
        </Pressable>
        <Text style={{ color: text, fontWeight: "800", marginTop: 12 }}>
          {state === "sent"
            ? "Sent · case opened"
            : state === "holding"
              ? "Hold to confirm…"
              : "Hold 3 seconds"}
        </Text>

        <View style={[styles.list, { backgroundColor: card }]}>
          <Text style={{ color: text, fontWeight: "800", marginBottom: 10, fontSize: 12 }}>
            Will notify
          </Text>
          {CONTACTS.map((c) => (
            <View key={c.phone} style={styles.contactRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>{c.name}</Text>
                <Text style={{ color: sub, fontSize: 11 }}>{c.phone}</Text>
              </View>
              <Text style={{ color: sub, fontSize: 10, fontWeight: "700" }}>{c.role}</Text>
            </View>
          ))}
          {["Share live GPS", "Open Safety Center case", "Record timestamp in audit log"].map(
            (x) => (
              <Text key={x} style={{ color: sub, fontSize: 12, marginTop: 6 }}>
                ✓ {x}
              </Text>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  body: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  title: { fontSize: 22, fontWeight: "900", marginTop: 8, marginBottom: 8 },
  sosBtn: {
    marginTop: 24,
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    marginTop: 24,
    width: "100%",
    borderRadius: 16,
    padding: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});