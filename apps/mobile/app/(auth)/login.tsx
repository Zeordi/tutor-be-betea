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
import { api, setToken } from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login } = useAuth();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

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
      Alert.alert("OTP sent", "Check your SMS for the verification code.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async () => {
    if (otp.trim().length < 4) {
      Alert.alert("Invalid OTP", "Enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const verify = await api.post("/auth/otp/verify", {
        phoneNumber: phoneNumber.trim(),
        code: otp.trim(),
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

  const handleDemo = async (role: "PARENT" | "TEACHER") => {
    setDemoLoading(true);
    try {
      const data = await api.post("/auth/demo-login", { role });
      await setToken(data.accessToken);
      await login(data.accessToken, data.user);
      redirectByRole(role);
    } catch (e: any) {
      Alert.alert("Demo login", e.message || "Only available in development");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.brand, { color: colors.primary }]}>Tutor Be Betea</Text>
          <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Phone + password + OTP
          </Text>

          {/* Dev demo */}
          <View style={[styles.demoBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[styles.demoTitle, { color: colors.text }]}>Dev preview</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: "#0f766e" }]}
                onPress={() => handleDemo("PARENT")}
                disabled={demoLoading}
              >
                <Text style={styles.demoBtnText}>Parent demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: "#1e293b" }]}
                onPress={() => handleDemo("TEACHER")}
                disabled={demoLoading}
              >
                <Text style={styles.demoBtnText}>Teacher demo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {step === "credentials" ? (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Phone number</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="09xxxxxxxx"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
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
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Enter OTP sent to {phoneNumber}
              </Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="6-digit code"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                maxLength={6}
                style={[styles.input, styles.otpInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={handleVerifyAndLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & Sign in</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep("credentials")}>
                <Text style={[styles.link, { color: colors.textSecondary }]}>Back</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={[styles.link, { color: colors.primary }]}>
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
  content: { padding: 24, paddingTop: 40 },
  brand: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: "700", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  otpInput: { textAlign: "center", letterSpacing: 8, fontSize: 20 },
  primaryBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", marginTop: 18, fontSize: 13, fontWeight: "600" },
  demoBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
  },
  demoTitle: { fontSize: 12, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  row: { flexDirection: "row", gap: 8 },
  demoBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  demoBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});