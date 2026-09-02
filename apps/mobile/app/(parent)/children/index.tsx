// apps/mobile/app/(parent)/children/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const CHILDREN = [
  { id: "1", name: "Kidane", grade: "10", progress: "87%" },
  { id: "2", name: "Meron", grade: "8", progress: "92%" },
];

export default function MyChildrenScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1 }}>My Children</Text>
        <Text style={{ color: primary, fontWeight: "800" }}>+ Add</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {CHILDREN.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={{ backgroundColor: card, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}
            onPress={() => router.push(`/(parent)/children/${c.id}`)}
          >
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>{c.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800" }}>{c.name}</Text>
              <Text style={{ color: sub, fontSize: 12 }}>Grade {c.grade}</Text>
            </View>
            <Text style={{ color: primary, fontWeight: "900" }}>{c.progress}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}