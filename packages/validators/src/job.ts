import { z } from "zod";

export const createJobSchema = z.object({
  studentId: z.string().uuid(),
  subjects: z.array(z.string()).min(1),
  monthlyBudget: z.number().positive(),
  isUrgentBoost: z.boolean().default(false),
  locationLat: z.number().min(-90).max(90),
  locationLng: z.number().min(-180).max(180),
  notes: z.string().max(1000).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
