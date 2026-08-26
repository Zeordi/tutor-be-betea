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

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PARENT" | "TEACHER">("PARENT");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || password.length < 6) {
      Alert.alert("Missing info", "Name, phone, and password (min 6) are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/otp/send", { phoneNumber: phoneNumber.trim() });
      setStep("otp");
      Alert.alert("OTP sent", "Enter the code from SMS to finish signup.");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (otp.trim().length < 4) {
      Alert.alert("Invalid OTP", "Enter the code sent to your phone.");
      return;
    }
    setLoading(true);
    try {
      const verify = await api.post("/auth/otp/verify", {
        phoneNumber: phoneNumber.trim(),
        code: otp.trim(),
      });

      const data = await api.post("/auth/register", {
        fullName: fullName.trim(),
        email: email.trim() || undefined,
        phoneNumber: phoneNumber.trim(),
        password,
        role,
        verificationToken: verify.verificationToken,
      });

      await setToken(data.accessToken);
      await login(data.accessToken, data.user);

      if (role === "TEACHER") router.replace("/(teacher)/(tabs)");
      else router.replace("/(parent)/(tabs)");
    } catch (e: any) {
      Alert.alert("Registration failed", e.message || "Please try again");
    } finally {
      setLoading(false);
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
          <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Phone + password + OTP verification
          </Text>

          {step === "form" ? (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Full name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Yohannes Abebe"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <Text style={[styles.label, { color: colors.text }]}>Phone number</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="09xxxxxxxx"
                keyboardType="phone-pad"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <Text style={[styles.label, { color: colors.text }]}>Email (optional)</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
                secureTextEntry
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <Text style={[styles.label, { color: colors.text }]}>Join as</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.roleBtn,
                    {
                      borderColor: role === "PARENT" ? colors.primary : colors.border,
                      backgroundColor: role === "PARENT" ? colors.primary + "22" : colors.surface,
                    },
                  ]}
                  onPress={() => setRole("PARENT")}
                >
                  <Text style={{ color: colors.text, fontWeight: "700" }}>Parent</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleBtn,
                    {
                      borderColor: role === "TEACHER" ? colors.primary : colors.border,
                      backgroundColor: role === "TEACHER" ? colors.primary + "22" : colors.surface,
                    },
                  ]}
                  onPress={() => setRole("TEACHER")}
                >
                  <Text style={{ color: colors.text, fontWeight: "700" }}>Teacher</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Continue</Text>}
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
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, styles.otpInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              />

              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={handleVerifyAndRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & Create account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep("form")}>
                <Text style={[styles.link, { color: colors.textSecondary }]}>Back</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.link, { color: colors.primary }]}>
              Already have an account? Login
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
  subtitle: { fontSize: 14, marginBottom: 18 },
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
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", marginTop: 18, fontSize: 13, fontWeight: "600" },
});