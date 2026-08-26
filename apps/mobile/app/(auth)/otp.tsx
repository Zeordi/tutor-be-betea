import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

export default function OTPScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    // OTP is now handled inside login/register steps
    router.replace("/(auth)/login");
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={{ color: colors.textSecondary }}>Redirecting to login...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
});