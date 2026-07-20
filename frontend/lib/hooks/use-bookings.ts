'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export type BookingRow = {
  id: string;
  teacherId: string;
  parentId: string;
  studentName: string;
  studentAge: number;
  learningGoals?: string | null;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  status: string;
  totalAmount: number;
  isTrialLesson: boolean;
  teacher?: {
    id: string;
    name: string;
    image?: string;
    subjects?: string[];
    hourlyRate?: number;
  };
  parent?: {
    id: string;
    name: string;
    email?: string;
    image?: string;
  };
  payments?: Array<{
    id: string;
    status: string;
    amount: number;
    stripePaymentIntent?: string | null;
  }>;
};

export type BookingsListResponse = {
  data: BookingRow[];
  total: number;
  page: number;
  totalPages: number;
};

export type CreateBookingPayload = {
  teacherId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  studentName: string;
  studentAge: number;
  learningGoals?: string;
  isTrialLesson?: boolean;
};

export function useBookings(status?: string) {
  const { data: session, status: sessionStatus } = useSession();
  const token = session?.accessToken;
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (sessionStatus === 'loading') return;
    if (!token) {
      setBookings([]);
      setLoading(false);
      setError('Sign in required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams();
      if (status) qs.set('status', status);
      qs.set('limit', '50');
      const path = qs.toString()
        ? `${ENDPOINTS.bookings.list}?${qs.toString()}`
        : ENDPOINTS.bookings.list;
      const result = await apiClient.get<BookingsListResponse>(path, token);
      setBookings(Array.isArray(result?.data) ? result.data : []);
      setTotal(result?.total ?? 0);
    } catch (err) {
      setBookings([]);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [token, status, sessionStatus]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createBooking = useCallback(
    async (payload: CreateBookingPayload) => {
      if (!token) throw new Error('Sign in required');
      return apiClient.post(ENDPOINTS.bookings.create, payload, token);
    },
    [token],
  );

  const confirmBooking = useCallback(
    async (id: string) => {
      if (!token) throw new Error('Sign in required');
      return apiClient.put(ENDPOINTS.bookings.confirm(id), {}, token);
    },
    [token],
  );

  const completeBooking = useCallback(
    async (id: string) => {
      if (!token) throw new Error('Sign in required');
      return apiClient.post(ENDPOINTS.bookings.complete(id), {}, token);
    },
    [token],
  );

  const cancelBooking = useCallback(
    async (id: string, reason: string) => {
      if (!token) throw new Error('Sign in required');
      return apiClient.post(ENDPOINTS.bookings.cancel(id), { reason }, token);
    },
    [token],
  );

  return {
    bookings,
    total,
    loading,
    error,
    refresh,
    createBooking,
    confirmBooking,
    completeBooking,
    cancelBooking,
  };
}
