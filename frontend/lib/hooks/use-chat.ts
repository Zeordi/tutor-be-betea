'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io, type Socket } from 'socket.io-client';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export type ChatMessage = {
  id: string;
  bookingId?: string;
  senderId: string;
  receiverId?: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
  attachmentUrl?: string | null;
  fromSelf: boolean;
};

type HistoryResponse = {
  bookingId?: string;
  messages: Array<{
    id: string;
    bookingId?: string;
    senderId: string;
    receiverId?: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    attachmentUrl?: string | null;
  }>;
  total: number;
  page: number;
  totalPages: number;
};

type UseChatOptions = {
  bookingId: string;
  enabled?: boolean;
};

function normalizeMessage(
  raw: {
    id: string;
    bookingId?: string;
    senderId: string;
    receiverId?: string;
    message?: string;
    body?: string;
    createdAt?: string;
    isRead?: boolean;
    attachmentUrl?: string | null;
  },
  currentUserId: string,
): ChatMessage {
  return {
    id: raw.id,
    bookingId: raw.bookingId,
    senderId: raw.senderId,
    receiverId: raw.receiverId,
    message: raw.message || raw.body || '',
    createdAt: raw.createdAt,
    isRead: raw.isRead,
    attachmentUrl: raw.attachmentUrl,
    fromSelf: raw.senderId === currentUserId,
  };
}

export function useChat({ bookingId, enabled = true }: UseChatOptions) {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const currentUserId = session?.user?.id || '';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [peerTyping, setPeerTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const upsertMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) {
        return prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m));
      }
      // Drop optimistic temp messages with same text from self
      const withoutTemp = prev.filter(
        (m) => !(m.id.startsWith('temp-') && m.fromSelf && m.message === msg.message),
      );
      return [...withoutTemp, msg];
    });
  }, []);

  useEffect(() => {
    if (!enabled || !bookingId || !token || !currentUserId) {
      setConnected(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    apiClient
      .get<HistoryResponse>(
        `${ENDPOINTS.chat.history}?bookingId=${encodeURIComponent(bookingId)}&page=1&limit=50`,
        token,
      )
      .then((history) => {
        if (!active) return;
        const rows = Array.isArray(history?.messages) ? history.messages : [];
        setMessages(rows.map((m) => normalizeMessage(m, currentUserId)));
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load chat history');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';
    const socket = io(`${wsUrl}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (active) setConnected(true);
    });
    socket.on('disconnect', () => {
      if (active) setConnected(false);
    });
    socket.on('connect_error', () => {
      if (active) {
        setConnected(false);
        setError('Could not connect to chat');
      }
    });

    socket.on('new-message', (raw: Parameters<typeof normalizeMessage>[0]) => {
      if (!active) return;
      if (raw.bookingId && raw.bookingId !== bookingId) return;
      upsertMessage(normalizeMessage(raw, currentUserId));
      if (raw.id) socket.emit('mark-read', { messageId: raw.id });
    });

    socket.on('message-sent', (raw: Parameters<typeof normalizeMessage>[0]) => {
      if (!active) return;
      if (raw.bookingId && raw.bookingId !== bookingId) return;
      upsertMessage(normalizeMessage(raw, currentUserId));
    });

    socket.on('typing-status', (payload: { bookingId?: string; isTyping?: boolean }) => {
      if (!active) return;
      if (payload.bookingId && payload.bookingId !== bookingId) return;
      setPeerTyping(Boolean(payload.isTyping));
    });

    socket.on('chat-history', (history: HistoryResponse) => {
      if (!active) return;
      const rows = Array.isArray(history?.messages) ? history.messages : [];
      setMessages(rows.map((m) => normalizeMessage(m, currentUserId)));
    });

    return () => {
      active = false;
      if (typingTimer.current) clearTimeout(typingTimer.current);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [bookingId, token, currentUserId, enabled, upsertMessage]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !socketRef.current || !currentUserId) return;

      const tempId = `temp-${crypto.randomUUID()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          bookingId,
          senderId: currentUserId,
          message: trimmed,
          createdAt: new Date().toISOString(),
          fromSelf: true,
        },
      ]);

      socketRef.current.emit('send-message', {
        bookingId,
        message: trimmed,
      });
    },
    [bookingId, currentUserId],
  );

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      socketRef.current?.emit('typing', { bookingId, isTyping });
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (isTyping) {
        typingTimer.current = setTimeout(() => {
          socketRef.current?.emit('typing', { bookingId, isTyping: false });
        }, 1500);
      }
    },
    [bookingId],
  );

  return {
    messages,
    sendMessage,
    notifyTyping,
    peerTyping,
    connected,
    loading,
    error,
    currentUserId,
  };
}
