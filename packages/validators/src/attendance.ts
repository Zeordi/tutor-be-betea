import { z } from "zod";

export const checkInSchema = z.object({
  contractId: z.string().uuid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive().optional(),
  // Signed payload for offline sync
  signedPayload: z.string().optional(),
});

export const checkOutSchema = checkInSchema.extend({
  attendanceLogId: z.string().uuid(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
