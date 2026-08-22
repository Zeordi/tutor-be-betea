import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getToken } from "@/lib/api";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

type Child = {
  id: string;
  studentName: string;
  gradeLevel: string;
  curriculum: string;
};

export default function ChildrenListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadChildren = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/parents/children`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChildren(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Children</Text>
        <Pressable onPress={() => router.push("/(parent)/children/add")}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>+ Add</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={{ padding: 16 }}>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </View>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadChildren();
          }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.card, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/(parent)/children/${item.id}`)}
            >
              <Text style={[styles.name, { color: colors.text }]}>{item.studentName}</Text>
              <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                {item.gradeLevel} • {item.curriculum.replace("_", " ")}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No children added yet"
              description="Add your children to start posting jobs and tracking progress."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "700" },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  name: { fontSize: 17, fontWeight: "700" },
});
