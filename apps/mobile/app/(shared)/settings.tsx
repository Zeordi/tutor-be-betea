import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  getBiometricEnabled,
  setBiometricEnabled,
} from "@/lib/preferences";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [biometric, setBiometric] = useState(false);

  useEffect(() => {
    getBiometricEnabled().then(setBiometric);
  }, []);

  const onBiometricChange = async (value: boolean) => {
    setBiometric(value);
    await setBiometricEnabled(value);
    if (value) {
      Alert.alert(
        "Biometric enabled",
        "Next time you open Login, you can use Quick Sign In if this device supports it."
      );
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const role = user?.role;
  const isTeacher = role === "TEACHER";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <View style={[styles.card, { backgroundColor: colors.surface ?? colors.card }]}>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.fullName || "User"}
          </Text>
          <Text style={{ color: colors.mutedForeground ?? colors.subtext, marginTop: 4 }}>
            {user?.phoneNumber}
          </Text>
          <Text style={{ color: colors.mutedForeground ?? colors.subtext, marginTop: 2 }}>
            {user?.role}
          </Text>
        </View>

        <View style={[styles.row, { backgroundColor: colors.surface ?? colors.card }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
            <Text style={styles.hint}>Theme for the whole app</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Opt-in only — default OFF */}
        <View style={[styles.row, { backgroundColor: colors.surface ?? colors.card }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              Biometric Quick Sign In
            </Text>
            <Text style={styles.hint}>
              Optional. When off, login stays phone + password + OTP only.
            </Text>
          </View>
          <Switch
            value={biometric}
            onValueChange={onBiometricChange}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <Text style={[styles.section, { color: colors.mutedForeground }]}>
          SAFETY & SESSION
        </Text>
        {[
          { label: "Live location / geofence", href: "/(shared)/location-sharing" },
          { label: "Emergency SOS", href: "/(shared)/sos-confirm" },
          { label: "Offline session logger", href: "/(shared)/offline-session" },
          { label: "Document camera capture", href: "/(shared)/camera-capture" },
        ].map((item) => (
          <Pressable
            key={item.href}
            style={[styles.row, { backgroundColor: colors.surface ?? colors.card }]}
            onPress={() => router.push(item.href as any)}
          >
            <Text style={[styles.rowLabel, { color: colors.text }]}>{item.label}</Text>
            <Text style={{ color: colors.primary }}>→</Text>
          </Pressable>
        ))}

        {isTeacher && (
          <>
            <Text style={[styles.section, { color: colors.mutedForeground }]}>
              TEACHER
            </Text>
            <Pressable
              style={[styles.row, { backgroundColor: colors.surface ?? colors.card }]}
              onPress={() => router.push("/(teacher)/verification")}
            >
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                Verification / vault upload
              </Text>
              <Text style={{ color: colors.primary }}>→</Text>
            </Pressable>
          </>
        )}

        <Pressable
          style={[styles.logoutButton, { backgroundColor: colors.surface ?? colors.card }]}
          onPress={handleLogout}
        >
          <Text style={{ color: "#DC2626", fontWeight: "700", fontSize: 16 }}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  name: { fontSize: 18, fontWeight: "700" },
  section: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  hint: { fontSize: 11, color: "#94A3B8", marginTop: 4 },
  logoutButton: {
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
});