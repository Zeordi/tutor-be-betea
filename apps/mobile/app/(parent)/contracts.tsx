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
  const { colors } = useTheme();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#16A34A";
      case "PENDING_ESCROW":
        return "#D97706";
      case "COMPLETED":
        return "#64748B";
      default:
        return colors.textSecondary;
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
          renderItem={({ item }) => (
            <Pressable
              style={[styles.card, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/(parent)/contract/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.amount, { color: colors.text }]}>
                  ETB {Number(item.agreedAmount).toLocaleString()}
                </Text>
                <Text style={{ color: getStatusColor(item.status), fontWeight: "600" }}>
                  {item.status.replace("_", " ")}
                </Text>
              </View>
              <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
                Escrow: ETB {Number(item.escrowHeldAmount).toLocaleString()}
              </Text>
            </Pressable>
          )}
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
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: { fontSize: 17, fontWeight: "700" },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
