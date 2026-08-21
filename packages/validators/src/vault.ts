import { z } from "zod";

export const DocumentTypeEnum = z.enum([
  "NATIONAL_ID",      // Fayda / Kebele
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
