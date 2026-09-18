import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type LedgerEntry = {
  id: string;
  delta: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
};

type ConnectsData = {
  balance: number;
  ledger: LedgerEntry[];
};

export default function ConnectsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ConnectsData | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<ConnectsData>(paths.connectsBalance)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load connects");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const handleTopUp = async () => {
    const amount = Number(topUpAmount);
    if (!amount || amount < 1) {
      Alert.alert("Invalid amount", "Enter a valid amount");
      return;
    }
    try {
      setTopUpLoading(true);
      const res = await apiRequest<{ balance: number }>(paths.connectsTopUp, {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              balance: res.balance,
              ledger: [
                {
                  id: `topup-${Date.now()}`,
                  delta: amount,
                  reason: "TOP_UP",
                  balanceAfter: res.balance,
                  createdAt: new Date().toISOString(),
                },
                ...prev.ledger,
              ],
            }
          : prev,
      );
      setTopUpAmount("");
      Alert.alert("Success", `Topped up ${amount} Connects`);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Top-up failed");
    } finally {
      setTopUpLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>Connects</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>Connects</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error || "No connects data"}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<ConnectsData>(paths.connectsBalance)
                .then((res) => setData(res))
                .catch((e) => setError(e.message))
                .finally(() => setLoading(false));
            }}
            style={{ backgroundColor: primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>Connects</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        <View style={{ backgroundColor: primary, borderRadius: 18, padding: 18, alignItems: "center" }}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Available Connects</Text>
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "900", marginTop: 4 }}>{data.balance}</Text>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 4 }}>Used for job applications</Text>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>TOP UP</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={topUpAmount}
              onChangeText={setTopUpAmount}
              keyboardType="number-pad"
              placeholder="Amount"
              placeholderTextColor={sub}
              style={{ flex: 1, borderWidth: 1, borderColor: border, borderRadius: 12, padding: 12, color: text, backgroundColor: isDark ? "#1E3A5F" : "#F8FAFC" }}
            />
            <TouchableOpacity
              style={{ backgroundColor: primary, borderRadius: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" }}
              onPress={handleTopUp}
              disabled={topUpLoading}
            >
              {topUpLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>Top Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.section, { color: sub }]}>TRANSACTIONS</Text>
          {data.ledger.length === 0 && (
            <Text style={{ color: sub, fontSize: 12 }}>No transactions yet</Text>
          )}
          {data.ledger.map((entry) => (
            <View key={entry.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: border }}>
              <View>
                <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>{entry.reason.replace(/_/g, " ")}</Text>
                <Text style={{ color: sub, fontSize: 10 }}>{new Date(entry.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={{ color: entry.delta >= 0 ? "#10B981" : text, fontWeight: "800", fontSize: 13 }}>
                {entry.delta >= 0 ? "+" : ""}{entry.delta}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 10 },
});
