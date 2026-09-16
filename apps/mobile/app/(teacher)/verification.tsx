import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import * as DocumentPicker from "expo-document-picker";
import { apiRequest, paths } from "@/lib/api";

type DocStatus = "rejected" | "needs-info" | "approved" | "pending";

type VaultDoc = {
  id: string;
  documentType: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
};

function statusStyle(status: DocStatus, isDark: boolean) {
  if (status === "approved")
    return { bg: isDark ? "#064e3b55" : "#d1fae5", fg: "#047857", border: "#6ee7b7" };
  if (status === "rejected")
    return { bg: isDark ? "#7f1d1d55" : "#fee2e2", fg: "#b91c1c", border: "#fca5a5" };
  if (status === "needs-info" || status === "pending")
    return { bg: isDark ? "#78350f55" : "#fef3c7", fg: "#b45309", border: "#fcd34d" };
  return { bg: isDark ? "#1e293b" : "#f1f5f9", fg: "#64748B", border: "#e2e8f0" };
}

const DOC_LABELS: Record<string, string> = {
  NATIONAL_ID: "Fayda National ID",
  PASSPORT: "Passport",
  DEGREE: "University Degree Certificate",
  TRANSCRIPT: "Official Transcript",
  LIVENESS_SELFIE: "Biometric Liveness Selfie",
};

export default function DocumentReuploadScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [docs, setDocs] = useState<VaultDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadDocs = async () => {
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest<VaultDoc[]>(paths.vaultTeacherDocuments("me"));
      if (!cancelled) setDocs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      if (!cancelled) setError(e.message || "Failed to load documents");
    } finally {
      if (!cancelled) setLoading(false);
    }
    return () => { cancelled = true; };
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const startUpload = async (docType: string) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (res.canceled || !res.assets?.[0]?.uri) return;

      setUploadingId(docType);
      const asset = res.assets[0];

      const form = new FormData();
      form.append("file", {
        uri: asset.uri,
        type: asset.mimeType || "application/octet-stream",
        name: asset.name || "upload",
      } as any);
      form.append("documentType", docType);

      await apiRequest(paths.vaultUpload, {
        method: "POST",
        body: form as any,
      });

      Alert.alert("Uploaded", "Document encrypted (AES-256) and sent for re-review.");
      await loadDocs();
    } catch (e: any) {
      Alert.alert("Upload failed", e.message || "Please try again");
    } finally {
      setUploadingId(null);
    }
  };

  const docStatus = (doc: VaultDoc): DocStatus => {
    const s = doc.status.toLowerCase();
    if (s === "approved") return "approved";
    if (s === "rejected") return "rejected";
    if (s === "pending" || s === "needs-info") return "needs-info";
    return "pending";
  };

  const docLabel = (doc: VaultDoc) => DOC_LABELS[doc.documentType] || doc.documentType;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Document Re-upload</Text>
          <Text style={{ color: colors.sub, fontSize: 10 }}>Vault · AES-256 · Admin only</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: colors.text, marginBottom: 12 }}>{error}</Text>
          <TouchableOpacity onPress={loadDocs} style={{ backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}>
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.adminNote,
              {
                backgroundColor: isDark ? "#7f1d1d33" : "#fef2f2",
                borderColor: isDark ? "#7f1d1d" : "#fecaca",
              },
            ]}
          >
            <Text style={{ color: "#ef4444", fontWeight: "700", fontSize: 11, marginBottom: 4 }}>
              📋 Admin Note
            </Text>
            <Text style={{ color: colors.text, fontSize: 11, lineHeight: 16 }}>
              Dear Hana, thank you for registering. We could not verify your National ID because the
              image quality was insufficient. Please ensure both sides are photographed clearly in good
              lighting. Degree transcripts must include the registrar stamp. — TBB Verification Team
            </Text>
            <Text style={{ color: colors.sub, fontSize: 10, marginTop: 6 }}>
              Oct 9, 2024 · Verification Analyst
            </Text>
          </View>

          {docs.map((doc) => {
            const st = statusStyle(docStatus(doc), isDark);
            return (
              <View
                key={doc.id}
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.row}>
                  <View style={[styles.docIcon, { backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }]}>
                    <Text style={{ fontSize: 20 }}>
                      {doc.documentType === "NATIONAL_ID" ? "🪪" : doc.documentType === "DEGREE" ? "🎓" : doc.documentType === "LIVENESS_SELFIE" ? "📸" : "📄"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13 }}>
                      {docLabel(doc)}
                    </Text>
                    <View
                      style={{
                        alignSelf: "flex-start",
                        marginTop: 4,
                        backgroundColor: st.bg,
                        borderColor: st.border,
                        borderWidth: 1,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: st.fg, fontSize: 10, fontWeight: "700" }}>
                        {doc.status.replace(/-/g, " ").toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {doc.rejectionReason ? (
                  <View
                    style={[
                      styles.noteBox,
                      { backgroundColor: isDark ? "#1e293b99" : "#f8fafc" },
                    ]}
                  >
                    <Text style={{ color: colors.sub, fontSize: 11, lineHeight: 16 }}>{doc.rejectionReason}</Text>
                  </View>
                ) : null}

                {doc.status !== "approved" ? (
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                    <TouchableOpacity
                      style={[styles.camBtn, { borderColor: colors.primary }]}
                      onPress={() => startUpload(doc.documentType)}
                      disabled={!!uploadingId}
                    >
                      {uploadingId === doc.documentType ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 11 }}>
                          📷 Camera
                        </Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.fileBtn, { borderColor: colors.border }]}
                      onPress={() => startUpload(doc.documentType)}
                      disabled={!!uploadingId}
                    >
                      <Text style={{ color: colors.sub, fontWeight: "700", fontSize: 11 }}>
                        📎 Upload File
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.approvedRow}>
                    <View style={styles.approvedDot}>
                      <Text style={{ color: "#fff", fontSize: 10 }}>✓</Text>
                    </View>
                    <Text style={{ color: "#10b981", fontWeight: "600", fontSize: 12 }}>
                      Verified · No action needed
                    </Text>
                  </View>
                )}

                {uploadingId === doc.documentType && (
                  <View
                    style={[
                      styles.uploading,
                      {
                        backgroundColor: isDark ? "#1e3a5f55" : "#eff6ff",
                        borderColor: isDark ? "#1e40af" : "#bfdbfe",
                      },
                    ]}
                  >
                    <Text style={{ color: isDark ? "#93c5fd" : "#1d4ed8", fontWeight: "600", fontSize: 11 }}>
                      Uploading securely (AES-256)…
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          <View
            style={[
              styles.privacy,
              {
                backgroundColor: isDark ? "#0f172a" : "#f8fafc",
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: colors.sub, fontSize: 10, lineHeight: 15 }}>
              🔒 Documents are encrypted with AES-256 and stored in a private Admin vault. They are never
              visible to parents or other teachers. Only trained TBB verification staff access them.
              Trust Badges are the only public indicator.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.cta, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert("Submitted", "Documents sent for re-review")}
          >
            <Text style={styles.ctaText}>Submit for Re-review</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 15, fontWeight: "700" },
  content: { padding: 14, paddingBottom: 40, gap: 12 },
  adminNote: { borderRadius: 16, padding: 14, borderWidth: 1 },
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  noteBox: { borderRadius: 12, padding: 10, marginTop: 10 },
  camBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  fileBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  approvedRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  approvedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  uploading: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  privacy: { borderRadius: 12, borderWidth: 1, padding: 12 },
  cta: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});
