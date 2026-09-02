import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const JOBS = [
  { id: "1", title: "Grade 12 Physics Tutor", area: "Bole", dist: "1.5 km", rate: "500 ETB/hr", apps: 12, connects: 2, urgent: true, boost: true, subjects: ["Physics", "Math"] },
  { id: "2", title: "Mathematics – Grade 9 & 10", area: "Kazanchis", dist: "3.2 km", rate: "400 ETB/hr", apps: 8, connects: 1, urgent: false, boost: false, subjects: ["Math"] },
  { id: "3", title: "Chemistry + Biology Combo", area: "Arat Kilo", dist: "4.1 km", rate: "450 ETB/hr", apps: 5, connects: 1, urgent: true, boost: false, subjects: ["Chemistry", "Biology"] },
];

export default function AvailableJobsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [filter, setFilter] = useState(0);
  const filters = ["All", "Math", "Physics", "Chemistry", "Near Me"];

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ color: text, fontSize: 18, fontWeight: "800" }}>Available Jobs</Text>
          <Text style={{ color: "#D97706", fontWeight: "800", fontSize: 12 }}>🔗 24 Connects</Text>
        </View>
        <View style={{ backgroundColor: isDark ? "#112240" : "#F1F5F9", borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
          <Text>🔍</Text>
          <TextInput placeholder="Search jobs..." placeholderTextColor={sub} style={{ flex: 1, color: text, fontSize: 13 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {filters.map((f, i) => (
            <TouchableOpacity key={f} onPress={() => setFilter(i)} style={{
              marginRight: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
              backgroundColor: filter === i ? primary : (isDark ? "#112240" : "#F1F5F9"),
            }}>
              <Text style={{ color: filter === i ? "#fff" : sub, fontSize: 11, fontWeight: "700" }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }}>
        <Text style={{ color: sub, fontSize: 11 }}>38 jobs matching your profile</Text>
        {JOBS.map((j) => (
          <TouchableOpacity
            key={j.id}
            style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}
            onPress={() => router.push(`/(teacher)/apply/${j.id}`)}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {j.urgent && <Text style={{ fontSize: 10, backgroundColor: "#FEE2E2", color: "#DC2626", paddingHorizontal: 6, borderRadius: 99, overflow: "hidden", fontWeight: "700" }}>🔥 Urgent</Text>}
                {j.boost && <Text style={{ fontSize: 10, backgroundColor: "#FEF3C7", color: "#D97706", paddingHorizontal: 6, borderRadius: 99, overflow: "hidden", fontWeight: "700" }}>🚀 Boost</Text>}
              </View>
              <Text style={{ color: sub, fontSize: 10 }}>📍 {j.area} · {j.dist}</Text>
            </View>
            <Text style={{ color: text, fontWeight: "800", marginTop: 8 }}>{j.title}</Text>
            <View style={{ flexDirection: "row", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
              {j.subjects.map((s) => (
                <Text key={s} style={{ fontSize: 10, backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9", color: sub, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, overflow: "hidden" }}>{s}</Text>
              ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
              <Text style={{ color: primary, fontWeight: "900" }}>{j.rate}</Text>
              <Text style={{ color: sub, fontSize: 11 }}>{j.apps} applied · 🔗 {j.connects}</Text>
            </View>
            <View style={{ backgroundColor: primary, borderRadius: 12, paddingVertical: 10, alignItems: "center", marginTop: 10 }}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Apply — Use {j.connects} Connect{j.connects > 1 ? "s" : ""}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}