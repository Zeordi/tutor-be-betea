import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

const RESTRICTED =
  /(\+251[\d\s-]{8,}|09\d{8}|07\d{8}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|@[a-zA-Z0-9_]{3,}|\b\d{10,16}\b)/gi;

function sanitize(text: string) {
  return text.replace(RESTRICTED, "[RESTRICTED CONTACT INFO]");
}

const INITIAL = [
  { id: "1", me: true, text: "Are you available for a session tomorrow at 4pm?" },
  { id: "2", me: false, text: "Yes, I'm available! We can cover algebra." },
  { id: "3", me: true, text: "Send me your number please." },
  {
    id: "4",
    me: false,
    text: "My number is [RESTRICTED CONTACT INFO], Telegram [RESTRICTED CONTACT INFO]",
    redacted: true,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const cleaned = sanitize(input.trim());
    const redacted = cleaned !== input.trim();
    setMessages((m) => [
      ...m,
      { id: String(Date.now()), me: true, text: cleaned, redacted },
    ]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: colors.mutedForeground }}>←</Text>
        </Pressable>
        <View style={[styles.av, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>ST</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.foreground }]}>Selamawit Tadesse</Text>
          <Text style={{ color: "#10B981", fontSize: 11 }}>Online · Verified ✓</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.day, { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9", color: colors.mutedForeground }]}>
            Today
          </Text>
        </View>
        {messages.map((m) => (
          <View key={m.id} style={{ alignItems: m.me ? "flex-end" : "flex-start" }}>
            <View
              style={[
                styles.bubble,
                m.me
                  ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
                  : {
                      backgroundColor: isDark ? "#1E3A5F" : "#fff",
                      borderBottomLeftRadius: 4,
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
              ]}
            >
              <Text style={{ color: m.me ? "#fff" : colors.foreground, fontSize: 14, lineHeight: 20 }}>
                {m.text}
              </Text>
            </View>
            {m.redacted && (
              <Text style={{ color: "#EF4444", fontSize: 10, fontWeight: "600", marginTop: 2, marginHorizontal: 4 }}>
                ⚠️ Contact info auto-redacted · Platform policy
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={[styles.composer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={[styles.inputWrap, { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9" }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message..."
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, color: colors.foreground, fontSize: 14, paddingVertical: 8 }}
          />
        </View>
        <Pressable style={[styles.send, { backgroundColor: colors.primary }]} onPress={send}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  av: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "700" },
  day: { fontSize: 11, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  bubble: { maxWidth: "78%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
  },
  inputWrap: { flex: 1, borderRadius: 14, paddingHorizontal: 12 },
  send: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
});