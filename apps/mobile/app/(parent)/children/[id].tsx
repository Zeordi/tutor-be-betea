import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../hooks/useTheme";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English"];
const TUTORS = [
  { name: "Hana Bekele", sub: "Mathematics", rating: 4.9 },
  { name: "Abel Tesfaye", sub: "Physics", rating: 4.8 },
];

export default function ChildProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [curriculum, setCurriculum] = useState<"national" | "cambridge">("national");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, flex: 1, marginLeft: 10 }]}>
          Child Profile
        </Text>
        <TouchableOpacity onPress={() => Alert.alert("Saved", "Child profile updated")}>
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 13 }}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: "center" }]}>
          <View style={[styles.avatarXl, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>LT</Text>
          </View>
          <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16, marginTop: 10 }}>
            Liya Tadesse
          </Text>
          <Text style={{ color: colors.sub, fontSize: 11 }}>Age 15 · Grade 10 · #{id}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>BASIC INFORMATION</Text>
          {[
            ["Full Name", "Liya Tadesse"],
            ["Date of Birth", "March 14, 2009"],
            ["School", "Bole International School"],
            ["Grade Level", "Grade 10"],
          ].map(([label, val]) => (
            <View key={label} style={{ marginBottom: 10 }}>
              <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginBottom: 4 }}>
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

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.sub }]}>CURRICULUM</Text>
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
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected
                        ? isDark
                          ? "#134e4a44"
                          : "#f0fdfa"
                        : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selected ? colors.primary : colors.text,
                      fontWeight: "700",
                      fontSize: 11,
                    }}
                  >
                    {label}
                  </Text>
                  <Text style={{ color: colors.sub, fontSize: 9, marginTop: 4 }}>{desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.sub }]}>SUBJECTS</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {SUBJECTS.map((s, i) => (
              <View
                key={s}
                style={[
                  styles.tag,
                  {
                    borderColor: i < 3 ? colors.primary : colors.border,
                    backgroundColor:
                      i < 3 ? (isDark ? "#134e4a44" : "#f0fdfa") : "transparent",
                  },
                ]}
              >
                <Text
                  style={{
                    color: i < 3 ? colors.primary : colors.sub,
                    fontSize: 11,
                    fontWeight: "600",
                  }}
                >
                  {s}
                  {i < 3 ? " ×" : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.sub }]}>ASSIGNED TUTORS</Text>
            <TouchableOpacity onPress={() => router.push("/(parent)/(tabs)/find-tutors")}>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>
                + Add Tutor
              </Text>
            </TouchableOpacity>
          </View>
          {TUTORS.map((t) => (
            <View
              key={t.name}
              style={[styles.tutorRow, { backgroundColor: isDark ? "#1e293b99" : "#f8fafc" }]}
            >
              <View style={[styles.avatarSm, { backgroundColor: colors.primary }]}>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>{t.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 12 }}>{t.name}</Text>
                <Text style={{ color: colors.sub, fontSize: 10 }}>
                  {t.sub} · {t.rating} ⭐
                </Text>
              </View>
              <TouchableOpacity style={styles.removeBtn}>
                <Text style={{ color: "#ef4444", fontSize: 11, fontWeight: "600" }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.sub, fontSize: 10, fontWeight: "600", marginBottom: 6 }}>
            Learning Notes for Tutors
          </Text>
          <View
            style={[
              styles.notesBox,
              {
                backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ color: colors.text, fontSize: 11, lineHeight: 17 }}>
              Liya learns best with visual examples and diagrams. She is shy at first but opens up
              quickly. Prefers structured lessons with clear goals. Family speaks Amharic at home —
              tutor may use simple Amharic to clarify concepts.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert("Saved", "Child profile updated")}
        >
          <Text style={styles.ctaText}>Save Changes</Text>
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
  tutorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  avatarSm: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtn: {
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  notesBox: { borderRadius: 12, borderWidth: 1, padding: 12 },
  cta: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});