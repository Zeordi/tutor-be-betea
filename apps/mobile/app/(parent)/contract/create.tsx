import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getToken } from "@/lib/api";

export default function CreateContractScreen() {
  const { teacherId, studentId } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/contracts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teacherId,
          studentId,
          agreedAmount: 4500, // In real app this comes from form
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create contract");

      const contract = await res.json();

      // Immediately fund escrow (or navigate to payment screen)
      await fetch(`\( {process.env.EXPO_PUBLIC_API_URL}/contracts/ \){contract.id}/fund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Contract created and escrow funded!");
      router.replace(`/(parent)/contract/${contract.id}`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Confirm Hiring</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8, lineHeight: 22 }}>
          You are about to create a contract. Funds will be held in escrow and only released
          after verified sessions. You are protected by a 14-day replacement guarantee.
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Contract & Fund Escrow</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  button: {
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
