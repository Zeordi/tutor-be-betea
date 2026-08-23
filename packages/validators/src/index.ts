import { z } from "zod";

// ==========================================
// 1. USER & AUTH (from user.ts)
// ==========================================
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

// ==========================================
// 2. TEACHER PROFILE (from teacher.ts)
// ==========================================
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

// ==========================================
// 3. JOB (from job.ts)
// ==========================================
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

// ==========================================
// 4. CONTRACT (from contract.ts)
// ==========================================
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

// ==========================================
// 5. ATTENDANCE (from attendance.ts)
// ==========================================
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

// ==========================================
// 6. BADGE (from badge.ts)
// ==========================================
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

// ==========================================
// 7. VAULT (from vault.ts)
// ==========================================
export const DocumentTypeEnum = z.enum([
  "NATIONAL_ID", // Fayda / Kebele
  "PASSPORT",
  "DEGREE",
  "TRANSCRIPT",
  "LIVENESS_SELFIE",
]);

export const uploadVaultDocumentSchema = z.object({
  teacherId: z.string().uuid(),
  documentType: DocumentTypeEnum,
  // File will be handled as multipart; we only validate metadata here
  fileName: z.string().min(1),
  mimeType: z.string().regex(/^image\/(jpeg|png|webp)|application\/pdf$/),
});

export type UploadVaultDocumentInput = z.infer<typeof uploadVaultDocumentSchema>;

// ==========================================
// 8. CHAT & ANTI-POACHING (from chat.ts)
// ==========================================
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