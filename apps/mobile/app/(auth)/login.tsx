import { useState } from "react";
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
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { getBiometricEnabled } from "@/lib/preferences";
import { api, setToken } from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { login } = useAuth();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const bg = isDark ? "#0A1628" : "#FFFFFF";
  const card = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  const redirectByRole = (role?: string) => {
    if (role === "TEACHER") router.replace("/(teacher)/(tabs)");
    else router.replace("/(parent)/(tabs)");
  };

  const handleSendOtp = async () => {
    if (!phoneNumber.trim() || password.length < 6) {
      Alert.alert("Missing info", "Enter phone and password (min 6 chars).");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/otp/send", { phoneNumber: phoneNumber.trim() });
      setStep("otp");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Invalid OTP", "Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const verify = await api.post("/auth/otp/verify", {
        phoneNumber: phoneNumber.trim(),
        code,
      });

      const data = await api.post("/auth/login", {
        phoneNumber: phoneNumber.trim(),
        password,
        verificationToken: verify.verificationToken,
      });

      await setToken(data.accessToken);
      await login(data.accessToken, data.user);
      redirectByRole(data.user?.role);
    } catch (e: any) {
      Alert.alert("Login failed", e.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const setOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.logoBox, { backgroundColor: isDark ? "rgba(13,148,136,0.25)" : "#CCFBF1" }]}>
            <Text style={{ fontSize: 32 }}>🎓</Text>
          </View>
          <Text style={[styles.brand, { color: primary }]}>Tutor Be Betea</Text>
          <Text style={[styles.title, { color: text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: sub }]}>
            Phone + password + OTP verification
          </Text>

          {step === "credentials" ? (
            <>
              <Text style={[styles.label, { color: sub }]}>Phone Number</Text>
              <View style={[styles.phoneRow, { borderColor: border, backgroundColor: card }]}>
                <Text style={{ fontWeight: "800", color: primary }}>🇪🇹 +251</Text>
                <View style={[styles.phoneDivider, { backgroundColor: border }]} />
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="91 234 5678"
                  keyboardType="phone-pad"
                  placeholderTextColor={sub}
                  style={{ flex: 1, color: text, fontSize: 15 }}
                />
              </View>

              <Text style={[styles.label, { color: sub }]}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                placeholderTextColor={sub}
                style={[styles.input, { borderColor: border, color: text, backgroundColor: card }]}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: primary }]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Continue</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.centerBlock}>
                <Text style={{ fontSize: 28, marginBottom: 8 }}>💬</Text>
                <Text style={[styles.sectionTitle, { color: text }]}>Verify Your Number</Text>
                <Text style={{ color: sub, fontSize: 12, textAlign: "center" }}>
                  We sent a 6-digit code to{"\n"}
                  <Text style={{ fontWeight: "800", color: text }}>+251 {phoneNumber}</Text>
                </Text>
              </View>

              <View style={styles.otpRow}>
                {otp.map((d, i) => (
                  <TextInput
                    key={i}
                    value={d}
                    onChangeText={(v) => setOtpDigit(i, v)}
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
                onPress={handleVerifyAndLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & Sign In</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep("credentials")}>
                <Text style={[styles.link, { color: sub }]}>← Back</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => router.push("/(auth)/role-select")}>
            <Text style={[styles.link, { color: primary }]}>
              Don’t have an account? Create account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 36 },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brand: { fontSize: 14, fontWeight: "800", marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: 13, marginBottom: 22 },
  label: { fontSize: 11, fontWeight: "700", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 4,
  },
  phoneDivider: { width: 1, height: 18 },
  primaryBtn: {
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  centerBlock: { alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  otpRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 8 },
  otpBox: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
  },
  link: { textAlign: "center", marginTop: 18, fontSize: 13, fontWeight: "600" },
});