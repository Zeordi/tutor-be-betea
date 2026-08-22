import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getToken } from "@/lib/api";

type Job = {
  id: string;
  subjects: string[];
  monthlyBudget: number;
  isUrgentBoost: boolean;
  status: string;
  createdAt: string;
};

export default function TeacherJobsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/jobs`);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    try {
      const token = await getToken();
      // For now we just navigate. Later we can add a real apply endpoint.
      router.push(`/(teacher)/apply/${jobId}`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Available Jobs</Text>
        <Text style={{ color: colors.textSecondary }}>Jobs matching your subjects</Text>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.subjects, { color: colors.text }]}>
                {item.subjects?.join(" • ")}
              </Text>
              {item.isUrgentBoost && (
                <Text style={styles.urgent}>⚡ Urgent</Text>
              )}
            </View>

            <Text style={{ color: colors.textSecondary, marginTop: 6 }}>
              Budget: ETB {Number(item.monthlyBudget).toLocaleString()}/month
            </Text>

            <Pressable
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => handleApply(item.id)}
            >
              <Text style={styles.applyButtonText}>View & Apply</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: colors.textSecondary, marginTop: 40 }}>
            No open jobs at the moment
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  card: { borderRadius: 16, padding: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  subjects: { fontSize: 16, fontWeight: "700", flex: 1 },
  urgent: {
    backgroundColor: "#FEF3C7",
    color: "#D97706",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  applyButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: { color: "#fff", fontWeight: "700" },
});
