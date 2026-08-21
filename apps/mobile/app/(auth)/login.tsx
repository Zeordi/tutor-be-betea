import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme"; // will be created later
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Login to Tutor Be Betea
        </Text>

        {/* TODO: Add Phone / Email input + Password + Login button */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
});
