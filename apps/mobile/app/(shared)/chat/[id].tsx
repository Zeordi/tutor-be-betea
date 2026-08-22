// apps/mobile/app/(shared)/chat/[id].tsx
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";

type Message = {
  roomId: string;
  senderId: string;
  content: string;
  originalBlocked?: boolean;
  createdAt: string;
};

export default function ChatScreen() {
  const { id: roomId } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const socket = io(process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socket.emit("join_room", roomId);

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
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
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border || "#00000010" }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chat</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          Protected by Anti-Poaching Shield
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === user?.id;
          return (
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: isMe ? colors.primary : colors.surface,
                  alignSelf: isMe ? "flex-end" : "flex-start",
                },
              ]}
            >
              <Text style={{ color: isMe ? "#fff" : colors.text, fontSize: 15 }}>
                {item.content}
              </Text>

              {item.originalBlocked && (
                <Text
                  style={{
                    color: isMe ? "rgba(255,255,255,0.75)" : colors.warning || "#D97706",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  Contact info was blocked
                </Text>
              )}

              <Text
                style={{
                  color: isMe ? "rgba(255,255,255,0.7)" : colors.textSecondary,
                  fontSize: 11,
                  marginTop: 4,
                  alignSelf: "flex-end",
                }}
              >
                {formatTime(item.createdAt)}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No messages yet</Text>
            <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 8 }}>
              Send a message to start the conversation.{"\n"}
              All contact information is automatically protected.
            </Text>
          </View>
        }
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={[styles.inputRow, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={sendMessage}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});
