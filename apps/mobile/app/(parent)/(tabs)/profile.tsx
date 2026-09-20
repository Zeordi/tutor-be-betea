import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

type UserProfile = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: string;
  avatarUrl?: string;
};

export default function ParentProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<UserProfile>(paths.usersMe)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load profile");
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

  const displayName = profile?.fullName || authUser?.fullName || "Parent";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <View style={{ backgroundColor: card, borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: primary, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>{initials}</Text>
            </View>
            <View>
              <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>{displayName}</Text>
              <Text style={{ color: sub, fontSize: 12 }}>Parent · Addis Ababa</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setLoading(true);
              apiRequest<UserProfile>(paths.usersMe)
                .then((data) => setProfile(data))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            }}
            style={{ backgroundColor: primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const items = [
    ["👶", "My Children", "/(parent)/children"],
    ["❤️", "Saved Tutors", "/(parent)/favorites"],
    ["🛡️", "Safety Center", "/(parent)/safety"],
    ["📜", "Session History", "/(parent)/session-history"],
    ["🔔", "Notifications", "/(parent)/notification-settings"],
    ["🎫", "Support", "/(shared)/support"],
    ["⚙️", "Settings", "/(shared)/settings"],
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: card, borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "center" }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: primary, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>{initials}</Text>
          </View>
          <View>
            <Text style={{ color: text, fontWeight: "800", fontSize: 16 }}>{displayName}</Text>
            <Text style={{ color: sub, fontSize: 12 }}>Parent · Addis Ababa</Text>
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
