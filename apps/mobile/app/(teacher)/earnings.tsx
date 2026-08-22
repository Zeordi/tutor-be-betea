import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getToken } from "@/lib/api";

export default function EarningsScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    totalEarned: 0,
    recentPayouts: [] as any[],
  });

  const loadEarnings = useCallback(async () => {
    try {
      const token = await getToken();
      // In the future we will have a real /teachers/me/earnings endpoint
      // For now we show a clean structure
      setData({
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        recentPayouts: [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEarnings();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <Text style={[styles.title, { color: colors.text }]}>Earnings</Text>

        {/* Available Balance */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            ETB {data.availableBalance.toLocaleString()}
          </Text>
          <Text style={styles.balanceSub}>Ready for payout</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ETB {data.pendingBalance.toLocaleString()}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ETB {data.totalEarned.toLocaleString()}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>Total Earned</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Payouts</Text>

        {data.recentPayouts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
              No payouts yet.{"\n"}Complete sessions to start earning.
            </Text>
          </View>
        ) : (
          data.recentPayouts.map((payout, index) => (
            <View
              key={index}
              style={[styles.payoutItem, { backgroundColor: colors.surface }]}
            >
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                ETB {payout.amount}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                {payout.date}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  balanceLabel: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  balanceAmount: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 6 },
  balanceSub: { color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  payoutItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
