import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";
import { encryptBuffer, decryptToBuffer } from "@tutor/encryption";
import { AuditService } from "../audit/audit.service";

export type VaultDocumentType =
  | "NATIONAL_ID"
  | "PASSPORT"
  | "DEGREE"
  | "TRANSCRIPT"
  | "LIVENESS_SELFIE";

@Injectable()
export class VaultService {
  constructor(private readonly auditService: AuditService) {}

  async uploadDocument(params: {
    teacherId: string;
    documentType: VaultDocumentType;
    fileBuffer: Buffer;
    uploadedBy: string;
    mimeType?: string;
  }) {
    if (!params.fileBuffer?.length) {
      throw new NotFoundException("Empty file");
    }

    const encrypted = encryptBuffer(params.fileBuffer);

    const doc = await prisma.vaultDocument.create({
      data: {
        teacherId: params.teacherId,
        documentType: params.documentType,
        encryptedData: JSON.stringify({
          ...encrypted,
          mimeType: params.mimeType || "application/octet-stream",
        }),
        status: "PENDING",
      },
    });

    // Teacher uploads are not admin actions; no audit decrypt log here.
    return {
      id: doc.id,
      documentType: doc.documentType,
      status: doc.status,
      createdAt: doc.createdAt,
    };
  }

  async getDecryptedDocument(
    documentId: string,
    adminId: string,
    ipAddress: string,
  ) {
    const doc = await prisma.vaultDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      throw new NotFoundException("Document not found in secure vault");
    }

    const payload = JSON.parse(doc.encryptedData);
    const decryptedBuffer = decryptToBuffer({
      ciphertext: payload.ciphertext,
      iv: payload.iv,
      tag: payload.tag,
    });

    await this.auditService.createLog({
      adminId,
      actionType: "DECRYPT_VAULT_DOCUMENT",
      targetUserId: doc.teacherId,
      reason: `Admin inspected ${doc.documentType} (Doc ID: ${doc.id})`,
      ipAddress,
      statePayload: {
        documentId: doc.id,
        documentType: doc.documentType,
        fileSizeBytes: decryptedBuffer.length,
      },
    });

    return {
      id: doc.id,
      documentType: doc.documentType,
      status: doc.status,
      mimeType: payload.mimeType || "application/octet-stream",
      base64Data: decryptedBuffer.toString("base64"),
      teacherId: doc.teacherId,
      createdAt: doc.createdAt,
    };
  }

  async listTeacherDocuments(teacherId: string) {
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

  async listPending() {
    return prisma.vaultDocument.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        teacherId: true,
        documentType: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }
}