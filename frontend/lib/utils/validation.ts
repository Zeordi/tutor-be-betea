import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  userType: z.enum(['PARENT', 'TEACHER']),
});

export const bookingSchema = z.object({
  teacherId: z.string().uuid(),
  studentName: z.string().min(1),
  studentAge: z.number().int().min(3).max(25),
  bookingDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  learningGoals: z.string().max(500).optional(),
});
