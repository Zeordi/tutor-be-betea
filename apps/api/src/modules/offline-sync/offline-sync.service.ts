import { Injectable } from "@nestjs/common";
import { createHmac } from "crypto";
import { AttendanceService } from "../attendance/attendance.service";

@Injectable()
export class OfflineSyncService {
  constructor(private readonly attendanceService: AttendanceService) {}

  private verifySignature(payload: string, signature: string): boolean {
    const secret = process.env.OFFLINE_SYNC_SECRET || process.env.JWT_SECRET;
    if (!secret) return false;

    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    return expected === signature;
  }

  async syncAttendanceBatch(params: {
    teacherId: string;
    records: any[];
  }) {
    const results = [];

    for (const record of params.records) {
      const isValid = this.verifySignature(record.rawPayload, record.signature);

      if (!isValid) {
        results.push({ contractId: record.contractId, success: false, error: "Invalid signature" });
        continue;
      }

      try {
        const result = await this.attendanceService.checkIn({
          contractId: record.contractId,
          teacherId: params.teacherId,
          latitude: record.latitude,
          longitude: record.longitude,
          parentLat: record.parentLat,
          parentLng: record.parentLng,
          offlineId: record.offlineId || record.id,
          clientCreatedAt: record.clientCreatedAt || record.createdAt,
          distanceMeters: record.distanceMeters,
          isVerifiedGeofence: record.isVerifiedGeofence,
        });
        results.push({ contractId: record.contractId, success: true, data: result });
      } catch (error: any) {
        results.push({ contractId: record.contractId, success: false, error: error.message });
      }
    }

    return {
      total: params.records.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }
}
