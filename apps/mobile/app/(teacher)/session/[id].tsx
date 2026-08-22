import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { getToken } from "@/lib/api";

export default function SessionCheckInScreen() {
  const { id: contractId } = useLocalSearchParams();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== "granted") {
        Alert.alert("Permission required", "Location permission is needed for check-in");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const token = await getToken();

      // In real app we also send parent location (from contract)
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/attendance/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractId,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          parentLat: 9.03,   // should come from contract
          parentLng: 38.74,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Check-in failed");

      setStatus(data.message);

      if (!data.isWithinGeofence) {
        Alert.alert(
          "Outside Geofence",
          `You are ${data.distanceMeters}m away. Parent confirmation will be required.`
        );
      } else {
        Alert.alert("Success", "Checked in successfully within geofence!");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Session Check-in</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8, lineHeight: 22 }}>
          You must be within 150 meters of the parent’s registered location to automatically
          verify this session.
        </Text>

        {status && (
          <View style={[styles.statusBox, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.text }}>{status}</Text>
          </View>
        )}

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCheckIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Check In Now</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  statusBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  button: {
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
