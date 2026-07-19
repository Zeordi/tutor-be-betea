'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export function useBookings() {
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiClient
      .get<unknown[]>(ENDPOINTS.bookings.list)
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch(() => {
        if (active) setBookings([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { bookings, loading };
}
