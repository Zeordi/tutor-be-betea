import { View, Text, StyleSheet, Pressable, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { getToken } from "@/lib/api";

export default function VerificationScreen() {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);

  const pickAndUpload = async (documentType: string, label: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploading(true);

      const token = await getToken();
      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      } as any);

      formData.append("documentType", documentType);

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/vault/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      setUploaded((prev) => [...prev, label]);
      Alert.alert("Success", `${label} uploaded successfully. Waiting for admin review.`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Document Verification</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8, lineHeight: 22 }}>
          Upload your documents to the secure vault. Only authorized admins can view them.
          After approval you will receive Trust Badges.
        </Text>

        <UploadCard
          title="National ID / Fayda / Kebele"
          description="Government issued ID"
          uploaded={uploaded.includes("National ID")}
          loading={uploading}
          colors={colors}
          onPress={() => pickAndUpload("NATIONAL_ID", "National ID")}
        />

        <UploadCard
          title="Degree / Transcript"
          description="University certificate or transcript"
          uploaded={uploaded.includes("Degree")}
          loading={uploading}
          colors={colors}
          onPress={() => pickAndUpload("DEGREE", "Degree")}
        />

        <UploadCard
          title="Liveness Selfie"
          description="Clear photo of yourself holding your ID"
          uploaded={uploaded.includes("Liveness Selfie")}
          loading={uploading}
          colors={colors}
          onPress={() => pickAndUpload("LIVENESS_SELFIE", "Liveness Selfie")}
        />

        <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20 }}>
            🔒 All documents are encrypted with AES-256 and stored in a private vault.
            They are never shown on your public profile.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UploadCard({
  title,
  description,
  uploaded,
  loading,
  colors,
  onPress,
}: {
  title: string;
  description: string;
  uploaded: boolean;
  loading: boolean;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      disabled={loading || uploaded}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 4 }}>{description}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : uploaded ? (
        <Text style={{ color: "#16A34A", fontWeight: "700" }}>Uploaded ✓</Text>
      ) : (
        <Text style={{ color: colors.primary, fontWeight: "700" }}>Upload</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  infoBox: {
    marginTop: 28,
    padding: 16,
    borderRadius: 14,
  },
});
