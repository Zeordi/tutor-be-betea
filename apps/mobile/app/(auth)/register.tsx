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
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { api, setToken } from "@/lib/api";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const { colors, isDark } = useTheme();
  const { login } = useAuth();

  const initialRole =
    params.role === "TEACHER" ? "TEACHER" : ("PARENT" as "PARENT" | "TEACHER");

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<"PARENT" | "TEACHER">(initialRole);
  const [fullName, setFullName] = useState("");
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

  const handleSendOtp = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || password.length < 6) {
      Alert.alert("Missing info", "Name, phone, and password (min 6) are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/otp/send", { phoneNumber: phoneNumber.trim() });
      setStep(3);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
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

      const data = await api.post("/auth/register", {
        fullName: fullName.trim(),
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
        {/* Progress header — Figma */}
        <View style={[styles.header, { borderBottomColor: border, backgroundColor: isDark ? "#0F1B2D" : "#FFFFFF" }]}>
          <TouchableOpacity onPress={() => (step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back())}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: text }]}>Create Account</Text>
          <View style={{ width: 20 }} />
        </View>
        <View style={styles.progressRow}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[
                styles.progressBar,
                { backgroundColor: n <= step ? primary : isDark ? "#1E3A5F" : "#E2E8F0" },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.stepLabel, { color: sub }]}>
          Step {step} of 3 — {["Choose Role", "Your Details", "Verify Phone"][step - 1]}
        </Text>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {step === 1 && (
            <>
              <Text style={[styles.sectionTitle, { color: text }]}>
                How will you use Tutor Be Betea?
              </Text>
              {(["PARENT", "TEACHER"] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleCard,
                    {
                      borderColor: role === r ? primary : border,
                      backgroundColor:
                        role === r
                          ? isDark
                            ? "rgba(13,148,136,0.2)"
                            : "#F0FDFA"
                          : card,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 28 }}>{r === "PARENT" ? "👨‍👩‍👧" : "🧑‍🏫"}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.roleTitle, { color: text }]}>
                      {r === "PARENT" ? "Parent / Guardian" : "Tutor / Teacher"}
                    </Text>
                    <Text style={{ color: sub, fontSize: 11 }}>
                      {r === "PARENT"
                        ? "Find verified tutors for your children"
                        : "Earn income teaching students near you"}
                    </Text>
                  </View>
                  {role === r && <Text style={{ color: primary, fontWeight: "800" }}>✓</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: primary }]}
                onPress={() => setStep(2)}
              >
                <Text style={styles.primaryBtnText}>
                  Continue as {role === "PARENT" ? "Parent" : "Tutor"} →
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.label, { color: sub }]}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Yeshi Haile"
                placeholderTextColor={sub}
                style={[styles.input, { borderColor: border, color: text, backgroundColor: card }]}
              />

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
                placeholder="Min 6 characters"
                secureTextEntry
                placeholderTextColor={sub}
                style={[styles.input, { borderColor: border, color: text, backgroundColor: card }]}
              />

              <View style={styles.rowBtns}>
                <TouchableOpacity
                  style={[styles.secondaryBtn, { borderColor: border }]}
                  onPress={() => setStep(1)}
                >
                  <Text style={{ color: sub, fontWeight: "700" }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: primary, flex: 1 }]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Next →</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.centerBlock}>
                <View style={[styles.iconCircle, { backgroundColor: isDark ? "rgba(13,148,136,0.25)" : "#CCFBF1" }]}>
                  <Text style={{ fontSize: 28 }}>📱</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: text, textAlign: "center" }]}>
                  Verify Your Phone
                </Text>
                <Text style={{ color: sub, fontSize: 12, textAlign: "center" }}>
                  Enter the 6-digit code sent to{"\n"}
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
                onPress={handleVerifyAndRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep(2)}>
                <Text style={[styles.link, { color: sub }]}>← Change number</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.link, { color: primary }]}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "800" },
  progressRow: { flexDirection: "row", gap: 6, paddingHorizontal: 20, marginTop: 12 },
  progressBar: { flex: 1, height: 4, borderRadius: 99 },
  stepLabel: { fontSize: 10, paddingHorizontal: 20, marginTop: 8, marginBottom: 8 },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 15, fontWeight: "800", marginBottom: 14 },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  roleTitle: { fontSize: 14, fontWeight: "800", marginBottom: 2 },
  label: { fontSize: 11, fontWeight: "700", marginBottom: 6, marginTop: 10 },
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
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  rowBtns: { flexDirection: "row", gap: 10, marginTop: 12 },
  centerBlock: { alignItems: "center", marginBottom: 20, marginTop: 12 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
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