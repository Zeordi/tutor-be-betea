import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Child = {
  id: string;
  studentName: string;
  gradeLevel: string;
  curriculum: string;
  subjects: string[];
};

export default function ChildrenIndexScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Child[]>(paths.children)
      .then((data) => {
        if (!cancelled) setChildren(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load children");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>My Children</Text>
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
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>My Children</Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<Child[]>(paths.children)
                .then((data) => setChildren(Array.isArray(data) ? data : []))
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
        <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>My Children</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: primary }]}
          onPress={() => router.push("/(parent)/children/add")}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
        {children.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 24 }}>
            No children added yet.
          </Text>
        )}
        {children.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push(`/(parent)/children/${c.id}`)}
          >
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>{c.studentName[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800" }}>
                {c.studentName} · Gr.{c.gradeLevel}
              </Text>
              <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>
                {c.curriculum} · {c.subjects.slice(0, 3).join(" · ")}
              </Text>
            </View>
            <Text style={{ color: primary, fontWeight: "700" }}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
  },
  addBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
