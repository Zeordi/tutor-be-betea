import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

type AuthUser = {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  userType?: string;
  role?: string;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const data = await apiClient.post<{
            accessToken: string;
            refreshToken?: string;
            user: AuthUser;
          }>(ENDPOINTS.auth.login, {
            email: credentials.email,
            password: credentials.password,
          });

          const role = data.user.userType || data.user.role || 'PARENT';
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.fullName || data.user.name || data.user.email,
            role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
        token.role = (user as { role?: string }).role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { role?: string }).role = token.role as string | undefined;
        (session as { accessToken?: string }).accessToken = token.accessToken as string | undefined;
      }
      return session;
    },
  },
};
