import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

export default function OTPScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    // OTP is handled inside login + register (Figma flow)
    router.replace("/(auth)/login");
  }, [router]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0A1628" : "#FFFFFF" },
      ]}
    >
      <View style={styles.content}>
        <Text style={{ color: isDark ? "#94A3B8" : "#64748B" }}>
          Redirecting…
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
});