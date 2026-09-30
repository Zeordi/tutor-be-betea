import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  teacherProfile: {
    isVerified: boolean;
    idVerified: boolean;
    degreeVerified: boolean;
    badgeLevel: string;
    connectsBalance: number;
  } | null;
};

function getInitials(name: string) {
  if (!name) return "T";
  return name
    .split(" ")
    .map((n) => (n || "")[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
  const primary = "#2563EB";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiRequest<User>(paths.usersMe)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const displayName = profile?.fullName || user?.fullName || "Teacher";
  const initials = getInitials(displayName);
  const tp = profile?.teacherProfile;
  const verificationBadges = [
    tp?.idVerified ? "ID Verified" : null,
    tp?.degreeVerified ? "Degree Verified" : null,
    tp?.isVerified ? "Profile Verified" : null,
  ].filter(Boolean);

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
        <View style={{ backgroundColor: card, borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "center", borderWidth: 1, borderColor: isDark ? "#1E3A5F" : "#E2E8F0" }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: primary, alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>{initials}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>{displayName}</Text>
            <Text style={{ color: sub, fontSize: 12 }}>{profile?.role || "Tutor"}</Text>
            {verificationBadges.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {verificationBadges.map((badge) => (
                  <View key={badge} style={{ backgroundColor: isDark ? "#064E3B" : "#D1FAE5", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                    <Text style={{ color: isDark ? "#A7F3D0" : "#065F46", fontSize: 10, fontWeight: "700" }}>{badge}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        {items.map(([icon, label, href]) => (
          <TouchableOpacity
            key={label}
            style={{ backgroundColor: card, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: isDark ? "#1E3A5F" : "#E2E8F0" }}
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
