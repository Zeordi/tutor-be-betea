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
    }, 1400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#0A1628" : "#0F766E" }]}>
      <View style={styles.center}>
        <View style={styles.logo}>
          <Text style={{ fontSize: 42 }}>🎓</Text>
        </View>
        <Text style={styles.kicker}>ETHIOPIA’S PREMIER</Text>
        <Text style={styles.brand}>Tutor Be</Text>
        <Text style={styles.name}>BETEA</Text>
        <Text style={styles.tag}>Verified tutors · Safe sessions · Escrow protected</Text>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
      <Text style={styles.foot}>Addis Ababa · Fayda-ready verification</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  kicker: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  brand: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "700", marginTop: 8 },
  name: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", marginTop: 2 },
  tag: { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 12, textAlign: "center" },
  dots: { flexDirection: "row", gap: 6, marginTop: 28 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.35)" },
  dotActive: { width: 22, backgroundColor: "#FFFFFF" },
  foot: {
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    marginBottom: 24,
  },
});