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
  isVerified?: boolean;
};

type TokenBundle = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    if (!token.refreshToken) {
      return { ...token, error: 'RefreshAccessTokenError' };
    }

    const data = await apiClient.post<TokenBundle>(ENDPOINTS.auth.refresh, {
      refreshToken: token.refreshToken,
    });

    const expiresInMs = (data.expiresIn ?? 15 * 60) * 1000;
    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + expiresInMs,
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

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
            expiresIn?: number;
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
            isVerified: Boolean(data.user.isVerified),
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
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
        const u = user as {
          accessToken?: string;
          refreshToken?: string;
          role?: string;
          isVerified?: boolean;
          expiresIn?: number;
        };
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.role = u.role;
        token.isVerified = u.isVerified;
        token.accessTokenExpires = Date.now() + (u.expiresIn ?? 15 * 60) * 1000;
        token.sub = user.id;
        return token;
      }

      if (
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires - 30_000
      ) {
        return token;
      }

      return (await refreshAccessToken(token as Record<string, unknown>)) as typeof token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub;
        (session.user as { role?: string }).role = token.role as string | undefined;
        (session.user as { isVerified?: boolean }).isVerified = Boolean(token.isVerified);
      }
      (session as { accessToken?: string }).accessToken = token.accessToken as string | undefined;
      (session as { error?: string }).error = token.error as string | undefined;
      return session;
    },
  },
};
