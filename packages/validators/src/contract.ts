import { z } from "zod";

export const createContractSchema = z.object({
  teacherId: z.string().uuid(),
  studentId: z.string().uuid(),
  agreedAmount: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const updateContractStatusSchema = z.object({
  status: z.enum([
    "PENDING_ESCROW",
    "ACTIVE",
    "DISPUTED",
    "COMPLETED",
    "REFUNDED",
  ]),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;
