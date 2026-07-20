import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

function roleHome(role?: string) {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'TEACHER') return '/teacher/dashboard';
  return '/parent/dashboard';
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;
    const isVerified = Boolean(token?.isVerified);
    const path = req.nextUrl.pathname;

    const loginRedirect = (error?: string) => {
      const login = new URL('/login', req.url);
      login.searchParams.set('callbackUrl', path);
      if (error) login.searchParams.set('error', error);
      return NextResponse.redirect(login);
    };

    if (path.startsWith('/admin')) {
      if (role !== 'ADMIN') return loginRedirect('AdminAccessRequired');
      return NextResponse.next();
    }

    if (path.startsWith('/teacher')) {
      if (role !== 'TEACHER') return loginRedirect('TeacherAccessRequired');
      if (!isVerified) {
        return NextResponse.redirect(new URL('/verify-email?required=1', req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith('/parent')) {
      if (role !== 'PARENT') {
        // Admins can peek parent surfaces if needed; teachers cannot.
        if (role === 'ADMIN') return NextResponse.next();
        return loginRedirect('ParentAccessRequired');
      }
      if (!isVerified) {
        return NextResponse.redirect(new URL('/verify-email?required=1', req.url));
      }
      return NextResponse.next();
    }

    // Generic /dashboard helper route
    if (path === '/dashboard' || path.startsWith('/dashboard/')) {
      return NextResponse.redirect(new URL(roleHome(role), req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (
          path.startsWith('/admin') ||
          path.startsWith('/teacher') ||
          path.startsWith('/parent') ||
          path === '/dashboard' ||
          path.startsWith('/dashboard/')
        ) {
          return Boolean(token);
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*', '/parent/:path*', '/dashboard', '/dashboard/:path*'],
};
