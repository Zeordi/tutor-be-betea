import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
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

type ProviderStatus = {
  provider: string;
  available: boolean;
};

export default function ParentWalletScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus[]>([]);
  const [paying, setPaying] = useState(false);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiRequest<WalletData>(paths.wallet),
      apiRequest<ProviderStatus[]>("/payments/status/check"),
    ])
      .then(([walletData, providers]) => {
        if (!cancelled) {
          setWallet(walletData);
          setProviderStatus(Array.isArray(providers) ? providers : []);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load wallet");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const anyProviderAvailable = providerStatus.some((p) => p.available);

  const handleTopUp = async () => {
    if (!anyProviderAvailable) {
      Alert.alert("Unavailable", "No payment provider is configured. Contact support.");
      return;
    }
    setPaying(true);
    try {
      const result = await apiRequest<{ redirectUrl?: string }>(paths.paymentsInitiate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500, provider: "TELEBIRR" }),
      });
      if (result.redirectUrl) {
        Alert.alert("Redirect", "Complete payment in the provider checkout.");
      } else {
        Alert.alert("Initiated", "Payment initiated. Check your wallet for updates.");
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
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<WalletData>(paths.wallet)
                .then((data) => setWallet(data))
                .catch((err) => setError(err.message))
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
          <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
            <TouchableOpacity
              style={[styles.heroBtn, !anyProviderAvailable && { opacity: 0.5 }]}
              onPress={handleTopUp}
              disabled={!anyProviderAvailable || paying}
            >
              <Text style={styles.heroBtnText}>{paying ? "Processing…" : "Top up"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => router.push("/(parent)/contracts")}
            >
              <Text style={styles.heroBtnText}>View escrow</Text>
            </TouchableOpacity>
          </View>
          {!anyProviderAvailable && (
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 8 }}>
              Payments are currently unavailable. Contact support to enable a provider.
            </Text>
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
