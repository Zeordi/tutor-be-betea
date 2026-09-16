import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type Contract = {
  id: string;
  subject: string;
  studentName: string;
  schedule: string;
  status: string;
  teacher?: { fullName: string };
};

type Me = {
  fullName: string;
  email: string;
};

export default function ParentHomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<Me | null>(null);
  const [upcoming, setUpcoming] = useState<Contract[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      apiRequest<Me>(paths.usersMe),
      apiRequest<Contract[]>(paths.contractsParent),
    ])
      .then(([meData, contracts]) => {
        if (!cancelled) {
          setMe(meData);
          const now = new Date();
          const list = (contracts || [])
            .filter((c) => new Date(c.schedule) >= now)
            .sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime())
            .slice(0, 5);
          setUpcoming(list);
          setActiveCount(list.length);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Home</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Loading…</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Home</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
          <Text style={{ fontSize: 32 }}>⚠️</Text>
          <Text style={{ color: colors.foreground, fontWeight: "700", textAlign: "center" }}>{error}</Text>
          <Pressable onPress={() => window.location.reload()} style={[styles.retry, { backgroundColor: colors.primary }]}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {me ? `Hi, ${me.fullName.split(" ")[0]}` : "Home"}
        </Text>
        <Pressable onPress={() => router.push("/parent/settings")} style={[styles.iconBtn, { borderColor: colors.border }]}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}>
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Stat label="Upcoming" value={String(activeCount)} icon="📅" colors={colors} />
          <Stat label="Children" value="—" icon="👶" colors={colors} />
          <Stat label="Wallet" value="—" icon="💰" colors={colors} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Sessions</Text>
          {upcoming.length === 0 && (
            <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 8 }}>No upcoming sessions.</Text>
          )}
          {upcoming.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.sessionRow, { borderBottomColor: colors.border }]}
              onPress={() => router.push(`/parent/sessions/${c.id}`)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessionTitle, { color: colors.foreground }]}>
                  {c.subject} · {c.studentName}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                  {new Date(c.schedule).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.primary }]}>›</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/parent/tutors")}
        >
          <Text style={styles.fabText}>Find Tutors</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, icon, colors }: { label: string; value: string; icon: string; colors: any }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18, marginTop: 4 }}>{value}</Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "800" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  sectionTitle: { fontSize: 12, fontWeight: "800", marginBottom: 8, letterSpacing: 0.4 },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  sessionTitle: { fontSize: 13, fontWeight: "700" },
  chevron: { fontSize: 18, fontWeight: "700" },
  retry: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  fab: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  fabText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
