// apps/mobile/app/(teacher)/verification.tsx
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { getToken } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";

type UploadState = {
  status: "idle" | "uploading" | "success" | "error";
  preview?: string;
  progress?: number;
  error?: string;
};

export default function VerificationScreen() {
  const { colors } = useTheme();

  const [states, setStates] = useState<Record<string, UploadState>>({
    NATIONAL_ID: { status: "idle" },
    DEGREE: { status: "idle" },
    LIVENESS_SELFIE: { status: "idle" },
  });

  const updateState = (type: string, newState: Partial<UploadState>) => {
    setStates((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...newState },
    }));
  };

  const pickAndUpload = async (documentType: string, label: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // Show preview for images
      if (file.mimeType?.startsWith("image/")) {
        updateState(documentType, {
          status: "uploading",
          preview: file.uri,
          progress: 0,
        });
      } else {
        updateState(documentType, { status: "uploading", progress: 0 });
      }

      const token = await getToken();
      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      } as any);

      formData.append("documentType", documentType);

      // Simulate progress (real progress needs XMLHttpRequest or similar)
      updateState(documentType, { progress: 40 });

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/vault/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      updateState(documentType, { progress: 90 });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }

      updateState(documentType, {
        status: "success",
        progress: 100,
      });

      Alert.alert("Success", `${label} uploaded successfully. Waiting for admin review.`);
    } catch (error: any) {
      updateState(documentType, {
        status: "error",
        error: error.message,
      });
      Alert.alert("Upload Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Document Verification</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 8, lineHeight: 22 }}>
          Upload your documents to the secure vault. Only authorized admins can view them.
          After approval you will receive Trust Badges on your public profile.
        </Text>

        <UploadCard
          title="National ID / Fayda"
          description="Government issued ID"
          documentType="NATIONAL_ID"
          state={states.NATIONAL_ID}
          colors={colors}
          onPress={() => pickAndUpload("NATIONAL_ID", "National ID")}
        />

        <UploadCard
          title="Degree / Transcript"
          description="University certificate"
          documentType="DEGREE"
          state={states.DEGREE}
          colors={colors}
          onPress={() => pickAndUpload("DEGREE", "Degree")}
        />

        <UploadCard
          title="Liveness Selfie"
          description="Photo of yourself holding your ID"
          documentType="LIVENESS_SELFIE"
          state={states.LIVENESS_SELFIE}
          colors={colors}
          onPress={() => pickAndUpload("LIVENESS_SELFIE", "Liveness Selfie")}
        />

        <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
          <Ionicons name="lock-closed" size={18} color={colors.primary} />
          <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20, flex: 1 }}>
            All documents are encrypted with AES-256 and stored in a private vault. They are never shown on your public profile.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UploadCard({
  title,
  description,
  state,
  colors,
  onPress,
}: {
  title: string;
  description: string;
  documentType: string;
  state: UploadState;
  colors: any;
  onPress: () => void;
}) {
  const isDisabled = state.status === "uploading" || state.status === "success";

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.surface, opacity: isDisabled ? 0.85 : 1 }]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {state.preview ? (
        <Image source={{ uri: state.preview }} style={styles.preview} />
      ) : (
        <View style={[styles.iconPlaceholder, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name="document" size={22} color={colors.primary} />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{description}</Text>

        {state.status === "uploading" && (
          <Text style={{ color: colors.primary, fontSize: 12, marginTop: 4 }}>
            Uploading... {state.progress || 0}%
          </Text>
        )}
        {state.status === "error" && (
          <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
            {state.error || "Upload failed"}
          </Text>
        )}
      </View>

      {state.status === "uploading" ? (
        <ActivityIndicator color={colors.primary} />
      ) : state.status === "success" ? (
        <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
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
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
    gap: 12,
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  infoBox: {
    marginTop: 28,
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
});
