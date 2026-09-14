import { useEffect, useState } from "react";
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
import { api, setSession } from "@/lib/api";
import { getBiometricEnabled } from "@/lib/preferences";

const LANGS = ["EN", "አማ", "ORO", "ትግ"] as const;

export default function LoginScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { login } = useAuth();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [biometricOn, setBiometricOn] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    getBiometricEnabled().then(setBiometricOn);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

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
      setCountdown(60);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await api.post("/auth/otp/send", { phoneNumber: phoneNumber.trim() });
      setCountdown(60);
      Alert.alert("Sent", "A new code was sent.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      Alert.alert("Invalid OTP", "Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const verify = await api.post<{ verificationToken: string }>(
        "/auth/otp/verify",
        { phoneNumber: phoneNumber.trim(), code },
      );

      const data = await api.post<{
        accessToken: string;
        user?: { role?: string };
      }>("/auth/login", {
        phoneNumber: phoneNumber.trim(),
        password,
        verificationToken: verify.verificationToken,
      });

      if (!data.accessToken) {
        throw new Error("No access token returned");
      }

      await setSession(
        data.accessToken,
        data.user?.role,
        JSON.stringify(data.user || {}),
      );
      await login(data.accessToken, data.user as any);
      redirectByRole(data.user?.role);
    } catch (e: any) {
      Alert.alert("Login failed", e.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  const setDigit = (index: number, value: string) => {
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
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.langRow}>
            {LANGS.map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => setLang(l)}
                style={[
                  styles.langChip,
                  {
                    backgroundColor: lang === l ? primary : card,
                    borderColor: border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color: lang === l ? "#fff" : sub,
                    fontSize: 11,
                    fontWeight: "800",
                  }}
                >
                  {l}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.logoBox, { backgroundColor: primary + "22" }]}>
            <Text style={{ fontSize: 28 }}>🎓</Text>
          </View>
          <Text style={[styles.brand, { color: primary }]}>Tutor Be Betea</Text>
          <Text style={[styles.title, { color: text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: sub }]}>
            Phone + password + OTP · Ethiopia
          </Text>

          {step === "credentials" && (
            <>
              <Text style={[styles.label, { color: sub }]}>PHONE</Text>
              <View style={[styles.phoneRow, { borderColor: border }]}>
                <Text style={{ color: text, fontWeight: "700" }}>🇪🇹 +251</Text>
                <View
                  style={[styles.phoneDivider, { backgroundColor: border }]}
                />
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="912345678"
                  placeholderTextColor={sub}
                  keyboardType="phone-pad"
                  style={{ flex: 1, color: text, fontSize: 15 }}
                />
              </View>

              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: sub, marginTop: 0 }]}>
                  PASSWORD
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/forgot-password")}
                >
                  <Text style={{ color: primary, fontSize: 12, fontWeight: "700" }}>
                    Forgot?
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={sub}
                secureTextEntry
                style={[
                  styles.input,
                  { borderColor: border, color: text, backgroundColor: card },
                ]}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: primary }]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Continue with OTP</Text>
                )}
              </TouchableOpacity>

              {biometricOn && (
                <TouchableOpacity
                  style={[styles.biometricBtn, { borderColor: primary }]}
                  onPress={() => router.push("/(auth)/biometric")}
                >
                  <Text style={{ color: primary, fontWeight: "800" }}>
                    Use biometric
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {step === "otp" && (
            <>
              <View style={styles.centerBlock}>
                <Text style={[styles.sectionTitle, { color: text }]}>
                  Enter verification code
                </Text>
                <Text style={{ color: sub, fontSize: 13 }}>
                  Sent to {phoneNumber}
                </Text>
              </View>
              <View style={styles.otpRow}>
                {otp.map((d, i) => (
                  <TextInput
                    key={i}
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
                onPress={handleVerifyAndLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & sign in</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
                <Text style={[styles.link, { color: primary }]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                </Text>
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
  content: { padding: 24, paddingTop: 20 },
  langRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
    justifyContent: "flex-end",
  },
  langChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
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
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 6,
  },
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
  biometricBtn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  centerBlock: { alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
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
  link: { textAlign: "center", marginTop: 18, fontSize: 13, fontWeight: "600" },
});