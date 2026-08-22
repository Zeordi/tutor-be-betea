import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { encryptBuffer, decryptToBuffer } from "@tutor/encryption";
import { createAuditHash } from "@tutor/audit";

@Injectable()
export class VaultService {
  /**
   * Upload a sensitive document (ID, Degree, Liveness Selfie)
   * Document is encrypted with AES-256-GCM before storing
   */
  async uploadDocument(params: {
    teacherId: string;
    documentType: "NATIONAL_ID" | "PASSPORT" | "DEGREE" | "TRANSCRIPT" | "LIVENESS_SELFIE";
    fileBuffer: Buffer;
    uploadedBy: string; // admin or the teacher
  }) {
    const encrypted = encryptBuffer(params.fileBuffer);

    const doc = await prisma.vaultDocument.create({
      data: {
        teacherId: params.teacherId,
        documentType: params.documentType,
        encryptedData: JSON.stringify(encrypted), // store ciphertext + iv + tag
        status: "PENDING",
      },
    });

    return {
      id: doc.id,
      documentType: doc.documentType,
      status: doc.status,
      createdAt: doc.createdAt,
    };
  }

  /**
   * Only Super Admins / Verification Officers can decrypt and view
   */
  async getDecryptedDocument(documentId: string, adminId: string) {
    const doc = await prisma.vaultDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      throw new NotFoundException("Document not found");
    }

    const payload = JSON.parse(doc.encryptedData);
    const decryptedBuffer = decryptToBuffer(payload);

    // TODO: Write to audit log that admin viewed this document

    return {
      documentType: doc.documentType,
      buffer: decryptedBuffer,
      teacherId: doc.teacherId,
    };
  }

  async listTeacherDocuments(teacherId: string) {
    // Returns metadata only – never the encrypted content to non-admins
    return prisma.vaultDocument.findMany({
      where: { teacherId },
      select: {
        id: true,
        documentType: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
