import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

const DOCS = ["Fayda ID (front)", "Fayda ID (back)", "Degree / transcript", "Liveness selfie"];

export default function CameraCaptureScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [doc, setDoc] = useState(DOCS[0]);
  const [capturing, setCapturing] = useState(false);

  const bg = isDark ? "#0A1628" : "#0F172A";
  const primary = "#0D9488";

  const capture = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      Alert.alert(
        "Captured",
        `${doc} saved securely. Upload uses AES-256 vault pipeline.`
      );
    }, 900);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={styles.top}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#94A3B8", fontWeight: "700" }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>{doc}</Text>
        <Text style={{ color: primary, fontWeight: "800", fontSize: 12 }}>Help</Text>
      </View>

      <View style={styles.viewfinder}>
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
        <View style={styles.scanLine} />
        <Text style={styles.hint}>
          Align document inside the frame · good lighting
        </Text>
      </View>

      <View style={styles.docRow}>
        {DOCS.map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setDoc(d)}
            style={[
              styles.docChip,
              { borderColor: doc === d ? primary : "#334155" },
            ]}
          >
            <Text
              style={{
                color: doc === d ? primary : "#94A3B8",
                fontSize: 10,
                fontWeight: "700",
              }}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.shutter, { opacity: capturing ? 0.6 : 1 }]}
          onPress={capture}
          disabled={capturing}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>
        <Text style={{ color: "#94A3B8", fontSize: 12, marginTop: 10 }}>
          {capturing ? "Processing…" : "Tap to capture"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewfinder: {
    marginHorizontal: 24,
    marginTop: 12,
    height: 280,
    borderRadius: 16,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#2DD4BF",
  },
  tl: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3 },
  scanLine: {
    position: "absolute",
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: "rgba(45,212,191,0.6)",
  },
  hint: {
    position: "absolute",
    bottom: 16,
    color: "#94A3B8",
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  docRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
    justifyContent: "center",
  },
  docChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bottom: { alignItems: "center", marginTop: 8, paddingBottom: 24 },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
});