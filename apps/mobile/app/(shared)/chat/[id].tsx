import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
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
  const { id: roomId } = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.emit("join_room", roomId);

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chat</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          Protected by Anti-Poaching Shield
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 16, gap: 10 }}
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
              <Text style={{ color: isMe ? "#fff" : colors.text }}>{item.content}</Text>
              {item.originalBlocked && (
                <Text style={{ color: isMe ? "#ffffff99" : colors.warning, fontSize: 11, marginTop: 4 }}>
                  Contact info was blocked
                </Text>
              )}
            </View>
          );
        }}
      />

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
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={sendMessage}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#00000010" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
