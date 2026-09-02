import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

export default function RoleSelectScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const goRegister = (role: "PARENT" | "TEACHER") => {
    router.push({
      pathname: "/(auth)/register",
      params: { role },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#0A1628" : "#FFFFFF" }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.brand, { color: colors.primary || "#0D9488" }]}>Tutor Be Betea</Text>
        <Text style={[styles.title, { color: isDark ? "#F0FAFA" : "#0D2B2A" }]}>
          How will you use Tutor Be Betea?
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? "#94A3B8" : "#64748B" }]}>
          Choose your role to continue
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => goRegister("PARENT")}
          style={[
            styles.card,
            {
              borderColor: "#14B8A6",
              backgroundColor: isDark ? "rgba(13,148,136,0.15)" : "#F0FDFA",
            },
          ]}
        >
          <Text style={styles.emoji}>👨‍👩‍👧</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: isDark ? "#F0FAFA" : "#0D2B2A" }]}>
              Parent / Guardian
            </Text>
            <Text style={[styles.cardDesc, { color: isDark ? "#94A3B8" : "#64748B" }]}>
              Find verified tutors for your children
            </Text>
          </View>
          <Text style={{ color: "#0D9488", fontWeight: "800" }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => goRegister("TEACHER")}
          style={[
            styles.card,
            {
              borderColor: isDark ? "#1E3A5F" : "#E2E8F0",
              backgroundColor: isDark ? "#112240" : "#FFFFFF",
            },
          ]}
        >
          <Text style={styles.emoji}>🧑‍🏫</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: isDark ? "#F0FAFA" : "#0D2B2A" }]}>
              Tutor / Teacher
            </Text>
            <Text style={[styles.cardDesc, { color: isDark ? "#94A3B8" : "#64748B" }]}>
              Earn income teaching students near you
            </Text>
          </View>
          <Text style={{ color: isDark ? "#94A3B8" : "#64748B", fontWeight: "800" }}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")} style={{ marginTop: 24 }}>
          <Text style={[styles.link, { color: "#0D9488" }]}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 40 },
  brand: { fontSize: 14, fontWeight: "800", marginBottom: 12, letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  subtitle: { fontSize: 13, marginBottom: 28 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 2,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  emoji: { fontSize: 32 },
  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  cardDesc: { fontSize: 12, lineHeight: 18 },
  link: { textAlign: "center", fontSize: 13, fontWeight: "700" },
});