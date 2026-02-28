import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-change-in-production'
);

const JOURNAL_JWT_SECRET = new TextEncoder().encode(
  process.env.JOURNAL_JWT_SECRET || process.env.JWT_SECRET || 'loyola-journal-secret-key-min-32-characters'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect journal dashboard routes
  if (pathname.startsWith('/journals/dashboard')) {
    const token = request.cookies.get('journal_auth_token')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/journals/article-submission';
      url.searchParams.set('error', 'login_required');
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JOURNAL_JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/journals/article-submission';
      url.searchParams.set('error', 'session_expired');
      const response = NextResponse.redirect(url);
      response.cookies.delete('journal_auth_token');
      return response;
    }
  }

  // Protect admission-form route
  if (pathname.startsWith('/admission-form')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'login_required');
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      const emailFromUrl = request.nextUrl.searchParams.get('email');

      if (payload.email !== emailFromUrl) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.searchParams.set('error', 'unauthorized');

        const response = NextResponse.redirect(url);
        response.cookies.delete('auth_token');
        return response;
      }

      return NextResponse.next();

    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'session_expired');

      const response = NextResponse.redirect(url);
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ['/admission-form/:path*', '/journals/dashboard/:path*'],
};
