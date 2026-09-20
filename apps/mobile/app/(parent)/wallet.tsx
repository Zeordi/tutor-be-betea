import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Transaction = {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  externalRef: string | null;
  createdAt: string;
  contractId: string | null;
};

type WalletData = {
  escrowHeld: number;
  transactions: Transaction[];
};

type ProvidersResponse = Record<string, boolean>;

export default function ParentWalletScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [providerStatus, setProviderStatus] = useState<ProvidersResponse>({});
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [paying, setPaying] = useState(false);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  const refreshWallet = async () => {
    setLoading(true);
    setError("");
    try {
      const [walletData, providers] = await Promise.all([
        apiRequest<WalletData>(paths.wallet),
        apiRequest<ProvidersResponse>("/payments/status/check"),
      ]);
      setWallet(walletData);
      setProviderStatus(providers || {});
      const firstAvailable = Object.entries(providers || {}).find(([, v]) => v)?.[0];
      if (firstAvailable) setSelectedProvider(firstAvailable);

      const pendingPayments = (walletData.transactions || []).filter((t) => t.status === "PENDING");
      for (const payment of pendingPayments) {
        apiRequest(paths.paymentReconcile(payment.id), { method: "POST" }).catch(() => {});
      }
    } catch (err: any) {
      setError(err.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    refreshWallet();
    return () => { cancelled = true; };
  }, []);

  const availableProviders = Object.entries(providerStatus)
    .filter(([, available]) => available)
    .map(([provider]) => provider);

  const handleTopUp = async () => {
    if (!selectedProvider || !providerStatus[selectedProvider]) {
      Alert.alert("Unavailable", "No payment provider is configured. Contact support.");
      return;
    }
    setPaying(true);
    try {
      const result = await apiRequest<{ redirectUrl?: string; payment?: any }>(paths.paymentsInitiate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500, provider: selectedProvider }),
      });

      if (result.redirectUrl) {
        const canOpen = await Linking.canOpenURL(result.redirectUrl);
        if (canOpen) {
          await Linking.openURL(result.redirectUrl);
        } else {
          Alert.alert("Redirect", "Complete payment in the provider checkout.");
        }
      } else if (result.payment?.id) {
        Alert.alert("Initiated", "Payment initiated. Check your wallet for updates.");
        refreshWallet();
      } else {
        setError("Payment initiated but no redirect received. Please check your wallet.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  const successTransactions = (wallet?.transactions || []).filter((t) => t.status === "SUCCESS");
  const availableBalance = successTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const escrowHeld = wallet?.escrowHeld || 0;

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Wallet & Escrow
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Wallet & Escrow
          </Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={refreshWallet}
            style={[styles.retryBtn, { backgroundColor: primary }]}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
          Wallet & Escrow
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={styles.hero}>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Available balance</Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 4 }}>
            {availableBalance.toLocaleString()} ETB
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 6 }}>
            {escrowHeld.toLocaleString()} ETB currently in escrow
          </Text>

          {availableProviders.length > 0 ? (
            <View style={{ marginTop: 14, gap: 8 }}>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginBottom: 4 }}>
                    Provider
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                    {availableProviders.map((p) => (
                      <TouchableOpacity
                        key={p}
                        onPress={() => setSelectedProvider(p)}
                        style={[
                          styles.providerChip,
                          selectedProvider === p && styles.providerChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.providerChipText,
                            selectedProvider === p && styles.providerChipTextActive,
                          ]}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                <TouchableOpacity
                  style={[styles.heroBtn]}
                  onPress={handleTopUp}
                  disabled={paying}
                >
                  <Text style={styles.heroBtnText}>{paying ? "Processing…" : "Top up 500 ETB"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.heroBtn}
                  onPress={() => router.push("/(parent)/contracts")}
                >
                  <Text style={styles.heroBtnText}>View escrow</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 14 }}>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                Payments are currently unavailable. Contact support to enable a provider.
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.section, { color: sub }]}>RECENT</Text>
        {(wallet?.transactions || []).length === 0 && (
          <Text style={{ color: sub, textAlign: "center", paddingVertical: 12 }}>
            No transactions yet.
          </Text>
        )}
        {(wallet?.transactions || []).map((x) => (
          <View
            key={x.id}
            style={[styles.tx, { backgroundColor: card, borderColor: border }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>
                {x.provider} · {x.status}
              </Text>
              <Text style={{ color: sub, fontSize: 10 }}>
                {new Date(x.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text
              style={{
                color: x.status === "SUCCESS" ? "#10B981" : text,
                fontWeight: "800",
              }}
            >
              {Number(x.amount).toLocaleString()} ETB
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  hero: {
    backgroundColor: "#0F766E",
    borderRadius: 20,
    padding: 20,
  },
  heroBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  heroBtnText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  providerChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  providerChipActive: {
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  providerChipText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 10,
    fontWeight: "700",
  },
  providerChipTextActive: {
    color: "#fff",
  },
  section: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  tx: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
