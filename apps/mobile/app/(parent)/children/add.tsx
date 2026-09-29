import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { apiRequest, paths } from "@/lib/api";

export default function AddChildScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const headerBg = colors.card ?? (isDark ? "#112240" : "#FFFFFF");

  const handleAdd = async () => {
    setError("");
    if (!name.trim() || !grade.trim()) {
      setError("Please enter name and grade.");
      return;
    }

    try {
      setLoading(true);
      await apiRequest(paths.children, {
        method: "POST",
        body: JSON.stringify({
          studentName: name.trim(),
          gradeLevel: grade.trim(),
          curriculum: "NATIONAL_MINISTRY",
        }),
      });

      Alert.alert("Success", "Child added successfully");
      router.back();
    } catch (err: any) {
      setError(err.message || "Failed to add child");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Add Child</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={{ color: "#DC2626", fontSize: 12 }}>{error}</Text> : null}

        <View>
          <Text style={[styles.label, { color: sub }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { color: text, backgroundColor: card, borderColor: border }]}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Yohannes Abebe"
            placeholderTextColor={sub}
          />
        </View>

        <View>
          <Text style={[styles.label, { color: sub }]}>Grade Level</Text>
          <TextInput
            style={[styles.input, { color: text, backgroundColor: card, borderColor: border }]}
            value={grade}
            onChangeText={setGrade}
            placeholder="e.g. Grade 11"
            placeholderTextColor={sub}
          />
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: primary }]}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "800" },
  content: { padding: 16, gap: 12 },
  label: { fontSize: 10, fontWeight: "800", marginBottom: 6, letterSpacing: 0.4 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, fontSize: 13 },
  button: { marginTop: 8, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
