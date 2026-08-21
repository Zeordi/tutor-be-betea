import { z } from "zod";

export const sendMessageSchema = z.object({
  roomId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

// Anti-poaching detection patterns (used by the service)
export const RESTRICTED_PATTERNS = {
  ethiopianPhone: /(\+251|0)(9|7)\d{8}/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  telegram: /@\w{4,}/g,
  bankAccount: /\b\d{10,16}\b/g,
} as const;

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
