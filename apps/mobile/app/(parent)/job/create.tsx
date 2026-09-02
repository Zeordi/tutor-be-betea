import { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function PostJobScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [boost, setBoost] = useState(false);
  const [urgent, setUrgent] = useState(true);
  const [title, setTitle] = useState("Grade 12 Physics Tutor Needed");
  const [subject, setSubject] = useState("Physics");
  const [budget, setBudget] = useState("500");
  const [location, setLocation] = useState("Bole, Addis Ababa");
  const [desc, setDesc] = useState(
    "Looking for an experienced Physics tutor for my Grade 12 son preparing for Ethiopian National Exams. Must have Fayda ID verification."
  );

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const headerBg = isDark ? "#0F1B2D" : "#FFFFFF";
  const inputBg = isDark ? "#0A1628" : "#FFFFFF";

  const submit = () => {
    Alert.alert("Posted", "Job submitted for review & publish.");
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: sub }}>←</Text></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: text }]}>Post a Job</Text>
        <Text style={{ color: primary, fontSize: 11, fontWeight: "700" }}>Step 1 of 3</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {[
          { label: "Job Title", value: title, set: setTitle },
          { label: "Subject", value: subject, set: setSubject },
          { label: "Budget (ETB/hour)", value: budget, set: setBudget },
          { label: "Location", value: location, set: setLocation },
        ].map((f) => (
          <View key={f.label}>
            <Text style={[styles.label, { color: sub }]}>{f.label}</Text>
            <TextInput
              value={f.value}
              onChangeText={f.set}
              style={[styles.input, { color: text, backgroundColor: inputBg, borderColor: border }]}
              placeholderTextColor={sub}
            />
          </View>
        ))}

        <View>
          <Text style={[styles.label, { color: sub }]}>Job Description</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            multiline
            style={[styles.input, styles.textarea, { color: text, backgroundColor: inputBg, borderColor: border }]}
            placeholderTextColor={sub}
          />
        </View>

        <View style={[styles.promoCard, { backgroundColor: card }]}>
          <Text style={[styles.label, { color: sub }]}>PROMOTE YOUR LISTING</Text>
          <TouchableOpacity style={styles.toggleRow} onPress={() => setBoost(!boost)}>
            <View>
              <Text style={{ color: text, fontWeight: "800", fontSize: 12 }}>🚀 Boost · 3x visibility</Text>
              <Text style={{ color: sub, fontSize: 10 }}>+2 Connects</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: boost ? "#F59E0B" : "#CBD5E1" }]}>
              <View style={[styles.knob, { marginLeft: boost ? 18 : 2 }]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleRow} onPress={() => setUrgent(!urgent)}>
            <View>
              <Text style={{ color: text, fontWeight: "800", fontSize: 12 }}>🔥 Urgent — Hire in 24hrs</Text>
              <Text style={{ color: sub, fontSize: 10 }}>Shows Urgent badge</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: urgent ? "#EF4444" : "#CBD5E1" }]}>
              <View style={[styles.knob, { marginLeft: urgent ? 18 : 2 }]} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.submit, { backgroundColor: primary }]} onPress={submit}>
          <Text style={styles.submitText}>Post Job → Review & Publish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "800" },
  label: { fontSize: 10, fontWeight: "800", marginBottom: 6, letterSpacing: 0.4 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, fontSize: 13 },
  textarea: { minHeight: 90, textAlignVertical: "top" },
  promoCard: { borderRadius: 16, padding: 14, gap: 10 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  toggle: { width: 40, height: 22, borderRadius: 11, justifyContent: "center" },
  knob: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#fff" },
  submit: { marginTop: 8, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "800", fontSize: 14 },
});