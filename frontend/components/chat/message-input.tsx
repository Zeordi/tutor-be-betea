'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MessageInputProps = {
  onSend: (message: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  disabled?: boolean;
};

export function MessageInput({ onSend, onTypingChange, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  return (
    <form
      className="flex gap-2 border-t border-gray-100 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!message.trim() || disabled) return;
        onSend(message.trim());
        setMessage('');
        onTypingChange?.(false);
      }}
    >
      <Input
        value={message}
        disabled={disabled}
        onChange={(e) => {
          setMessage(e.target.value);
          onTypingChange?.(e.target.value.trim().length > 0);
        }}
        placeholder="Type a message…"
      />
      <Button type="submit" disabled={disabled || !message.trim()}>
        Send
      </Button>
    </form>
  );
}
