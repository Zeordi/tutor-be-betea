import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../hooks/useTheme";
import { apiRequest, paths } from "@/lib/api";

type ChildDetail = {
  id: string;
  studentName: string;
  gradeLevel: string;
  curriculum: string;
  subjects: string[];
  specialLearningNotes: string | null;
};

export default function ChildProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [child, setChild] = useState<ChildDetail | null>(null);
  const [curriculum, setCurriculum] = useState<"national" | "cambridge">("national");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    apiRequest<ChildDetail>(paths.child(id))
      .then((data) => {
        if (!cancelled) {
          setChild(data);
          const cur = data.curriculum || "";
          setCurriculum(cur === "NATIONAL_MINISTRY" ? "national" : "cambridge");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load child");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const handleSave = async () => {
    if (!child) return;
    try {
      setSaving(true);
      await apiRequest(paths.child(child.id), {
        method: "PATCH",
        body: JSON.stringify({
          curriculum: curriculum === "national" ? "NATIONAL_MINISTRY" : "CAMBRIDGE",
        }),
      });
      Alert.alert("Saved", "Child profile updated");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
  const headerBg = colors.card ?? (isDark ? "#112240" : "#FFFFFF");

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Child Profile
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !child) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: sub, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
            Child Profile
          </Text>
        </View>
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: text, marginBottom: 12 }}>{error || "Child not found"}</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: primary }]}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: text, fontSize: 16, fontWeight: "800", flex: 1, marginLeft: 10 }}>
          Child Profile
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={{ color: primary, fontWeight: "700", fontSize: 13 }}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: card, borderColor: border, alignItems: "center" }]}>
          <View style={[styles.avatarXl, { backgroundColor: primary }]}>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
              {child.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </Text>
          </View>
          <Text style={{ color: text, fontWeight: "800", fontSize: 16, marginTop: 10 }}>
            {child.studentName}
          </Text>
          <Text style={{ color: sub, fontSize: 11 }}>
            {child.gradeLevel} · {curriculum === "national" ? "National" : "Cambridge"} · #{child.id}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.label, { color: sub }]}>BASIC INFORMATION</Text>
          {[
            ["Full Name", child.studentName],
            ["Grade Level", child.gradeLevel],
          ].map(([label, val]) => (
            <View key={label} style={{ marginBottom: 10 }}>
              <Text style={{ color: sub, fontSize: 10, fontWeight: "600", marginBottom: 4 }}>
                {label}
              </Text>
              <View
                style={[
                  styles.inputBox,
                  {
                    backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.text, fontSize: 12 }}>{val}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.label, { color: sub }]}>CURRICULUM</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(
              [
                ["national", "🇪🇹 Ethiopian National", "Grades 1–12 National Standard"],
                ["cambridge", "🎓 Cambridge / IGCSE", "International curriculum"],
              ] as const
            ).map(([idKey, label, desc]) => {
              const selected = curriculum === idKey;
              return (
                <TouchableOpacity
                  key={idKey}
                  onPress={() => setCurriculum(idKey)}
                  style={[
                    styles.currBtn,
                    {
                      borderColor: selected ? primary : border,
                      backgroundColor: selected
                        ? isDark
                          ? "rgba(13,148,136,0.15)"
                          : "#F0FDFA"
                        : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? primary : text,
                      fontWeight: "700",
                      fontSize: 11,
                    }}
                  >
                    {label}
                  </Text>
                  <Text style={{ color: sub, fontSize: 9, marginTop: 4 }}>{desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <Text style={[styles.label, { color: sub }]}>SUBJECTS</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {child.subjects.map((s) => (
              <View
                key={s}
                style={[
                  styles.tag,
                  {
                    borderColor: primary,
                    backgroundColor: isDark ? "rgba(13,148,136,0.15)" : "#F0FDFA",
                  },
                ]}
              >
                <Text
                  style={{
                    color: primary,
                    fontSize: 11,
                    fontWeight: "600",
                  }}
                >
                  {s}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.ctaText}>{saving ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  card: { borderRadius: 16, padding: 14, borderWidth: 1 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, marginBottom: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatarXl: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  currBtn: { flex: 1, borderRadius: 14, borderWidth: 2, padding: 10 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  cta: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  retryBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, alignItems: "center" },
});
