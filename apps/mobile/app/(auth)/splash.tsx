import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

export default function SplashScreen() {
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/(auth)/role-select");
    }, 1200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#0A1628" : "#0D9488" }]}>
      <View style={styles.center}>
        <View style={styles.logo}>
          <Text style={{ fontSize: 40 }}>🎓</Text>
        </View>
        <Text style={styles.brand}>Tutor Be</Text>
        <Text style={styles.name}>BETEA</Text>
        <Text style={styles.tag}>Ethiopia’s verified tutoring platform</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  brand: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "800", letterSpacing: 3 },
  name: { color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginTop: 2 },
  tag: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 10 },
});