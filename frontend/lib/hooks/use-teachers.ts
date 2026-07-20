'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export type TeacherSearchCard = {
  id: string;
  name: string;
  subject: string;
  subjects?: string[];
  rating: number;
  reviews: number;
  price: number;
  distance: string;
  image: string;
  verified: boolean;
  experience: number;
  availability: string[];
  isFavorite?: boolean;
};

export type TeacherSearchResponse = {
  data: TeacherSearchCard[];
  total: number;
  page: number;
  totalPages: number;
};

export type TeacherSearchParams = {
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  radius?: number;
  page?: number;
  limit?: number;
};

export function useTeacherSearch(params: TeacherSearchParams, enabled = true) {
  const [result, setResult] = useState<TeacherSearchResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams();
      if (params.subject?.trim()) qs.set('subject', params.subject.trim());
      if (params.minPrice != null) qs.set('minPrice', String(params.minPrice));
      if (params.maxPrice != null) qs.set('maxPrice', String(params.maxPrice));
      if (params.rating) qs.set('rating', String(params.rating));
      if (params.radius) qs.set('radius', String(params.radius));
      qs.set('page', String(params.page || 1));
      qs.set('limit', String(params.limit || 12));

      const data = await apiClient.get<TeacherSearchResponse>(
        `${ENDPOINTS.teachers.search}?${qs.toString()}`,
      );
      setResult({
        data: Array.isArray(data?.data) ? data.data : [],
        total: data?.total ?? 0,
        page: data?.page ?? 1,
        totalPages: data?.totalPages ?? 1,
      });
    } catch (err) {
      setResult({ data: [], total: 0, page: 1, totalPages: 1 });
      setError(err instanceof Error ? err.message : 'Failed to search teachers');
    } finally {
      setLoading(false);
    }
  }, [
    enabled,
    params.subject,
    params.minPrice,
    params.maxPrice,
    params.rating,
    params.radius,
    params.page,
    params.limit,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...result, loading, error, refresh };
}

export function useTeacher(id: string) {
  const [teacher, setTeacher] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiClient
      .get<Record<string, unknown>>(ENDPOINTS.teachers.byId(id))
      .then((data) => {
        if (active) setTeacher(data);
      })
      .catch((err) => {
        if (active) {
          setTeacher(null);
          setError(err instanceof Error ? err.message : 'Teacher not found');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { teacher, loading, error };
}

export function useFavoriteIds() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setIds([]);
      return;
    }
    setLoading(true);
    try {
      const data = await apiClient.get<string[]>(ENDPOINTS.favorites.ids, token);
      setIds(Array.isArray(data) ? data : []);
    } catch {
      setIds([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (teacherId: string) => {
      if (!token) throw new Error('Sign in to save favorites');
      const isFav = ids.includes(teacherId);
      if (isFav) {
        await apiClient.delete(ENDPOINTS.favorites.remove(teacherId), token);
        setIds((prev) => prev.filter((id) => id !== teacherId));
      } else {
        await apiClient.post(ENDPOINTS.favorites.create, { teacherId }, token);
        setIds((prev) => [...prev, teacherId]);
      }
    },
    [ids, token],
  );

  return { ids, loading, refresh, toggle, isAuthenticated: Boolean(token) };
}
