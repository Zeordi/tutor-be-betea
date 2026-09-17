import { api } from "./api";

export type AdminDashboardStats = {
  tutors: number;
  parents: number;
  activeContracts: number;
  openTickets: number;
  pendingVerifications: number;
};

export type AdminUser = {
  id: string;
  fullName: string;
  email?: string;
  role: string;
  status?: string;
  phoneNumber?: string;
  subCity?: string;
  createdAt?: string;
};

export type AdminVerificationItem = {
  id: string;
  teacherId: string;
  documentType: string;
  status: string;
  adminNote?: string;
  createdAt: string;
};

export type AdminVaultDocument = {
  id: string;
  teacherId: string;
  documentType: string;
  status: string;
  adminNote?: string;
  createdAt: string;
};

export type AdminPayout = {
  id: string;
  amount: number | string;
  status: string;
  provider?: string;
  createdAt: string;
  teacher?: {
    id: string;
    fullName: string;
    phoneNumber?: string;
  };
};

export type AdminRiskFlag = {
  id: string;
  userId: string;
  reason: string;
  severity: string;
  resolved: boolean;
  createdAt: string;
  user?: {
    fullName: string;
    role: string;
    status?: string;
  };
};

export type AdminSupportTicket = {
  id: string;
  reasonType: string;
  status: string;
  createdAt: string;
  userId?: string;
  contractId?: string;
};

export type AdminAuditLog = {
  id: string;
  adminId: string;
  actionType: string;
  targetUserId?: string;
  reason?: string;
  createdAt: string;
};

export type AdminContract = {
  id: string;
  parentId: string;
  teacherId: string;
  studentId: string;
  agreedAmount: string;
  platformFeePercent: string;
  escrowHeldAmount: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type AdminPromo = {
  id: string;
  code: string;
  description?: string;
  discountPct: string;
  discountEtb: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  bannerText?: string;
  expiresAt?: string;
  createdAt: string;
};

export type AdminAttendanceLog = {
  id: string;
  contractId: string;
  teacherId: string;
  checkInTime: string;
  checkOutTime?: string;
  distanceMeters: string;
  isVerifiedGeofence: boolean;
  parentConfirmed: boolean;
  createdAt: string;
};

export const adminApi = {
  dashboard: () => api.get<AdminDashboardStats>("/admin/dashboard"),

  attendanceList: (limit = 50) =>
    api.get<AdminAttendanceLog[]>(`/admin/attendance?limit=${limit}`),

  users: (params?: { role?: string; status?: string; page?: number; limit?: number; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.role) qs.set("role", params.role);
    if (params?.status) qs.set("status", params.status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.search) qs.set("search", params.search);
    const qsStr = qs.toString();
    return api.get<{ data: AdminUser[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(`/users${qsStr ? `?${qsStr}` : ""}`);
  },

  user: (id: string) => api.get<AdminUser>(`/users/${id}`),

  verificationQueue: () => api.get<AdminVerificationItem[]>("/admin/verification-queue"),

  approveVerification: (userId: string) =>
    api.post(`/admin/verification/${userId}/approve`, {}),

   rejectVerification: (userId: string, reason?: string) =>
     api.post(`/admin/verification/${userId}/reject`, { reason }),

  requestMoreVerification: (documentId: string, reason: string) =>
    api.post(`/verification/${documentId}/request-more`, { reason }),

  revokeVerification: (documentId: string, reason?: string) =>
    api.post(`/verification/${documentId}/revoke`, { reason }),

  vaultPending: () => api.get<AdminVaultDocument[]>("/vault/pending"),

  vaultTeacherDocuments: (teacherId: string) =>
    api.get<AdminVaultDocument[]>(`/vault/teacher/${teacherId}`),

  vaultDecrypt: (documentId: string) =>
    api.get(`/vault/${documentId}/decrypt`),

  contracts: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const qsStr = qs.toString();
    return api.get<AdminContract[]>(`/contracts${qsStr ? `?${qsStr}` : ""}`);
  },

  payoutUpdate: (payoutId: string, status: string) =>
    api.patch(`/admin/payout-ledger/${payoutId}`, { status }),

  payouts: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.limit) qs.set("limit", String(params.limit));
    const qsStr = qs.toString();
    return api.get<AdminPayout[]>(`/admin/payout-ledger${qsStr ? `?${qsStr}` : ""}`);
  },

  tickets: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const qsStr = qs.toString();
    return api.get<AdminSupportTicket[]>(`/support${qsStr ? `?${qsStr}` : ""}`);
  },

  ticket: (id: string) => api.get<AdminSupportTicket>(`/support/${id}`),

  payoutLedger: () => api.get<AdminPayout[]>("/admin/payout-ledger"),

  riskFlags: () => api.get<AdminRiskFlag[]>("/admin/risk-flags"),

  clearRiskFlag: (flagId: string) =>
    api.post(`/admin/risk-flags/${flagId}/clear`, {}),

  startImpersonation: (userId: string, reason?: string) =>
    api.post(`/admin/impersonate/${userId}`, { reason }),

  promos: () => api.get<AdminPromo[]>("/admin/promos"),

  upsertPromo: (body: any) => api.post("/admin/promos", body),

  auditLogs: (limit = 100) => api.get(`/admin/audit-logs?limit=${limit}`),

  analytics: () => api.get("/admin/analytics"),

  settings: () => api.get("/admin/settings"),

  updateSettings: (body: any) => api.patch("/admin/settings", body),
};
