import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const PLANS = [
  {
    name: "Basic",
    price: "500",
    features: ["3 sessions/mo", "Standard matching", "2 Connects"],
    current: false,
    popular: false,
  },
  {
    name: "Premium",
    price: "1,800",
    features: ["10 sessions/mo", "AI matching", "Multi-child", "10 Connects"],
    current: true,
    popular: true,
  },
  {
    name: "Elite",
    price: "4,200",
    features: ["Unlimited sessions", "Priority matching", "Replacement guarantee", "30 Connects"],
    current: false,
    popular: false,
  },
];

export default function SubscriptionScreen() {
  const { isDark } = useTheme();
  const router =
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Choose Your Plan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {PLANS.map((plan) => (
          <View
            key={plan.name}
            style={[
              styles.card,
              {
                backgroundColor: card,
                borderColor: plan.popular ? primary : border,
                borderWidth: plan.popular ? 2 : 1,
              },
            ]}
          >
            <View style={styles.rowBetween}>
              <Text style={{ color: text, fontWeight: "900", fontSize: 16 }}>{plan.name}</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: primary, fontWeight: "900", fontSize: 20 }}>{plan.price}</Text>
                <Text style={{ color: sub, fontSize: 10 }}>ETB/mo</Text>
              </View>
            </View>
            {plan.features.map((f) => (
              <Text key={f} style={{ color: sub, fontSize: 12, marginTop: 4 }}>
                ✓ {f}
              </Text>
            ))}
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: plan.current ? primary : "transparent",
                  borderColor: primary,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text
                style={{
                  color: plan.current ? "#fff" : primary,
                  fontWeight: "800",
                  fontSize: 12,
                }}
              >
                {plan.current ? "✓ Current Plan" : `Upgrade to ${plan.name}`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 16, fontWeight: "800" },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 18, padding: 16 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  btn: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});