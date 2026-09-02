import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";

type Message = {
  roomId: string;
  senderId: string;
  content: string;
  originalBlocked?: boolean;
  createdAt: string;
};

export default function ChatScreen() {
  const { id: roomId } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const bg = isDark ? "#0A1628" : "#F8FAFC";
  const card = isDark ? "#112240" : "#FFFFFF";
  const text = isDark ? "#F0FAFA" : "#0D2B2A";
  const sub = isDark ? "#94A3B8" : "#64748B";
  const primary = "#0D9488";
  const border = isDark ? "#1E3A5F" : "#E2E8F0";
  const headerBg = isDark ? "#0F1B2D" : "#FFFFFF";

  useEffect(() => {
    const socket = io(process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;
    socket.emit("join_room", roomId);
    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !user) return;
    socketRef.current.emit("send_message", {
      roomId,
      content: input.trim(),
      senderId: user.id,
    });
    setInput("");
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top"]}>
      {/* Figma header */}
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: sub, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>ST</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerName, { color: text }]}>Selamawit Tadesse</Text>
          <Text style={{ color: "#10B981", fontSize: 11, fontWeight: "600" }}>
            Online · Verified ✓
          </Text>
        </View>
        <Text style={{ fontSize: 16 }}>📞</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 14, flexGrow: 1, gap: 8 }}
        ListHeaderComponent={
          <View style={styles.dayPill}>
            <Text style={{ color: sub, fontSize: 10 }}>Today</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMe = item.senderId === user?.id;
          return (
            <View style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: isMe ? primary : card,
                    borderBottomRightRadius: isMe ? 4 : 18,
                    borderBottomLeftRadius: isMe ? 18 : 4,
                  },
                ]}
              >
                <Text style={{ color: isMe ? "#fff" : text, fontSize: 13, lineHeight: 18 }}>
                  {item.content}
                </Text>
                {item.originalBlocked && (
                  <Text
                    style={{
                      color: isMe ? "rgba(255,255,255,0.8)" : "#EF4444",
                      fontSize: 10,
                      marginTop: 4,
                      fontWeight: "700",
                    }}
                  >
                    ⚠️ Contact info auto-redacted · Platform policy
                  </Text>
                )}
                <Text
                  style={{
                    color: isMe ? "rgba(255,255,255,0.7)" : sub,
                    fontSize: 10,
                    marginTop: 4,
                    alignSelf: "flex-end",
                  }}
                >
                  {formatTime(item.createdAt)}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>💬</Text>
            <Text style={[styles.emptyTitle, { color: text }]}>No messages yet</Text>
            <Text style={{ color: sub, textAlign: "center", fontSize: 12, lineHeight: 18 }}>
              Send a message to start.{"\n"}
              Phone numbers, Telegram & emails are auto-blocked.
            </Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <View
          style={[
            styles.inputRow,
            { backgroundColor: headerBg, borderTopColor: border },
          ]}
        >
          <View style={[styles.inputWrap, { backgroundColor: isDark ? "#112240" : "#F1F5F9" }]}>
            <Text style={{ fontSize: 16 }}>😊</Text>
            <TextInput
              style={[styles.input, { color: text }]}
              placeholder="Type a message..."
              placeholderTextColor={sub}
              value={input}
              onChangeText={setInput}
              multiline
            />
          </View>
          <Pressable style={[styles.sendBtn, { backgroundColor: primary }]} onPress={sendMessage}>
            <Text style={{ color: "#fff", fontWeight: "800" }}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
  },
  headerName: { fontSize: 13, fontWeight: "800" },
  dayPill: {
    alignSelf: "center",
    backgroundColor: "rgba(148,163,184,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    marginBottom: 8,
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "flex-end",
    borderTopWidth: 1,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: { flex: 1, fontSize: 14, maxHeight: 100 },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});