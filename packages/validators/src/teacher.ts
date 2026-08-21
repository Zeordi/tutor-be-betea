import { z } from "zod";

export const teacherProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  hourlyRate: z.number().positive(),
  monthlyRate: z.number().positive(),
  subjects: z.array(z.string()).min(1),
  grades: z.array(z.string()).min(1),
  maxTravelKm: z.number().min(1).max(50).default(5),
});

export const updateTeacherProfileSchema = teacherProfileSchema.partial();

export type TeacherProfileInput = z.infer<typeof teacherProfileSchema>;
