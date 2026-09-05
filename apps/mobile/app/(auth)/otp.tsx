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
import { api, setToken } from "@/lib/api";

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; mode?: string }>();
  const { isDark } = useTheme();
  const { login } = useAuth();

  const phone = (params.phone as string) || "";
  const mode = (params.mode as string) || "login"; // login | register

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
      const verify = await api.post("/auth/otp/verify", {
        phoneNumber: phone.trim(),
        code,
      });

      if (mode === "register") {
        router.replace({
          pathname: "/(auth)/role-select",
          params: { verificationToken: verify.verificationToken, phone },
        } as any);
        return;
      }

      // login path: verification token used by caller; if token returned with session:
      if (verify.accessToken && verify.user) {
        await setToken(verify.accessToken);
        await login(verify.accessToken, verify.user);
        if (verify.user?.role === "TEACHER") router.replace("/(teacher)/(tabs)");
        else router.replace("/(parent)/(tabs)");
        return;
      }

      router.replace({
        pathname: "/(auth)/login",
        params: { phone, verificationToken: verify.verificationToken },
      } as any);
    } catch (e: any) {
      Alert.alert("Verification failed", e.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!phone) {
      Alert.alert("Missing phone", "Go back and enter your phone number.");
      return;
    }
    try {
      await api.post("/auth/otp/send", { phoneNumber: phone.trim() });
      Alert.alert("Sent", "A new code was sent via SMS.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not resend");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontWeight: "700" }}>← Back</Text>
          </TouchableOpacity>

          <View style={[styles.iconWrap, { backgroundColor: isDark ? "rgba(13,148,136,0.2)" : "#CCFBF1" }]}>
            <Text style={{ fontSize: 28 }}>💬</Text>
          </View>
          <Text style={[styles.title, { color: text }]}>Verify your number</Text>
          <Text style={{ color: sub, textAlign: "center", lineHeight: 20 }}>
            Enter the 6-digit code sent to{"\n"}
            <Text style={{ fontWeight: "800", color: text }}>
              {phone ? `+251 ${phone}` : "your phone"}
            </Text>
          </Text>

          <View style={styles.otpRow}>
            {otp.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  inputs.current[i] = r;
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
            style={[styles.primaryBtn, { backgroundColor: primary }]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={resend}>
            <Text style={{ color: primary, fontWeight: "700", textAlign: "center", marginTop: 16 }}>
              Resend code
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: 12 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "900", textAlign: "center", marginBottom: 8 },
  otpRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 28 },
  otpBox: {
    width: 46,
    height: 54,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },
  primaryBtn: {
    marginTop: 28,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});