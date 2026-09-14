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
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = isDark ? "#0A1628" : "#FFFFFF";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const inputBg = isDark ? "#112240" : "#F8FAFC";

  const submit = async () => {
    if (!phone.trim()) {
      Alert.alert("Phone required", "Enter your account phone number.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/password/forgot", {
        phoneNumber: phone.trim(),
      });
      router.push({
        pathname: "/(auth)/reset-password",
        params: { phone: phone.trim() },
      });
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not send code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.body}>
        <View style={[styles.logo, { backgroundColor: primary + "22" }]}>
          <Text style={{ fontSize: 22 }}>🔐</Text>
        </View>
        <Text style={[styles.title, { color: text }]}>Forgot password</Text>
        <Text style={{ color: sub, textAlign: "center", marginBottom: 20 }}>
          We will send an OTP via AfroMessage
        </Text>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: inputBg, borderColor: border },
          ]}
        >
          <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>
            🇪🇹 +251
          </Text>
          <View style={[styles.sep, { backgroundColor: border }]} />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="91 234 5678"
            placeholderTextColor={sub}
            keyboardType="phone-pad"
            style={[styles.input, { color: text }]}
          />
        </View>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primary }]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Send OTP</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: primary, textAlign: "center", marginTop: 16 }}>
            ← Back to login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  sep: { width: 1, height: 18 },
  input: { flex: 1, fontSize: 14 },
  btn: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});