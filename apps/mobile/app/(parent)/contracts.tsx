import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { apiRequest, paths } from "@/lib/api";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

type Contract = {
  id: string;
  status: string;
  agreedAmount: number;
  escrowHeldAmount: number;
  startDate: string;
  endDate: string;
};

export default function ContractsListScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadContracts = useCallback(async () => {
    try {
      setError("");
      const data = await apiRequest<Contract[]>(paths.contractsParent);
      setContracts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load contracts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { bg: isDark ? "rgba(16,185,129,0.2)" : "#D1FAE5", fg: isDark ? "#34D399" : "#047857" };
      case "PENDING_ESCROW":
        return { bg: isDark ? "rgba(245,158,11,0.2)" : "#FEF3C7", fg: isDark ? "#FCD34D" : "#D97706" };
      case "COMPLETED":
        return { bg: isDark ? "#334155" : "#F1F5F9", fg: isDark ? "#94A3B8" : "#64748B" };
      default:
        return { bg: isDark ? "#334155" : "#F1F5F9", fg: colors.mutedForeground };
    }
  };

  if (error && !loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Contracts</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 12 }}>{error}</Text>
          <Pressable onPress={loadContracts} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Contracts</Text>
      </View>

      {loading ? (
        <View style={{ padding: 16 }}>
          <LoadingSkeleton height={100} />
          <LoadingSkeleton height={100} />
        </View>
      ) : (
        <FlatList
          data={contracts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadContracts();
          }}
          renderItem={({ item }) => {
            const statusStyle = getStatusStyle(item.status);
            return (
              <Pressable
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(`/(parent)/contract/${item.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.amount, { color: colors.text }]}>
                    ETB {Number(item.agreedAmount).toLocaleString()}
                  </Text>
                  <View style={[styles.statusChip, { backgroundColor: statusStyle.bg }]}>
                    <Text style={{ color: statusStyle.fg, fontSize: 10, fontWeight: "700" }}>
                      {item.status.replace("_", " ")}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
                  Escrow: ETB {Number(item.escrowHeldAmount).toLocaleString()}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              title="No contracts yet"
              description="When you hire a tutor, your contracts will appear here."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: { fontSize: 17, fontWeight: "700" },
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
