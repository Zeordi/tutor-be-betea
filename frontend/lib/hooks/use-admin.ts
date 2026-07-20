'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  userType: 'PARENT' | 'TEACHER' | 'ADMIN' | string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  teacherProfile?: {
    id: string;
    verificationStatus: string;
    avgRating: number | string;
    hourlyRate: number | string;
  } | null;
};

export type AdminVerification = {
  id: string;
  teacherId: string;
  verificationType: string;
  status: string;
  documentUrls?: unknown;
  reviewedBy?: string | null;
  reviewNotes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  teacher?: {
    id: string;
    verificationStatus?: string;
    subjects?: unknown;
    experienceYears?: number;
    user?: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
    };
  };
};

export type AdminDispute = {
  id: string;
  bookingId: string;
  raisedBy: string;
  reason: string;
  description?: string | null;
  status: string;
  resolution?: string | null;
  resolutionDetails?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
  booking?: {
    id: string;
    studentName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalAmount: number | string;
    status: string;
  };
  raisedByUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  resolvedByUser?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
};

export type ManageUserPayload = {
  userId: string;
  disabled?: boolean;
  emailVerified?: boolean;
  approveVerification?: boolean;
};

export type ResolveDisputePayload = {
  bookingId: string;
  resolution: 'REFUND' | 'RELEASE' | 'PARTIAL';
  notes: string;
  refundAmount?: number;
};

function useAdminToken() {
  const { data: session, status } = useSession();
  return {
    token: session?.accessToken,
    ready: status !== 'loading',
    role: session?.user?.role,
  };
}

export function useAdminUsers() {
  const { token, ready } = useAdminToken();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!ready) return;
    if (!token) {
      setUsers([]);
      setLoading(false);
      setError('Sign in as admin required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<AdminUser[]>(ENDPOINTS.admin.users, token);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUsers([]);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token, ready]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const manageUser = useCallback(
    async (payload: ManageUserPayload) => {
      if (!token) throw new Error('Sign in required');
      return apiClient.patch(ENDPOINTS.admin.users, payload, token);
    },
    [token],
  );

  return { users, loading, error, refresh, manageUser };
}

export function useAdminVerifications() {
  const { token, ready } = useAdminToken();
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!ready) return;
    if (!token) {
      setVerifications([]);
      setLoading(false);
      setError('Sign in as admin required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<AdminVerification[]>(
        ENDPOINTS.admin.verifications,
        token,
      );
      setVerifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setVerifications([]);
      setError(err instanceof Error ? err.message : 'Failed to load verifications');
    } finally {
      setLoading(false);
    }
  }, [token, ready]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const approveTeacher = useCallback(
    async (userId: string) => {
      if (!token) throw new Error('Sign in required');
      return apiClient.patch(
        ENDPOINTS.admin.users,
        { userId, approveVerification: true },
        token,
      );
    },
    [token],
  );

  return { verifications, loading, error, refresh, approveTeacher };
}

export function useAdminDisputes() {
  const { token, ready } = useAdminToken();
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!ready) return;
    if (!token) {
      setDisputes([]);
      setLoading(false);
      setError('Sign in as admin required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<AdminDispute[]>(ENDPOINTS.admin.disputes, token);
      setDisputes(Array.isArray(data) ? data : []);
    } catch (err) {
      setDisputes([]);
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }, [token, ready]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resolveDispute = useCallback(
    async (payload: ResolveDisputePayload) => {
      if (!token) throw new Error('Sign in required');
      return apiClient.patch(ENDPOINTS.admin.disputes, payload, token);
    },
    [token],
  );

  return { disputes, loading, error, refresh, resolveDispute };
}
