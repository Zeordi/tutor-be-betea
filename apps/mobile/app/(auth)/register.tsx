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

type Role = "PARENT" | "TEACHER";

export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<Role>("PARENT");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const handleSendOtp = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || password.length < 6) {
      Alert.alert(
        "Missing info",
        "Name, phone, and password (min 6) are required.",
      );
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/otp/send", { phoneNumber: phoneNumber.trim() });
      setStep(3);
      setCountdown(60);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
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
      }>("/auth/register", {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        password,
        role,
        verificationToken: verify.verificationToken,
      });

      if (!data.accessToken) throw new Error("No access token returned");

      const typed = data as any;
      await setSession(
        typed.accessToken,
        typed.refreshToken,
        typed.user?.role || role,
        JSON.stringify(typed.user || {}),
      );
      await login(typed.accessToken, typed.user as any, typed.refreshToken);

      router.replace(
        (data.user?.role || role) === "TEACHER"
          ? "/(teacher)/(tabs)"
          : "/(parent)/(tabs)",
      );
    } catch (e: any) {
      Alert.alert("Registration failed", e.message || "Try again");
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
          <Text style={[styles.title, { color: text }]}>Create account</Text>
          <Text style={[styles.sub, { color: sub }]}>
            Step {step} of 3 · Parent or Teacher
          </Text>

          {step === 1 && (
            <>
              <Text style={[styles.label, { color: sub }]}>I AM A</Text>
              {(["PARENT", "TEACHER"] as Role[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleCard,
                    {
                      borderColor: role === r ? primary : border,
                      backgroundColor: card,
                    },
                  ]}
                >
                  <Text style={{ color: text, fontWeight: "800" }}>
                    {r === "PARENT" ? "👨‍👩‍👧 Parent" : "📚 Teacher"}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: primary }]}
                onPress={() => setStep(2)}
              >
                <Text style={styles.btnText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.label, { color: sub }]}>FULL NAME</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Abebe Bikila"
                placeholderTextColor={sub}
                style={[
                  styles.input,
                  { borderColor: border, color: text, backgroundColor: card },
                ]}
              />
              <Text style={[styles.label, { color: sub }]}>PHONE</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="912345678"
                placeholderTextColor={sub}
                keyboardType="phone-pad"
                style={[
                  styles.input,
                  { borderColor: border, color: text, backgroundColor: card },
                ]}
              />
              <Text style={[styles.label, { color: sub }]}>EMAIL (optional)</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@gmail.com"
                placeholderTextColor={sub}
                autoCapitalize="none"
                style={[
                  styles.input,
                  { borderColor: border, color: text, backgroundColor: card },
                ]}
              />
              <Text style={[styles.label, { color: sub }]}>PASSWORD</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
                placeholderTextColor={sub}
                secureTextEntry
                style={[
                  styles.input,
                  { borderColor: border, color: text, backgroundColor: card },
                ]}
              />
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: primary }]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Send OTP</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={[styles.link, { color: sub }]}>← Back</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={[styles.sub, { color: sub }]}>
                Code sent to {phoneNumber}
              </Text>
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
                style={[styles.btn, { backgroundColor: primary }]}
                onPress={handleVerifyAndRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Verify & create account</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                disabled={countdown > 0 || loading}
                onPress={handleSendOtp}
              >
                <Text style={[styles.link, { color: primary }]}>
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(2)}>
                <Text style={[styles.link, { color: sub }]}>← Back</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.link, { color: primary }]}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: "900", marginBottom: 6 },
  sub: { fontSize: 13, marginBottom: 18 },
  label: { fontSize: 11, fontWeight: "700", marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  roleCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  btn: {
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800" },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
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
  link: { textAlign: "center", marginTop: 16, fontWeight: "600" },
});