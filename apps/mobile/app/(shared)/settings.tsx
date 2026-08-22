import { View, Text, StyleSheet, Pressable, Switch, Alert } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        {/* Profile Info */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.fullName || "User"}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            {user?.phoneNumber}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 2 }}>
            {user?.role}
          </Text>
        </View>

        {/* Dark Mode */}
        <View style={[styles.row, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        {/* Logout */}
        <Pressable
          style={[styles.logoutButton, { backgroundColor: colors.surface }]}
          onPress={handleLogout}
        >
          <Text style={{ color: "#DC2626", fontWeight: "700", fontSize: 16 }}>
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  name: { fontSize: 18, fontWeight: "700" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  logoutButton: {
    marginTop: 32,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
});
