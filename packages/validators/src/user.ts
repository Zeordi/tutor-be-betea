import { z } from "zod";

export const UserRoleEnum = z.enum([
  "PARENT",
  "TEACHER",
  "SUPPORT_AGENT",
  "SUPER_ADMIN",
]);

export const UserStatusEnum = z.enum([
  "PENDING_VERIFICATION",
  "ACTIVE",
  "SUSPENDED",
  "BANNED",
]);

export const createUserSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^(\+251|0)(9|7)\d{8}$/, "Invalid Ethiopian phone number"),
  email: z.string().email().optional(),
  fullName: z.string().min(2).max(120),
  role: UserRoleEnum,
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
