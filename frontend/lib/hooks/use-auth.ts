'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function useAuth() {
  const { data, status } = useSession();
  return {
    user: data?.user,
    status,
    signIn,
    signOut,
    isAuthenticated: status === 'authenticated',
  };
}
