import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BiometricLoginScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const surface = isDark ? "#112240" : "#F1F5F9";

  const onScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      Alert.alert("Verified", "Biometric sign-in successful");
      router.replace("/(parent)/(tabs)");
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Text style={{ color: text, fontWeight: "800", fontSize: 15 }}>
          Quick Sign In
        </Text>
      </View>

      <View style={styles.body}>
        <View style={[styles.avatar, { backgroundColor: primary }]}>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 22 }}>YH</Text>
        </View>
        <Text style={{ color: text, fontWeight: "800", fontSize: 18, marginTop: 12 }}>
          Yeshi Haile
        </Text>
        <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
          Parent · Premium Plan ⭐
        </Text>

        <TouchableOpacity
          onPress={onScan}
          activeOpacity={0.85}
          style={[
            styles.scanBtn,
            {
              backgroundColor: scanning
                ? isDark
                  ? "rgba(13,148,136,0.25)"
                  : "#CCFBF1"
                : surface,
              borderColor: scanning ? primary : border,
              transform: [{ scale: scanning ? 1.06 : 1 }],
            },
          ]}
        >
          <Text style={{ fontSize: 40 }}>{scanning ? "✓" : "👆"}</Text>
        </TouchableOpacity>

        <Text style={{ color: text, fontWeight: "700", fontSize: 14, marginTop: 16 }}>
          {scanning ? "Verified! Signing in…" : "Touch to sign in"}
        </Text>
        <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
          Or use Face ID / PIN
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.outline, { borderColor: border }]}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={{ color: sub, fontWeight: "700", fontSize: 13 }}>
              Use phone + OTP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={{ color: primary, fontWeight: "700", fontSize: 13, marginTop: 14 }}>
              Not you? Switch account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scanBtn: {
    marginTop: 28,
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { width: "100%", marginTop: 32, alignItems: "center" },
  outline: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
});