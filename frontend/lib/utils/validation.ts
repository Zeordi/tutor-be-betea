import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(['PARENT', 'TEACHER']),
});

export const bookingSchema = z.object({
  teacherId: z.string().uuid(),
  startsAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
});
