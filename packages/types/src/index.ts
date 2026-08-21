export type UserRole = "PARENT" | "TEACHER" | "SUPPORT_AGENT" | "SUPER_ADMIN";

export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "BANNED";

export type ContractStatus =
  | "PENDING_ESCROW"
  | "ACTIVE"
  | "DISPUTED"
  | "COMPLETED"
  | "REFUNDED";

export type BadgeType =
  | "ID_VERIFIED"
  | "DEGREE_VERIFIED"
  | "GOLD_ELITE"
  | "SILVER"
  | "BRONZE";

export type DocumentType =
  | "NATIONAL_ID"
  | "PASSPORT"
  | "DEGREE"
  | "TRANSCRIPT"
  | "LIVENESS_SELFIE";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
