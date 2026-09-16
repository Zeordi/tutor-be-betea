import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxChildren: number;
  features: string[];
};

type Subscription = {
  id: string;
  status: string;
  currentPlan: SubscriptionPlan;
  startDate: string;
  nextBillingDate: string;
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sub, setSub] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiRequest<Subscription>(paths.subscriptionMine),
      apiRequest<SubscriptionPlan[]>(paths.subscriptionsPlans),
    ])
      .then(([s, p]) => {
        if (!cancelled) {
          setSub(s || null);
          setPlans(Array.isArray(p) ? p : []);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load subscription");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: text }]}>Choose Your Plan</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: text }]}>Choose Your Plan</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              Promise.all([
                apiRequest<Subscription>(paths.subscriptionMine),
                apiRequest<SubscriptionPlan[]>(paths.subscriptionsPlans),
              ])
                .then(([s, p]) => {
                  setSub(s || null);
                  setPlans(Array.isArray(p) ? p : []);
                })
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            style={[styles.retryBtn, { backgroundColor: primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentPlanName = sub?.currentPlan?.name || "";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: text }]}>Choose Your Plan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {sub && (
          <View style={[styles.currentPlan, { backgroundColor: card, borderColor: primary }]}>
            <Text style={{ color: text, fontWeight: "800", fontSize: 13 }}>CURRENT PLAN</Text>
            <Text style={{ color: text, fontWeight: "900", fontSize: 18, marginTop: 4 }}>
              {sub.currentPlan.name}
            </Text>
            <Text style={{ color: sub, fontSize: 12 }}>
              {sub.currentPlan.price.toLocaleString()} {sub.currentPlan.currency}/mo · Next billing:{" "}
              {new Date(sub.nextBillingDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {plans.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 24 }}>
            No plans available.
          </Text>
        )}

        {plans.map((plan) => {
          const isCurrent = currentPlanName === plan.name;
          return (
            <View
              key={plan.id}
              style={[
                styles.card,
                {
                  backgroundColor: card,
                  borderColor: isCurrent ? primary : border,
                  borderWidth: isCurrent ? 2 : 1,
                },
              ]}
            >
              <View style={styles.rowBetween}>
                <Text style={{ color: text, fontWeight: "900", fontSize: 16 }}>{plan.name}</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ color: primary, fontWeight: "900", fontSize: 20 }}>
                    {plan.price.toLocaleString()}
                  </Text>
                  <Text style={{ color: sub, fontSize: 10 }}>
                    {plan.currency}/{plan.billingCycle === "yearly" ? "yr" : "mo"}
                  </Text>
                </View>
              </View>
              <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>Up to {plan.maxChildren} children</Text>
              {plan.features.map((f) => (
                <Text key={f} style={{ color: sub, fontSize: 12, marginTop: 4 }}>
                  ✓ {f}
                </Text>
              ))}
              <TouchableOpacity
                style={[
                  styles.btn,
                  {
                    backgroundColor: isCurrent ? primary : "transparent",
                    borderColor: primary,
                    borderWidth: 1.5,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isCurrent ? "#fff" : primary,
                    fontWeight: "800",
                    fontSize: 12,
                  }}
                >
                  {isCurrent ? "✓ Current Plan" : `Upgrade to ${plan.name}`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
  currentPlan: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
