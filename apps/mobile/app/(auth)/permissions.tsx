import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const PERMS = [
  {
    key: "location",
    icon: "📍",
    label: "Location",
    desc: "Required for 150m geofenced attendance and live session safety.",
  },
  {
    key: "notifications",
    icon: "🔔",
    label: "Notifications",
    desc: "Session reminders, escrow updates, and safety alerts.",
  },
  {
    key: "camera",
    icon: "📷",
    label: "Camera",
    desc: "Upload Fayda ID, degrees, and liveness selfies securely.",
  },
];

export default function PermissionsScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    location: true,
    notifications: true,
    camera: true,
  });

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={[styles.title, { color: text }]}>App permissions</Text>
        <Text style={{ color: sub, marginTop: 6, lineHeight: 20, marginBottom: 18 }}>
          Enable these for safe sessions, verification, and reliable attendance.
        </Text>

        {PERMS.map((p) => (
          <View
            key={p.key}
            style={[styles.card, { backgroundColor: card, borderColor: border }]}
          >
            <Text style={{ fontSize: 22 }}>{p.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontWeight: "800" }}>{p.label}</Text>
              <Text style={{ color: sub, fontSize: 12, marginTop: 2, lineHeight: 17 }}>
                {p.desc}
              </Text>
            </View>
            <Switch
              value={!!enabled[p.key]}
              onValueChange={(v) => setEnabled((s) => ({ ...s, [p.key]: v }))}
              trackColor={{ true: primary, false: border }}
            />
          </View>
        ))}

        <View style={[styles.note, { backgroundColor: isDark ? "rgba(13,148,136,0.15)" : "#F0FDFA" }]}>
          <Text style={{ color: primary, fontSize: 12, fontWeight: "700" }}>
            🛡️ Location is required for check-in. You can change permissions later in Settings.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: primary }]}
          onPress={() => router.replace("/(auth)/role-select")}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: "900", marginTop: 12 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  note: { borderRadius: 12, padding: 12, marginTop: 8 },
  btn: {
    marginTop: "auto",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});