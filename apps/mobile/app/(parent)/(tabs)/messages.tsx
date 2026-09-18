import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function MessagesScreen() {
  const { isDark } = useTheme();
  const router = useRouter();

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: isDark ? "#1E3A5F" : "#E2E8F0" }]}>
        <Text style={[styles.title, { color: text }]}>Messages</Text>
        <Text style={{ color: sub, fontSize: 11, marginTop: 2 }}>
          Protected by Anti-Poaching Shield
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ color: sub, textAlign: "center", lineHeight: 18 }}>
          Your session conversations will appear here.
        </Text>
        <Text style={{ color: sub, fontSize: 10, textAlign: "center", marginTop: 8, opacity: 0.7 }}>
          No chat rooms endpoint wired yet
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: "800" },
});