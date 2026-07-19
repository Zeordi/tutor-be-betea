'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export function useTeachers(query = '') {
  const [teachers, setTeachers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const path = query ? `${ENDPOINTS.teachers.list}?q=${encodeURIComponent(query)}` : ENDPOINTS.teachers.list;
    apiClient
      .get<unknown[]>(path)
      .then((data) => {
        if (active) setTeachers(data);
      })
      .catch(() => {
        if (active) setTeachers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query]);

  return { teachers, loading };
}
