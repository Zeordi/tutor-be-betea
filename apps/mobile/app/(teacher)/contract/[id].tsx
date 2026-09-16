import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Contract = {
  id: string;
  studentName: string;
  parentName: string;
  subject: string;
  grade: string;
  monthly: number;
  sessionsDone: number;
  sessionsTotal: number;
  status: "Active" | "Pending";
  milestones: { title: string; done: boolean }[];
  startAt: string;
};

export default function TeacherContractScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Contract>(paths.contract(id))
      .then((data) => {
        if (!cancelled) setContract(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load contract");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Contract Details</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !contract) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Contract Details</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error || "Contract not found"}</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: border }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800" }}>Contract Details</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}>
        <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: text, fontSize: 17, fontWeight: "900" }}>{contract.studentName} (Gr.{contract.grade})</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>{contract.subject} · Parent: {contract.parentName}</Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>Contract #{contract.id}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            <Text style={{ fontSize: 10, backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9", color: sub, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: "hidden" }}>
              {contract.monthly} ETB/mo
            </Text>
            <Text style={{ fontSize: 10, backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9", color: sub, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: "hidden" }}>
              {contract.sessionsDone}/{contract.sessionsTotal} sessions
            </Text>
            <Text style={{ fontSize: 10, backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9", color: sub, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: "hidden" }}>
              {contract.status}
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: card, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: text, fontSize: 13, fontWeight: "800", marginBottom: 8 }}>Milestones</Text>
          {contract.milestones?.map((m, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 }}>
              <Text style={{ fontSize: 14 }}>{m.done ? "✅" : "🔲"}</Text>
              <Text style={{ color: m.done ? "#059669" : sub, fontSize: 12 }}>{m.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
