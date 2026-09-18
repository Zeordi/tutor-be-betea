import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type Contract = {
  id: string;
  status: string;
  agreedAmount: number;
  escrowHeldAmount: number;
  startDate: string;
  endDate: string;
  teacher: { fullName: string };
  student: { studentName: string; gradeLevel: string };
};

export default function ContractDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
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
  const headerBg = isDark ? "#0F1B2D" : "#FFFFFF";

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: text }]}>Contract + Escrow</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !contract) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: text }]}>Contract + Escrow</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error || "Contract not found"}</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Contract + Escrow</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={{ color: primary, fontWeight: "800", fontSize: 11 }}>
            {contract.status.replace("_", " ")} · #{contract.id.slice(0, 4)}
          </Text>
          <Text style={[styles.title, { color: text }]}>
            {contract.student?.studentName || "Student"} · {contract.student?.gradeLevel || ""}
          </Text>
          <Text style={{ color: sub, fontSize: 12 }}>Tutor: {contract.teacher?.fullName || "—"}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.label, { color: sub }]}>ESCROW STATUS</Text>
          <Text style={{ color: text, fontSize: 22, fontWeight: "900" }}>
            {Number(contract.escrowHeldAmount || 0).toLocaleString()} ETB
          </Text>
          <Text style={{ color: sub, fontSize: 12, marginTop: 4 }}>
            Held until verified attendance + parent confirm
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    contract.status === "ACTIVE"
                      ? "60%"
                      : contract.status === "PENDING_ESCROW"
                        ? "20%"
                        : "100%",
                },
              ]}
            />
          </View>
          <Text style={{ color: sub, fontSize: 11, marginTop: 6 }}>
            {contract.status === "ACTIVE"
              ? "In progress"
              : contract.status === "PENDING_ESCROW"
                ? "Awaiting escrow payment"
                : "Completed"}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.label, { color: sub }]}>14-DAY REPLACEMENT GUARANTEE</Text>
          <Text style={{ color: text, fontSize: 13, lineHeight: 19 }}>
            Free tutor replacement within 14 days if quality or attendance issues arise.
          </Text>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: primary }]}
            onPress={() => Alert.alert("Replacement", "Replacement request flow")}
          >
            <Text style={styles.btnText}>Request Replacement</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btnOutline, { borderColor: primary }]}
          onPress={() => router.push(`/(parent)/session/${contract.id}`)}
        >
          <Text style={{ color: primary, fontWeight: "800" }}>View Live Session</Text>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 16, fontWeight: "800" },
  card: { borderRadius: 16, padding: 16 },
  title: { fontSize: 16, fontWeight: "800", marginTop: 6 },
  label: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 8 },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(13,148,136,0.15)",
    borderRadius: 99,
    marginTop: 12,
  },
  progressFill: { height: 8, backgroundColor: "#0D9488", borderRadius: 99 },
  btn: { marginTop: 12, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
  btnOutline: { borderWidth: 1.5, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
