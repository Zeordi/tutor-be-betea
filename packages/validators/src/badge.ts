import { z } from "zod";

export const BadgeTypeEnum = z.enum([
  "ID_VERIFIED",
  "DEGREE_VERIFIED",
  "GOLD_ELITE",
  "SILVER",
  "BRONZE",
]);

export const issueBadgeSchema = z.object({
  teacherId: z.string().uuid(),
  badgeType: BadgeTypeEnum,
  reason: z.string().min(3).max(500).optional(),
});

export type IssueBadgeInput = z.infer<typeof issueBadgeSchema>;
