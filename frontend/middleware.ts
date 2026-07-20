import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && role !== 'ADMIN') {
      const login = new URL('/login', req.url);
      login.searchParams.set('callbackUrl', path);
      login.searchParams.set('error', 'AdminAccessRequired');
      return NextResponse.redirect(login);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return Boolean(token);
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: ['/admin/:path*'],
};
