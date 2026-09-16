// apps/mobile/app/(teacher)/(tabs)/profile.tsx
import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type User = {
  fullName: string;
  email: string;
  role: string;
};

export default function TeacherProfileScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiRequest<User>(paths.usersMe)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const displayName = profile?.fullName || user?.fullName || "Teacher";

  const items = [
    ["🛡️", "Verification Status", "/(teacher)/verification"],
    ["📊", "Analytics", "/(teacher)/analytics"],
    ["📅", "Calendar", "/(teacher)/calendar"],
    ["📋", "My Applications", "/(teacher)/applications"],
    ["💰", "Earnings", "/(teacher)/earnings"],
    ["🔗", "Connects", "/(teacher)/connects"],
    ["🥇", "Trust Badges", "/(teacher)/badges"],
    ["⚙️", "Settings", "/(shared)/settings"],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <View style={{ backgroundColor: card, borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: primary, alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>{displayName[0]}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>{displayName}</Text>
            <Text style={{ color: sub, fontSize: 12 }}>Tutor · Bole, Addis Ababa</Text>
            <Text style={{ color: primary, fontSize: 11, fontWeight: "700", marginTop: 4 }}>🛡️ Verified · 🥇 Gold</Text>
          </View>
        </View>
        {items.map(([icon, label, href]) => (
          <TouchableOpacity
            key={label}
            style={{ backgroundColor: card, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}
            onPress={() => router.push(href as any)}
          >
            <Text style={{ fontSize: 18 }}>{icon}</Text>
            <Text style={{ color: text, fontWeight: "700", flex: 1 }}>{label}</Text>
            <Text style={{ color: sub }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}