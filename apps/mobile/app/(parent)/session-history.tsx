import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Contract = {
  id: string;
  status: string;
  agreedAmount: number;
  startDate: string;
  endDate: string;
  teacher: { fullName: string };
  student: { studentName: string; gradeLevel: string };
};

export default function SessionHistoryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<Contract[]>(paths.contractsParent)
      .then((data) => {
        if (!cancelled) setContracts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load session history");
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
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Session History
          </Text>
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
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Session History
          </Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<Contract[]>(paths.contractsParent)
                .then((data) => setContracts(Array.isArray(data) ? data : []))
                .catch((e) => setError(e.message))
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
          Session History
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 14, gap: 10 }}>
        {contracts.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
            No sessions yet.
          </Text>
        )}
        {contracts.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
            onPress={() => router.push(`/(parent)/contract/${c.id}`)}
          >
            <View style={styles.row}>
              <Text style={{ color: text, fontWeight: "800", flex: 1 }}>
                {c.student?.studentName || "Student"} · {c.teacher?.fullName || "Tutor"}
              </Text>
              <Text
                style={{
                  color: c.status === "COMPLETED" ? "#059669" : c.status === "DISPUTED" ? "#DC2626" : primary,
                  fontWeight: "800",
                  fontSize: 11,
                }}
              >
                {c.status.replace("_", " ")}
              </Text>
            </View>
            <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
              {new Date(c.startDate).toLocaleDateString()} · {Number(c.agreedAmount).toLocaleString()} ETB
            </Text>
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
    padding: 14,
    borderBottomWidth: 1,
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  row: { flexDirection: "row", alignItems: "center" },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
