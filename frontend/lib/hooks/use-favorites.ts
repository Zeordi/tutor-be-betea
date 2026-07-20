'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { TeacherSearchCard } from '@/lib/hooks/use-teachers';

export type FavoriteItem = {
  id: string;
  teacherId: string;
  createdAt: string;
  teacher: TeacherSearchCard & { isAvailable?: boolean };
};

export function useFavorites() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (status === 'loading') return;
    if (!token) {
      setFavorites([]);
      setLoading(false);
      setError('Sign in required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<FavoriteItem[]>(ENDPOINTS.favorites.list, token);
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      setFavorites([]);
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [token, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const remove = useCallback(
    async (teacherId: string) => {
      if (!token) throw new Error('Sign in required');
      await apiClient.delete(ENDPOINTS.favorites.remove(teacherId), token);
      setFavorites((prev) => prev.filter((f) => f.teacherId !== teacherId));
    },
    [token],
  );

  return { favorites, loading, error, refresh, remove };
}
