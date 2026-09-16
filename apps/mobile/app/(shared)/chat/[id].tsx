import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest, paths } from "@/lib/api";

const RESTRICTED =
  /(\+251[\d\s-]{8,}|09\d{8}|07\d{8}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|@[a-zA-Z0-9_]{3,}|\b\d{10,16}\b)/gi;

function sanitize(text: string) {
  return text.replace(RESTRICTED, "[RESTRICTED CONTACT INFO]");
}

type Message = {
  id: string;
  me: boolean;
  text: string;
  redacted?: boolean;
};

export default function ChatScreen() {
  const router = useRouter();
  const { id: roomId } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!roomId) return;
    let cancelled = false;
    setLoading(true);
    try {
      const data = await apiRequest<any[]>(paths.chatMessages(roomId));
      if (!cancelled) {
        setMessages(
          (data || []).map((m: any) => ({
            id: m.id || String(Date.now() + Math.random()),
            me: m.me || false,
            text: m.text || m.content || "",
            redacted: m.redacted || false,
          })),
        );
      }
    } catch {
      // keep UI even if load fails
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [roomId]);

  const send = async () => {
    if (!input.trim() || !roomId) return;
    const cleaned = sanitize(input.trim());
    const redacted = cleaned !== input.trim();
    const tempId = `temp-${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id: tempId, me: true, text: cleaned, redacted },
    ]);
    setInput("");
    setSending(true);
    try {
      const saved = await apiRequest<any>(paths.chatSendMessage(roomId), {
        method: "POST",
        body: JSON.stringify({ content: cleaned }),
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, id: saved.id || tempId }
            : m,
        ),
      );
    } catch {
      // keep optimistic message on error
    } finally {
      setSending(false);
    }
  };

  const bg = colors.background ?? (isDark ? "#0A1628" : "#F8FAFC");
  const card = colors.card ?? (isDark ? "#112240" : "#FFFFFF");
  const text = colors.text ?? colors.foreground ?? (isDark ? "#F0FAFA" : "#0D2B2A");
  const sub = colors.subtext ?? colors.mutedForeground ?? "#64748B";
  const primary = colors.primary ?? "#0D9488";

  if (loading) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: bg }]} edges={["top"]}>
        <View style={[styles.header, { backgroundColor: card, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ fontSize: 18, color: sub }}>←</Text>
          </Pressable>
          <Text style={[styles.title, { color: text, flex: 1, marginLeft: 10 }]}>Chat</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { backgroundColor: card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: sub }}>←</Text>
        </Pressable>
        <View style={[styles.av, { backgroundColor: primary }]}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>ST</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: text }]}>Chat</Text>
          <Text style={{ color: "#10B981", fontSize: 11 }}>Session chat</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {messages.map((m) => (
          <View key={m.id} style={{ alignItems: m.me ? "flex-end" : "flex-start" }}>
            <View
              style={[
                styles.bubble,
                m.me
                  ? { backgroundColor: primary, borderBottomRightRadius: 4 }
                  : {
                      backgroundColor: isDark ? "#1E3A5F" : "#fff",
                      borderBottomLeftRadius: 4,
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
              ]}
            >
              <Text style={{ color: m.me ? "#fff" : text, fontSize: 14, lineHeight: 20 }}>
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
        {messages.length === 0 && (
          <Text style={{ color: sub, textAlign: "center", marginTop: 40 }}>
            No messages yet. Say hello 👋
          </Text>
        )}
      </ScrollView>

      <View style={[styles.composer, { backgroundColor: card, borderTopColor: colors.border }]}>
        <View style={[styles.inputWrap, { backgroundColor: isDark ? "#1E3A5F" : "#F1F5F9" }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Message..."
            placeholderTextColor={sub}
            style={{ flex: 1, color: text, fontSize: 14, paddingVertical: 8 }}
          />
        </View>
        <Pressable style={[styles.send, { backgroundColor: primary }]} onPress={send} disabled={sending}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>{sending ? "..." : "Send"}</Text>
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
  title: { fontSize: 14, fontWeight: "700" },
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