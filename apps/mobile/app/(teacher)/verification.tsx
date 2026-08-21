// apps/mobile/app/(teacher)/verification.tsx
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerificationScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Document Verification</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Upload ID, Degree & Liveness Selfie to the secure Document Vault
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700" },
});
