import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { api, setSession } from "@/lib/api";

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
    mode?: string;
    password?: string;
    fullName?: string;
    role?: string;
    email?: string;
  }>();
  const { isDark } = useTheme();
  const { login } = useAuth();

  const phone = (params.phone as string) || "";
  const mode = (params.mode as string) || "login";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const bg = isDark ? "#0A1628" : "#FFFFFF";
  const card = isDark ? "#112240" : "#F8FAFC";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Invalid OTP", "Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const verify = await api.post<{
        verificationToken: string;
        accessToken?: string;
        user?: any;
      }>("/auth/otp/verify", {
        phoneNumber: phone.trim(),
        code,
      });

      // Standalone verify may only return verificationToken
      if (mode === "register") {
        router.replace({
          pathname: "/(auth)/register",
          params: {
            verificationToken: verify.verificationToken,
            phone,
          },
        } as any);
        return;
      }

      if (mode === "reset") {
        router.replace({
          pathname: "/(auth)/reset-password",
          params: {
            phone,
            verificationToken: verify.verificationToken,
          },
        } as any);
        return;
      }

      // Login path needs password on login screen — prefer in-screen OTP there.
      // If API ever returns session on verify:
      if (verify.accessToken && verify.user) {
        await setSession(
          verify.accessToken,
          verify.user?.role,
          JSON.stringify(verify.user),
        );
        await login(verify.accessToken, verify.user);
        router.replace(
          verify.user?.role === "TEACHER"
            ? "/(teacher)/(tabs)"
            : "/(parent)/(tabs)",
        );
        return;
      }

      Alert.alert(
        "Verified",
        "Return to login and complete sign-in with password + OTP there.",
      );
      router.replace("/(auth)/login");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 24 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={[styles.title, { color: text }]}>Enter OTP</Text>
        <Text style={{ color: sub, marginBottom: 20 }}>
          Sent to {phone || "your phone"}
        </Text>
        <View style={styles.otpRow}>
          {otp.map((d, i) => (
            <TextInput
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={d}
              onChangeText={(v) => setDigit(i, v)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.otpBox,
                {
                  borderColor: d ? primary : border,
                  backgroundColor: card,
                  color: text,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primary }]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Verify</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 8 },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800" },
});