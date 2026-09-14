import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
    verificationToken?: string;
  }>();
  const { isDark } = useTheme();

  const [phone, setPhone] = useState((params.phone as string) || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = isDark ? "#0A1628" : "#FFFFFF";
  const card = isDark ? "#112240" : "#FFFFFF";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  const setDigit = (i: number, v: string) => {
    const next = [...otp];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setOtp(next);
  };

  const submit = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Weak password", "Min 6 characters");
      return;
    }
    if (newPassword !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      let verificationToken = params.verificationToken as string | undefined;
      if (!verificationToken) {
        const code = otp.join("");
        if (code.length !== 6) {
          throw new Error("Enter the 6-digit OTP");
        }
        const verify = await api.post<{ verificationToken: string }>(
          "/auth/otp/verify",
          { phoneNumber: phone.trim(), code },
        );
        verificationToken = verify.verificationToken;
      }

      await api.post("/auth/password/reset", {
        phoneNumber: phone.trim(),
        verificationToken,
        newPassword,
      });

      Alert.alert("Success", "Password updated. Please sign in.");
      router.replace("/(auth)/login");
    } catch (e: any) {
      Alert.alert("Reset failed", e.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={{ padding: 24 }}>
        <Text style={[styles.title, { color: text }]}>Reset password</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          placeholderTextColor={sub}
          style={[
            styles.input,
            { borderColor: border, color: text, backgroundColor: card },
          ]}
        />
        {!params.verificationToken && (
          <View style={styles.otpRow}>
            {otp.map((d, i) => (
              <TextInput
                key={i}
                value={d}
                onChangeText={(v) => setDigit(i, v)}
                maxLength={1}
                keyboardType="number-pad"
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
        )}
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          placeholderTextColor={sub}
          secureTextEntry
          style={[
            styles.input,
            { borderColor: border, color: text, backgroundColor: card },
          ]}
        />
        <TextInput
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Confirm password"
          placeholderTextColor={sub}
          secureTextEntry
          style={[
            styles.input,
            { borderColor: border, color: text, backgroundColor: card },
          ]}
        />
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primary }]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Update password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
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
    marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "800" },
});