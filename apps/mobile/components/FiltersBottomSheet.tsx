import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "@/hooks/useTheme";

const SUBJECTS = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Amharic",
  "History",
  "Geography",
  "ICT",
];
const GRADES = ["Grade 1–4", "Grade 5–8", "Grade 9–10", "Grade 11–12", "University"];
const DISTANCES = ["1 km", "3 km", "5 km", "10 km", "Any"];
const GENDERS = ["Any", "Male", "Female"];
const STYLES = ["Any", "Home Visit", "Online", "Both"];

export type FiltersValue = {
  subjects: string[];
  grade: string | null;
  maxRate: number;
  distance: string;
  gender: string;
  sessionStyle: string;
  verifiedOnly: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: FiltersValue) => void;
  resultCount?: number;
};

export default function FiltersBottomSheet({
  visible,
  onClose,
  onApply,
  resultCount = 24,
}: Props) {
  const { colors, isDark } = useTheme();
  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground;
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";
  const border = colors.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");

  const [subjects, setSubjects] = useState<string[]>(["Math", "Physics", "Chemistry"]);
  const [grade, setGrade] = useState<string | null>("Grade 9–10");
  const [priceRange, setPriceRange] = useState(500);
  const [distance, setDistance] = useState("5 km");
  const [gender, setGender] = useState("Any");
  const [sessionStyle, setSessionStyle] = useState("Any");
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  const toggleSubject = (s: string) => {
    setSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const reset = () => {
    setSubjects([]);
    setGrade(null);
    setPriceRange(500);
    setDistance("Any");
    setGender("Any");
    setSessionStyle("Any");
    setVerifiedOnly(false);
  };

  const apply = () => {
    onApply?.({
      subjects,
      grade,
      maxRate: priceRange,
      distance,
      gender,
      sessionStyle,
      verifiedOnly,
    });
    onClose();
  };

  const chip = (active: boolean) => ({
    backgroundColor: active ? primary : isDark ? "#1E293B" : "#F1F5F9",
    borderColor: active ? primary : border,
  });
  const chipText = (active: boolean) => ({
    color: active ? "#FFFFFF" : sub,
    fontWeight: "600" as const,
    fontSize: 10,
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: card }]}>
        <View style={[styles.handleRow, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: text }]}>Filter Tutors</Text>
          <View style={styles.handleActions}>
            <TouchableOpacity onPress={reset}>
              <Text style={{ color: sub, fontSize: 12, fontWeight: "600" }}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: primary, fontSize: 12, fontWeight: "700" }}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={[styles.section, { color: sub }]}>SUBJECTS</Text>
          <View style={styles.wrap}>
            {SUBJECTS.map((s) => {
              const active = subjects.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => toggleSubject(s)}
                  style={[styles.chip, chip(active)]}
                >
                  <Text style={chipText(active)}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.section, { color: sub }]}>GRADE LEVEL</Text>
          <View style={styles.wrap}>
            {GRADES.map((g) => {
              const active = grade === g;
              return (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGrade(g)}
                  style={[styles.chip, chip(active)]}
                >
                  <Text style={chipText(active)}>{g}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.section, { color: sub, marginBottom: 0 }]}>MAX HOURLY RATE</Text>
            <Text style={{ color: primary, fontWeight: "800", fontSize: 14 }}>{priceRange} ETB</Text>
          </View>
          <Slider
            minimumValue={100}
            maximumValue={1000}
            step={50}
            value={priceRange}
            onValueChange={setPriceRange}
            minimumTrackTintColor={primary}
            maximumTrackTintColor={isDark ? "#334155" : "#E2E8F0"}
            thumbTintColor={primary}
          />
          <View style={styles.rowBetween}>
            <Text style={{ color: sub, fontSize: 9 }}>100 ETB</Text>
            <Text style={{ color: sub, fontSize: 9 }}>1,000 ETB</Text>
          </View>

          <Text style={[styles.section, { color: sub }]}>DISTANCE</Text>
          <View style={styles.row}>
            {DISTANCES.map((d) => {
              const active = distance === d;
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => setDistance(d)}
                  style={[styles.flexChip, chip(active)]}
                >
                  <Text style={chipText(active)}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.section, { color: sub }]}>TUTOR GENDER</Text>
          <View style={styles.row}>
            {GENDERS.map((g) => {
              const active = gender === g;
              return (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.flexChip, chip(active)]}
                >
                  <Text style={chipText(active)}>{g}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.section, { color: sub }]}>SESSION STYLE</Text>
          <View style={styles.row}>
            {STYLES.map((s) => {
              const active = sessionStyle === s;
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSessionStyle(s)}
                  style={[styles.flexChip, chip(active)]}
                >
                  <Text style={chipText(active)}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.toggleRow, { borderColor: border }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontSize: 12, fontWeight: "600" }}>
                Verified tutors only
              </Text>
              <Text style={{ color: sub, fontSize: 9, marginTop: 2 }}>
                Show only Fayda ID verified tutors
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setVerifiedOnly(!verifiedOnly)}
              style={[
                styles.switchTrack,
                { backgroundColor: verifiedOnly ? primary : isDark ? "#475569" : "#CBD5E1" },
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  { transform: [{ translateX: verifiedOnly ? 18 : 2 }] },
                ]}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: border }]}>
          <TouchableOpacity
            onPress={apply}
            style={[styles.applyBtn, { backgroundColor: primary }]}
          >
            <Text style={styles.applyText}>
              Apply Filters · Show {resultCount} tutors
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    maxHeight: "88%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 14, fontWeight: "800" },
  handleActions: { flexDirection: "row", gap: 16, alignItems: "center" },
  body: { padding: 16, paddingBottom: 24, gap: 4 },
  section: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginTop: 12,
    marginBottom: 8,
  },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  flexChip: {
    flex: 1,
    minWidth: 56,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  switchTrack: {
    width: 40,
    height: 22,
    borderRadius: 999,
    justifyContent: "center",
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  applyBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
});