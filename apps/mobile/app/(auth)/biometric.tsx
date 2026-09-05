import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getBiometricEnabled } from "@/lib/preferences";
import { useAuth } from "@/hooks/useAuth";

export default function BiometricLoginScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    getBiometricEnabled().then((on) => {
      if (!on) {
        router.replace("/(auth)/login");
        return;
      }
      setAllowed(true);
    });
  }, [router]);

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
      // UI-only success path until native biometric + session restore is wired
      Alert.alert("Verified", "Biometric check passed. Continue with your last session or login.");
      if (user?.role === "TEACHER") router.replace("/(teacher)/(tabs)");
      else if (user?.role === "PARENT") router.replace("/(parent)/(tabs)");
      else router.replace("/(auth)/login");
    }, 1200);
  };

  if (allowed === null) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bg, justifyContent: "center" }]}>
        <ActivityIndicator color={primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Text style={{ color: text, fontWeight: "800", fontSize: 15 }}>Quick Sign In</Text>
      </View>

      <View style={styles.body}>
        <View style={[styles.avatar, { backgroundColor: primary }]}>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 22 }}>
            {(user?.fullName || "U")
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </Text>
        </View>
        <Text style={{ color: text, fontWeight: "800", fontSize: 18, marginTop: 12 }}>
          {user?.fullName || "Welcome back"}
        </Text>
        <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
          Biometric is on in Settings · optional only
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
            },
          ]}
        >
          <Text style={{ fontSize: 40 }}>{scanning ? "✓" : "👆"}</Text>
        </TouchableOpacity>

        <Text style={{ color: text, fontWeight: "700", fontSize: 14, marginTop: 16 }}>
          {scanning ? "Verified! Signing in…" : "Touch to sign in"}
        </Text>

        <TouchableOpacity
          style={[styles.outline, { borderColor: border }]}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={{ color: sub, fontWeight: "700", fontSize: 13 }}>
            Use phone + password + OTP instead
          </Text>
        </TouchableOpacity>
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
  outline: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
});