import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getToken } from "@/lib/api";

export default function EditTeacherProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [subjects, setSubjects] = useState("");
  const [grades, setGrades] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/teachers/me/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setBio(data.bio || "");
        setHourlyRate(String(data.hourlyRate || ""));
        setMonthlyRate(String(data.monthlyRate || ""));
        setSubjects((data.subjects || []).join(", "));
        setGrades((data.grades || []).join(", "));
      } catch (error) {
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getToken();

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/teachers/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          hourlyRate: Number(hourlyRate),
          monthlyRate: Number(monthlyRate),
          subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
          grades: grades.split(",").map((g) => g.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>

        <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="Tell parents about your experience..."
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Hourly Rate (ETB)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={hourlyRate}
          onChangeText={setHourlyRate}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Monthly Rate (ETB)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={monthlyRate}
          onChangeText={setMonthlyRate}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Subjects (comma separated)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={subjects}
          onChangeText={setSubjects}
          placeholder="Mathematics, Physics, Chemistry"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Grades (comma separated)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
          value={grades}
          onChangeText={setGrades}
          placeholder="Grade 9, Grade 10, Grade 11"
          placeholderTextColor={colors.textSecondary}
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 32,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
