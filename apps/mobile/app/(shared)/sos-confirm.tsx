import { useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

type SosState = "idle" | "holding" | "sent";

export default function SOSConfirmScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [state, setState] = useState<SosState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";

  const startHold = () => {
    setState("holding");
    timer.current = setTimeout(() => {
      setState("sent");
      Alert.alert("SOS sent", "Emergency contacts and safety team notified with live location.");
    }, 3000);
  };

  const endHold = () => {
    if (timer.current) clearTimeout(timer.current);
    if (state !== "sent") setState("idle");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.body}>
        <Text style={{ fontSize: 48 }}>🚨</Text>
        <Text style={[styles.title, { color: text }]}>Emergency SOS</Text>
        <Text style={{ color: sub, textAlign: "center", lineHeight: 20 }}>
          Hold the button for 3 seconds to alert emergency contacts and Tutor Be Betea Safety with your live location.
        </Text>

        <Pressable
          onPressIn={startHold}
          onPressOut={endHold}
          style={[
            styles.sosBtn,
            {
              backgroundColor:
                state === "sent" ? "#059669" : state === "holding" ? "#B91C1C" : "#DC2626",
              transform: [{ scale: state === "holding" ? 1.06 : 1 }],
            },
          ]}
        >
          <Text style={{ fontSize: 28 }}>🚨</Text>
        </Pressable>
        <Text style={{ color: text, fontWeight: "800", marginTop: 12 }}>
          {state === "sent" ? "Alert sent" : state === "holding" ? "Hold to confirm…" : "Hold for SOS"}
        </Text>

        <View style={[styles.list, { backgroundColor: isDark ? "#112240" : "#FFFFFF" }]}>
          {["Notify 3 emergency contacts", "Share live GPS", "Open Safety Center case"].map((x) => (
            <Text key={x} style={{ color: sub, fontSize: 13, marginBottom: 6 }}>
              ✓ {x}
            </Text>
          ))}
        </View>

        <Pressable onPress={() => router.back()}>
          <Text style={{ color: sub, fontWeight: "700", marginTop: 18 }}>
            {state === "sent" ? "Done" : "Cancel"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  title: { fontSize: 22, fontWeight: "900", marginTop: 8, marginBottom: 8 },
  sosBtn: {
    marginTop: 24,
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { marginTop: 24, width: "100%", borderRadius: 16, padding: 16 },
});