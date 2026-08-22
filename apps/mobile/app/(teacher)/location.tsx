import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getToken } from "@/lib/api";
import { useRouter } from "expo-router";

export default function SetLocationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 9.03,
    longitude: 38.74,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState({ latitude: 9.03, longitude: 38.74 });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      setMarker(coords);
      setLocating(false);
    })();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/teachers/profile/location`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            latitude: marker.latitude,
            longitude: marker.longitude,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save location");

      Alert.alert("Success", "Your location has been updated");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Set Your Location</Text>
        <Text style={{ color: colors.textSecondary }}>
          This helps parents find tutors near them
        </Text>
      </View>

      {locating ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.textSecondary, marginTop: 12 }}>
            Getting your current location...
          </Text>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={(e) => setMarker(e.nativeEvent.coordinate)}
          >
            <Marker
              coordinate={marker}
              draggable
              onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
            />
          </MapView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Location</Text>
              )}
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  footer: { padding: 16 },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
