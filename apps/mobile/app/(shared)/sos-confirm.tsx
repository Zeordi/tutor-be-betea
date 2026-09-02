import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SOSConfirmScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.body}>
        <Text style={{ fontSize: 48 }}>🚨</Text>
        <Text style={[styles.title, { color: text }]}>Confirm SOS Alert</Text>
        <Text style={{ color: sub, textAlign: "center", lineHeight: 20 }}>
          This will notify your emergency contacts and the Tutor Be Betea Safety Team with your live location.
        </Text>
        <TouchableOpacity
          style={styles.danger}
          onPress={() => {
            Alert.alert("SOS Sent", "Safety team has been notified.");
            router.back();
          }}
        >
          <Text style={styles.dangerText}>Send SOS Now</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontWeight: "700", marginTop: 16 }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  title: { fontSize: 22, fontWeight: "900" },
  danger: {
    marginTop: 16,
    backgroundColor: "#DC2626",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  dangerText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});