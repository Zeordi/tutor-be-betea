import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const CHILDREN = [
  { id: "1", name: "Kidane", grade: "10", curriculum: "National", tutor: "Selamawit T.", subjects: ["Math", "Physics"] },
  { id: "2", name: "Meron", grade: "8", curriculum: "Cambridge", tutor: "Bereket S.", subjects: ["English"] },
];

export default function ChildrenIndexScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

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
        {CHILDREN.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push(`/(parent)/children/${c.id}`)}
          >
            <View style={[styles.avatar, { backgroundColor: primary }]}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>{c.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800" }}>
                {c.name} · Gr.{c.grade}
              </Text>
              <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>
                {c.curriculum} · Tutor: {c.tutor}
              </Text>
              <Text style={{ color: sub, fontSize: 11, marginTop: 4 }}>
                {c.subjects.join(" · ")}
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
});