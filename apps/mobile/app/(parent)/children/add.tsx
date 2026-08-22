import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getToken } from "@/lib/api";

export default function AddChildScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name || !grade) {
      Alert.alert("Missing fields", "Please enter name and grade");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/parents/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentName: name,
          gradeLevel: grade,
          curriculum: "NATIONAL_MINISTRY",
        }),
      });

      if (!res.ok) throw new Error("Failed to add child");

      Alert.alert("Success", "Child added successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Add Child</Text>

        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Yohannes Abebe"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Grade Level</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={grade}
          onChangeText={setGrade}
          placeholder="e.g. Grade 11"
          placeholderTextColor={colors.textSecondary}
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Child</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
